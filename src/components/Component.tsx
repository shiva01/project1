'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useAccount } from 'wagmi'
import { useEffect, useState, useRef } from 'react'
import {
  ConnectButton
} from '@rainbow-me/rainbowkit';
import ChatboxSDK from 'groupfi-chatbox-sdk'
import 'groupfi-chatbox-sdk/dist/esm/assets/style.css'
import { ArticlePreview } from '../lib/scraper';
import { SVGProps } from 'react';

export function Component() {

  const account = useAccount()
  const [isChatboxReady, setIsChatboxReady] = useState(false)
  const [walletProvider, setWalletProvider] = useState<
    undefined | null | unknown
  >(undefined)
  const isGettingWalletProvider = useRef(false)

  useEffect(() => {
    const handleChatboxReady = () => {
      setIsChatboxReady(true)
      console.log("handleChatboxReady rendered");

      ChatboxSDK.request({
        method: 'setGroups',
        params: {
          includes: [{ groupId: 'groupfiETHGlobalSingaporePack9ba9067c82621a028e3576b2ef2982588f096601a5180cb57962fe3d434a4c96' }]
        }
      })
    } 

    ChatboxSDK.events.on('chatbox-ready', handleChatboxReady)

    return () => {
      ChatboxSDK.events.off('chatbox-ready', handleChatboxReady)
    }
  }, [])

  // Try get wallet Provider from account connector
  useEffect(() => {
    const asyncTryGetWalletProvider = async () => {
      try {
        if (account.connector === undefined) {
          setWalletProvider(null)
        } else if (
          Object.hasOwnProperty.bind(account.connector)('getProvider')
        ) {
          isGettingWalletProvider.current = true
          const walletProvider = await account.connector?.getProvider()
          setWalletProvider(walletProvider)
          isGettingWalletProvider.current = false
        }
      } catch (error) {
        console.error('Failed to get wallet provider', error)
      }
    }
    asyncTryGetWalletProvider()

  }, [account.connector])

  // Call the loadChatbox api or the processWallet api based on the walletProvider
  useEffect(() => {
    if (walletProvider === undefined) {
      return
    }

    const isWalletConnected = walletProvider !== null

    // Call loadChatbox() to start
    if (!isChatboxReady) {
      ChatboxSDK.loadChatbox({
        isWalletConnected,
        provider: walletProvider ?? undefined
      })
    } else {
      // Call processWallet() when the status of wallet has changed
      ChatboxSDK.processWallet({
        isWalletConnected,
        provider: walletProvider ?? undefined
      })
    }
  }, [walletProvider, isChatboxReady])

  useEffect(() => {
    if (
      !isGettingWalletProvider.current &&
      walletProvider &&
      isChatboxReady &&
      account.address !== undefined
    ) {
      // specify the address for the chatbox to load.
      ChatboxSDK.processAccount({
        account: account.address
      })
    }
  }, [isChatboxReady, walletProvider, account.address])

  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [currentToken, setCurrentToken] = useState<string>('degen');
  const [groupId111, setGroupId] = useState<string>('');

  useEffect(() => {
    async function fetchArticles(token: string) {
      try {
        const response = await fetch(`/api/scrape?token=${token}`);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }

    fetchArticles(currentToken);
  }, [currentToken]);

  const handleTokenClick = (token: string, groupId: string) => {
    setCurrentToken(token);
    setGroupId(groupId);
  }

  useEffect(() => {
    // 动态设置 Group
    ChatboxSDK.request({
      method: 'setGroups',
      params: {
        includes: [{ groupId: groupId111 }]
      }
    });
  }, [groupId111]);

  return (
    // head
    <div className="flex h-screen w-full flex-col">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NewspaperIcon className="h-6 w-6" />
          <h1 className="text-xl font-bold">Token News</h1>
        </div>
        <div className="flex items-center gap-2">
        <Button className="flex items-center gap-2">
          <ConnectButton />
            </Button>
        </div>
      </header>

      <div className="flex-1 flex justify-center">
        <div className="bg-muted/20 border-r p-4 w-64 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Token List</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted" prefetch={false} onClick={() => handleTokenClick('degen', 'groupfiDEGENcrabe2b86567396c9fd104f9d81545494131217f2ff264309d10c8d9a0198abd2bfb')}>
              <span>Degen</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted" prefetch={false} onClick={() => handleTokenClick('pepe', 'groupfiPEPEcrab8de932874b256a82c48b0c58edba2a5ebc65dd6465ffbe9d05be4f9149ea51a1')}>
              <span>Pepe</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted" prefetch={false} onClick={() => handleTokenClick('meme', 'groupfiMEMEcrabe970675cca3c4cf389b850095a36898cf50738d562fe51cd196b56c5340585e8')}>
              <span>Meme</span>
            </Link>
          </nav>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-muted/20 border-b p-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Latest News</h2>
            <div className="flex items-center gap-2">
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 grid gap-4">
              <CardContent>
                <div className="flex-1 overflow-auto p-4 grid gap-4">
            {articles.map((article, index) => (
              <Card key={index} className="bg-background border rounded-lg overflow-hidden">
                <CardHeader className="flex items-center gap-4 p-4 border-b">
                  <div>
                    <h3 className="font-semibold">{article.title}</h3>
                    {/* <p className="text-sm text-muted-foreground">{new Date(item.publishedAt).toLocaleDateString()}</p> */}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p>{article.blurb}</p>
                </CardContent>
              </Card>
            ))}
          </div>
              </CardContent>
          </div>
        </div>
        <div className="bg-muted/20 border-l p-4 w-64 flex flex-col gap-4">
          <div className="flex items-center justify-between">
          </div>
        </div>
      </div>
    </div>
  )
}

function NewspaperIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  )
}

