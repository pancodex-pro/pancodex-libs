import type {Image} from './Image';
import type {HeaderText} from './HeaderText';
import type {ParagraphText} from './ParagraphText';
import type {Link} from './Link';
import type {StringValue} from './StringValue';
import type {DocumentsList} from './DocumentsList';

export type AnyFieldType = 'Image'
    | 'HeaderText'
    | 'ParagraphText'
    | 'Link'
    | 'StringValue'
    | 'DocumentsList';

export type AnyField = Image
    | HeaderText
    | ParagraphText
    | Link
    | StringValue
    | DocumentsList;

export {
    Image,
    HeaderText,
    ParagraphText,
    Link,
    StringValue,
    DocumentsList
}
