import {useContext} from 'react';
import {PageDataContext} from '../core';
import {PageData} from '../types';

export const usePageData = (): PageData | null => {
    return useContext(PageDataContext);
};
