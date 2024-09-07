"use client"
// import { Component } from '../components/component';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { WagmiProvider } from 'wagmi'
// import { config } from './config'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
const config1 = getDefaultConfig({
  appName: 'TokenNews',
  projectId: '050fb102ca80a9399c33be00cee53dcd',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient()
import dynamic from 'next/dynamic'


const ComponentUsingLocalStorage = dynamic(
  () => import('../components/Component').then(mod => mod.Component),
  { ssr: false }
)

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-[500px] bg-gray-200 animate-pulse">
      <React.StrictMode>
        <WagmiProvider config={config1}>
          <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
        <ComponentUsingLocalStorage />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </React.StrictMode>,
    </div>
    </main>
  );
}