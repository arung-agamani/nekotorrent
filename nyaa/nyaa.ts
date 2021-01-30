import rssParser, { ParserOptions } from 'rss-parser';

import { ANIME_EN_TRANSLATED, UNCATEGORIZED } from './constants';
import { nyaaItem } from './interfaces';
import { categoryLookup, qualityLookup } from './utils';
import { nyaaRssCustomItem } from './types'

let cachedNyaa: Map<string, nyaaItem[]> = null;
let cachedDate: Date = null;

const nyaaRssOptions: ParserOptions<{}, nyaaRssCustomItem> = {
    customFields: {
        item: [
            'nyaa:seeders',
            'nyaa:leechers',
            'nyaa:downloads',
            'nyaa:category',
            'nyaa:categoryId',
            'nyaa:comments',
            'nyaa:size',
            'nyaa:trusted',
            'nyaa:remake',
            'nyaa:infoHash'
        ]
    }
}

export async function fetchNyaaRss() {
    if (cachedDate && Date.now() < (cachedDate.getTime() + 5 * 60 * 1000)) {
        return cachedNyaa;
    }
    const parser = new rssParser<{}, nyaaRssCustomItem>(nyaaRssOptions);
    const feed = await parser.parseURL('https://nyaa.si/?page=rss')
    const bags = new Map<string, nyaaItem[]>();
    feed.items.forEach(item => {
        const category = categoryLookup(item["nyaa:category"])
        if (category !== UNCATEGORIZED) {
            const i: nyaaItem = {
                title: item.title,
                link: item.link,
                guid: item.guid,
                seeders: parseInt(item['nyaa:seeders']),
                leechers: parseInt(item['nyaa:leechers']),
                downloads: parseInt(item['nyaa:downloads']),
                category: item['nyaa:category'],
                categoryId: item["nyaa:categoryId"],
                infoHash: item["nyaa:infoHash"],
                size: item["nyaa:size"],
                comments: item["nyaa:comments"],
                trusted: item["nyaa:trusted"] === 'Yes',
                remake: item["nyaa:remake"] === 'Yes'
            }
            if (qualityLookup(i.title)) {
                if (bags.has(category)) {
                    const arr: nyaaItem[] = bags.get(category)
                    arr.push(i)
                    bags.set(category, arr);
                } else {
                    const arr: nyaaItem[] = []
                    arr.push(i)
                    bags.set(category, arr);
                }
            }
        }
    })
    cachedNyaa = bags;
    cachedDate = new Date()
    return bags;
}

export default null;