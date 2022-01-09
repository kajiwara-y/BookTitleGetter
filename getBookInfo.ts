import Quagga from '@ericblade/quagga2';
import { RakutenBooksClient } from "./rakuten-books-client";
import * as fs from 'fs' // 読み込む
import { PathOrFileDescriptor } from 'fs';
import { Pdf2Image } from './pdf2image';
import config = require('config')
import * as yargs from 'yargs'
import { string } from 'yargs';
const applicationId: string = config.get("applicationId")

const argv = yargs.command('<targetFile>', 'Get Book Information', b =>
    b.positional('targetFile', {
        demandOption: true, type: 'string'
    })
)
    .demandCommand(1)
    .parseSync()
export class BookInformation {
    public async getISBNPage(filePath: PathOrFileDescriptor) {
        // 対象のファイルをbase64形式で読み込み
        const data = new Uint8Array(fs.readFileSync(filePath));
        const pdf2image = await Pdf2Image.open(data)
        const lastPage = pdf2image.numPages()
        const image = await pdf2image.getImageDataUrl(lastPage, { scale: 3 })
        return image
    }

    public async getISBN(filePath: string) {
        const result = await Quagga.decodeSingle({
            src: filePath, numOfWorkers: 0, decoder: {
                readers: ["ean_reader"] // List of active readers
            }, inputStream: {
                size: 800  // restrict input-size to be 800px in width (long-side)
            }
        })
        if (result.codeResult) {
            return result.codeResult.code
        } else {
            return ""
        }
    }
    public async getBookInfo(isbn: string) {
        const rakutenBookClient = new RakutenBooksClient(applicationId)
        const response = await rakutenBookClient.get({
            isbn: isbn,
            elements: ["title", "author", "subTitle"],
        });
        return response;
    }
}
const execute = async () => {
    const bookInformation = new BookInformation()

    const fileName = argv._[0]
    const isbnPage = await bookInformation.getISBNPage(fileName)
    // const outputTarget = isbnPage.replace(/^data:image\/\w+;base64,/, '');
    // fs.writeFileSync("output.png",outputTarget,{encoding: 'base64'})
    const isbn = await bookInformation.getISBN(isbnPage)
    if (isbn) {
        const bookinfo = await bookInformation.getBookInfo(isbn)
        if (bookinfo.data.Items[0]) {
            console.log(bookinfo.data.Items[0])
        }
    }
};
execute()