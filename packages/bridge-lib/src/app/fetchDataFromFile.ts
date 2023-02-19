import path from 'path';
import fs from 'fs-extra';

export async function fetchDataFromFile<T>(filePath: string): Promise<T> {
    const cacheFilePath = path.join(process.cwd(), filePath);
    await fs.ensureFile(cacheFilePath);
    return await fs.readJson(cacheFilePath) as Promise<T>;
}
