import fs from 'fs';
import opmlParser from 'opml-parser';

export async function parseOpml(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      opmlParser(data, (err, outline) => {
        if (err) {
          return reject(err);
        }

        const rssFeeds: string[] = [];
        outline.outline.forEach((item: any) => {
          if (item.xmlUrl) {
            rssFeeds.push(item.xmlUrl);
          }
        });

        resolve(rssFeeds);
      });
    });
  });
}