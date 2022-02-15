#!/usr/bin/env node
import Jimp from 'jimp'
import { PdfConvert } from './types'


export class SeparateCover{
    readonly filePath: string
    readonly coverFilePath: string
    readonly backCoverFilePath: string
    readonly flapFilePath: string
    readonly backFilePath: string
    readonly booksizeRate: PdfConvert.separateCover.bookSizeRate
    public async separateCoverImage() {
        // 対象のファイルをbase64形式で読み込み
        const filePath = this.filePath
        const frontCoverImage = await Jimp.read(filePath)
        const imageWidth = frontCoverImage.bitmap.width - 21
        const imageHeight = frontCoverImage.bitmap.height
        console.log(imageHeight)
        const coverWidth = imageWidth * this.booksizeRate.coverRate
        const backWidth = imageWidth  * this.booksizeRate.backRate
        console.log(coverWidth)
        console.log(backWidth)
        const back_x_1 = 2449
        await frontCoverImage.crop(back_x_1 - coverWidth, 0, coverWidth, imageHeight).quality(90).writeAsync(this.coverFilePath)
        const backCoverImage = await Jimp.read(filePath)
        console.log("imageWidth * (flapRate + coverRate + backRate) " +  imageWidth * (this.booksizeRate.flapRate + this.booksizeRate.coverRate + this.booksizeRate.backRate))
        await backCoverImage.crop(back_x_1 + backWidth, 0, coverWidth, imageHeight).quality(90).writeAsync(this.backCoverFilePath)
        await this.createFlapImage()
        await this.createBackImage()
    }
    private async createFlapImage(){
        const flapImage1 = await Jimp.read(this.filePath)
        const flapImage2 = await Jimp.read(this.filePath)
        const imageWidth = flapImage1.bitmap.width - 21
        const imageHeight = flapImage1.bitmap.height
        const flapWidth = imageWidth * this.booksizeRate.flapRate
        await flapImage1.crop(0, 0, flapWidth, imageHeight)
        await flapImage2.crop( imageWidth * (this.booksizeRate.flapRate + this.booksizeRate.coverRate + this.booksizeRate.backRate + this.booksizeRate.coverRate), 0, flapWidth, imageHeight)
        const flapImage = new Jimp(flapImage1.getWidth() + 50 + flapImage1.getWidth(),flapImage1.getHeight(),'#FFFFFF')
        flapImage.blit(flapImage1,0,0).blit(flapImage2,flapWidth + 50,0).quality(90).writeAsync(this.flapFilePath)
    }
    private async createBackImage(){
        const backImage = await Jimp.read(this.filePath)
        const imageWidth = backImage.bitmap.width - 21
        const imageHeight = backImage.bitmap.height 
        const backWidth = imageWidth * this.booksizeRate.backRate
        await backImage.crop( imageWidth * (this.booksizeRate.flapRate + this.booksizeRate.coverRate), 0, backWidth, imageHeight).quality(90).writeAsync(this.backFilePath)
    }
    constructor(filePath: string,bookSizeRate?: PdfConvert.separateCover.bookSizeRate){
        this.filePath = filePath
        this.coverFilePath = filePath.replace(".jpg", "") + "_cover_1.jpg"
        this.backCoverFilePath = filePath.replace(".jpg", "") + "_cover_2.jpg"
        this.flapFilePath = filePath.replace(".jpg", "") + "_flap.jpg"
        this.backFilePath = filePath.replace(".jpg", "") + "_back.jpg"
        if(bookSizeRate === undefined){
            const ganganOnlineComicRate:  PdfConvert.separateCover.bookSizeRate  = 
            {
                backRate: 0.028,
                coverRate: 0.307,
                flapRate: 0.178
            }
            this.booksizeRate = ganganOnlineComicRate
        }else{
            this.booksizeRate = bookSizeRate
        }
    }
}