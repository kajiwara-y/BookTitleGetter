import Quagga from '@ericblade/quagga2';
import { RakutenBooksClient } from "./rakuten-books-client";
import * as fs from 'fs' // 読み込む
import { PathOrFileDescriptor } from 'fs';
import { Pdf2Image } from './pdf2image';
import config = require('config')
import Jimp from 'jimp'
const applicationId: string = config.get("applicationId")

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
        const backCoverImage = await Jimp.read(filePath)
        const imageWidth = backCoverImage.bitmap.width
        const imageHeight = backCoverImage.bitmap.height
        const imageBase64 = await backCoverImage.crop(0, 0, imageWidth, imageHeight / 5).getBase64Async(Jimp.MIME_JPEG)
        const result = await Quagga.decodeSingle({
            src: imageBase64, numOfWorkers: 0, decoder: {
                readers: ["ean_reader"] // List of active readers
            }, inputStream: {
                size: 800  // restrict input-size to be 800px in width (long-side)
            },locate: true
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
            outOfStockFlag: 1,
            elements: ["title", "author", "subTitle"],
        });
        return response;
    }
}