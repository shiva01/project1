
import type { NextApiRequest, NextApiResponse } from 'next';

interface FeedItem {
    uuid: string;
    abstract: string;
    author_name: string;
    author_title: string;
    avatar_url: string;
    banner: string;
    is_star: number;
    link_source: {
        name: string;
        link: string;
    };
    show_time: string;
    source_url: string;
    tags: string[];
    title: string;
    type: number;
}

interface ApiResponse {
    data: {
        total_count: number;
        total_page: number;
        list: FeedItem[];
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    
) {
    const { page = '1', page_size = '20'  } = req.query;

    const url = `https://api.chainfeeds.xyz/feed/searchv2?page=${page}&page_size=${page_size}&query=${key_word}&sort_type=score&article_type=1`;

    try {
        const response = await fetch(url);
        const data: ApiResponse = await response.json();

        // 获取list[0]中的数据
        if (data.data.list.length > 0) {
            const firstItem = data.data.list[0];
            res.status(200).json(firstItem);
        } else {
            res.status(404).json({ error: 'No data found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}