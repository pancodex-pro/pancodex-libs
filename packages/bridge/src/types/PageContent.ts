import {HeroContentSection} from './HeroContentSection';
import {BodyContentSection} from './BodyContentSection';

export type PageContent = {
    hero: Array<HeroContentSection>;
    body: Array<BodyContentSection>;
};
