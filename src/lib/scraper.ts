import 'isomorphic-fetch';

export interface ArticlePreview {
    title: string;
    blurb: string;
    path: string;
}

export interface ApiResponse {
    data: {
      articlePreviews: {
        data: ArticlePreview[];
        meta: {
          pagination: {
            total: number;
            pageSize: number;
            page: number;
            pageCount: number;
          };
        };
      };
    };
  }

  export async function scrapeData(query: string = 'degen', pageSize: number = 10): Promise<ArticlePreview[]> {
    const url = 'https://gateway.decrypt.co/';
    
    const variables = {
      filters: {
        locale: { eq: "en" },
        or: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } }
        ]
      },
      pagination: { pageSize },
      sort: ["_score:desc"]
    };
  
    const operationName = 'ArticlePreviews';
    const extensions = {
      persistedQuery: {
        version: 1,
        sha256Hash: "7366f3114618c1df3a4b718a7b3e6f93cb804c036a907f52a75b108d9645618f"
      }
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName,
          variables,
          extensions
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API response:', JSON.stringify(data, null, 2));


      const articles = data.data?.articles?.data || [];

      if (articles.length > 0) {
        console.log(`Successfully scraped ${articles.length} articles`);
        const processedArticles = articles.map((article: any) => ({
          title: article.title,
          blurb: article.blurb,
          path: article.meta.hreflangs[0].path
        }));
        return processedArticles;

      } else {
        console.log('No articles found');
        return [];
      }
    } catch (error) {
      console.error('Error scraping data:', error);
      return [];
    }
  }