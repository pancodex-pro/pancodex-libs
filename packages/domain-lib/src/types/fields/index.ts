import type {Image} from './Image';
import type {HeaderText} from './HeaderText';
import type {ParagraphText} from './ParagraphText';
import type {Link} from './Link';
import type {DocumentsListing} from './DocumentsListing';
import type {StringValue} from './StringValue';

export type AnyFieldType = 'Image'
    | 'HeaderText'
    | 'ParagraphText'
    | 'Link'
    | 'DocumentsListing'
    | 'StringValue';

export type AnyField = Image
    | HeaderText
    | ParagraphText
    | Link
    | DocumentsListing
    | StringValue;

export {
    Image,
    HeaderText,
    ParagraphText,
    Link,
    DocumentsListing,
    StringValue
}
