import {nanoid} from 'nanoid';
import {Document_Bean, LocaleType} from '../../types/document';
import {ContentData} from '../../types/contentData';
import {Section} from '../../types/content/common';

export function enhanceDocument(document: Document_Bean): Document_Bean {
    if (document) {
        // fix the incompatibilities from the previous versions
        if ((document as any).profileId) {
            delete (document as any).profileId
        }
        if (document.contents) {
            const localeKeys: Array<LocaleType> = Object.keys(document.contents) as Array<LocaleType>;
            localeKeys.forEach(locale => {
                const contentData: ContentData | undefined = document.contents[locale].contentData;
                if (contentData) {
                    if (!contentData.hero) {
                        contentData.hero = [];
                    } else if (contentData.hero.length > 0) {
                        contentData.hero.forEach((section: Section) => {
                            if (!section.id) {
                                section.id = nanoid();
                            }
                        });
                    }
                    if (!contentData.body) {
                        contentData.body = [];
                    } else if (contentData.body.length > 0) {
                        contentData.body.forEach((section: Section) => {
                            if (!section.id) {
                                section.id = nanoid();
                            }
                        });
                    }
                    if (!document.contents[locale].statusMap) {
                        document.contents[locale].statusMap = {};
                    }
                    if (!document.contents[locale].profileId) {
                        document.contents[locale].profileId = 'someId';
                    }
                    if (!document.contents[locale].tags) {
                        document.contents[locale].tags = {};
                    }
                    document.contents[locale].contentData = contentData;
                }
            });
        }
    }
    return document;
}
