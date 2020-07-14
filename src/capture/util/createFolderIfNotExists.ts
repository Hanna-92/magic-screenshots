import {statSync, mkdirSync} from 'fs'

export default function createFolderIfNotExists(folder: string, callBack: () => void = () => {}) {
    try {
        statSync(folder)
    } catch {
        mkdirSync(folder)
    }
}