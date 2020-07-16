import {readFileSync, writeFileSync} from 'fs'

const deleteImage = (name: string) => {
    const saveDir = './src/manage/public/captures'
    const existingObj = readFileSync(`${saveDir}/index.json`, 'utf8')
    const index = JSON.parse(existingObj)

    console.log(index)

    console.log('delete ' + name)
    delete index.captures[name]
    console.log(index)
    writeFileSync(`${saveDir}/index.json`, JSON.stringify(index))
}

export default deleteImage