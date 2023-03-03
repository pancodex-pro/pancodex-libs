import type {Image} from './Image';
import type {HeaderText} from './HeaderText';
import type {ParagraphText} from './ParagraphText';
import type {Link} from './Link';
import type {StringValue} from './StringValue';
import type {ChildrenListing} from './ChildrenListing';

export type AnyFieldType = 'Image'
    | 'HeaderText'
    | 'ParagraphText'
    | 'Link'
    | 'StringValue'
    | 'ChildrenListing';

export type AnyField = Image
    | HeaderText
    | ParagraphText
    | Link
    | StringValue
    | ChildrenListing;

export {
    Image,
    HeaderText,
    ParagraphText,
    Link,
    StringValue,
    ChildrenListing
}
