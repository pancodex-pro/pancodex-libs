import {SiteMap_Bean} from '@pancodex/domain-lib';
import {fetchDataFromFile} from './fetchDataFromFile';
import {SiteMapDataFetchStatus} from './types';

export async function fetchSiteMapData(locale?: string, documentSlug?: string): Promise<SiteMapDataFetchStatus> {
    let result: SiteMapDataFetchStatus = {};
    let siteMap: SiteMap_Bean;
    try {
        siteMap = await fetchDataFromFile<SiteMap_Bean>('data/siteMap.json');
        if (!siteMap) {
            throw Error('Site map is not found.');
        }
        return {
            contextProxy: {
                siteMap
            }
        }
    } catch (e: any) {
        result = {
            error: e.message,
            isError: true,
        }
    }
    return result;
}
