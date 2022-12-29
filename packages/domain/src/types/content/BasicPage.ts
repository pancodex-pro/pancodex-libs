import {Body_Section} from './Body_Section';
import {Hero_Section} from './Hero_Section';

export type BasicPage = {
    hero: Array<Hero_Section>;
    body: Array<Body_Section>;
};
