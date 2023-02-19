import {useContext} from 'react';
import {PageDataContext} from './index';
import {PageData} from './types';

export const usePageData = (): PageData => {
    return useContext(PageDataContext);
};
