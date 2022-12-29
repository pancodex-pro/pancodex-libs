export function cloneDeep(object: any): any {
    if (object) {
        const jsonText: string = JSON.stringify(object);
        return JSON.parse(jsonText);
    }
    return object;
}

function copy(source: any): any {
    let to: any = source && !!source.pop ? [] : {};
    for (let i in source) to[i] = source[i];
    return to;
}
