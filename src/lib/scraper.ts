import 'isomorphic-fetch';

export interface FeedItem {
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

export async function scrapeData(page: string = '1', pageSize: string = '20'): Promise<FeedItem[]> {
    const url = `https://api.chainfeeds.xyz/feed/searchv2?page=${page}&page_size=${pageSize}&query=degen&sort_type=score&article_type=1`;

    try {
        const response = await fetch(url);
        const data: ApiResponse = await response.json();

        if (data.data.list.length > 0) {
            return data.data.list;
        } else {
            console.log('No data found');
            return [];
        }
    } catch (error) {
        console.error('Error scraping data:', error);
        return [];
    }
}