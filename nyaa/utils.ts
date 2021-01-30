import categories, { UNCATEGORIZED, ARR_QUALITY } from './constants';
export function categoryLookup(category: string) {
    if (categories.find(x => x === category))
        return category;
    return UNCATEGORIZED
}

export function qualityLookup(title: string) {
    const quality = `[${ARR_QUALITY.join('|')}]`
    const regex = new RegExp(quality, 'ig');
    const matchArray = title.match(regex);
    if (matchArray) {
        return matchArray[1]
    }
    return null
}