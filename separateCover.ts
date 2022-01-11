import * as fs from 'fs' // 読み込む
import { PathOrFileDescriptor } from 'fs';
import { Pdf2Image } from './pdf2image';
import config = require('config')
import * as yargs from 'yargs'

const argv = yargs.command('<targetFile>', 'Pdf include SeparateCoverImage', b =>
    b.positional('targetFile', {
        demandOption: true, type: 'string'
    })
)
    .demandCommand(1)
    .parseSync()
export class SeparateCover {
    public async getCoverImage(filePath: PathOrFileDescriptor) {
        // 対象のファイルをbase64形式で読み込み
        const data = new Uint8Array(fs.readFileSync(filePath));
        const pdf2image = await Pdf2Image.open(data)
        const image = await pdf2image.getCoverImageDataUrl(1,{scale:1,rotation:270})
        return image
    }

}
const execute = async () => {
    const separateCover = new SeparateCover()

    const fileName = argv._[0]
    const isbnPage = await separateCover.getCoverImage(fileName)
    const outputTarget = isbnPage.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync("output.png",outputTarget,{encoding: 'base64'})
};
execute()