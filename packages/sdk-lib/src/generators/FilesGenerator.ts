import path from 'path';
import {DocumentClass, StringSelects_Index, TextConstants_Index, DocumentClass_Index} from '@pancodex/domain-lib';
import {generateJsonFile, readObjectFromFile} from './utilities';
import {DocumentTemplateGenerator} from './DocumentTemplateGenerator';
import {DataContentAdapterGenerator} from './DataContentAdapterGenerator';
import {AdaptersCommonsGenerator} from './AdaptersCommonsGenerator';


export class FilesGenerator {
    private _dataDirPath: string;
    private _themeAdaptersDirPath: string;
    private _documentClasses: DocumentClass_Index;
    private _stringSelects: StringSelects_Index;
    private _textConstants: TextConstants_Index;

    constructor() {
        this._dataDirPath = path.join(process.cwd(), 'data');
        this._themeAdaptersDirPath = path.join(process.cwd(), 'src', 'adapters');
        this._documentClasses = {};
        this._stringSelects = {};
        this._textConstants = {};
    }

    private async _generateKeyValuesIndex(keyValuesIndex: any, outputFilePath: string): Promise<void> {
        let prevObject: any;
        try {
            prevObject = await readObjectFromFile(outputFilePath);
        } catch (e) {
        }
        if (prevObject) {
            prevObject = {...keyValuesIndex, ...prevObject};
        } else {
            prevObject = keyValuesIndex;
        }
        return generateJsonFile(prevObject, outputFilePath);
    }

    withDataDir(dirPath: string): FilesGenerator {
        this._dataDirPath = path.join(process.cwd(), dirPath);
        return this;
    }

    withThemeAdaptersDir(dirPath: string): FilesGenerator {
        this._themeAdaptersDirPath = path.join(process.cwd(), dirPath);
        return this;
    }

    withDocumentClasses(index: DocumentClass_Index): FilesGenerator {
        this._documentClasses = {...this._documentClasses, ...index};
        return this;
    }

    withStringSelects(index: StringSelects_Index): FilesGenerator {
        this._stringSelects = {...this._stringSelects, ...index};
        return this;
    }

    withTextConstants(index: TextConstants_Index): FilesGenerator {
        this._textConstants = {...this._textConstants, ...index};
        return this;
    }

    async generate(): Promise<void> {
        const documentClassTuples: Array<[string, DocumentClass<string, string>]> = Object.entries(this._documentClasses);
        let classNames: Array<string> = [];
        for (const documentClassTuple of documentClassTuples) {
            await new DocumentTemplateGenerator(
                documentClassTuple[0],
                documentClassTuple[1],
                path.join(this._dataDirPath, 'default-templates', `${documentClassTuple[0]}.json`)
            ).generate();
            await new DataContentAdapterGenerator(
                documentClassTuple[0],
                documentClassTuple[1],
                this._themeAdaptersDirPath
            ).generate()
            classNames.push(documentClassTuple[0]);
        }
        await new AdaptersCommonsGenerator(classNames, this._themeAdaptersDirPath).generate();
        await this._generateKeyValuesIndex(this._stringSelects, path.join(this._dataDirPath, 'stringSelectsIndex.json'));
        await this._generateKeyValuesIndex(this._textConstants, path.join(this._dataDirPath, 'textConstantsIndex.json'));
        await generateJsonFile(this._documentClasses, path.join(this._dataDirPath, 'documentClassIndex.json'));
    };

}