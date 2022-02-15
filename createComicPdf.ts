import yargs from 'yargs'
import * as fs from 'fs' // 読み込む
import * as path from 'path'
import { BookInformation } from './getBookInfo';
import { SeparateCover } from './separateCover';
import { PDFDocument } from 'pdf-lib'

export class CreateComitPdf {
    private readonly _insidePdfDir: string
    private readonly _cooverDir: string
    private readonly _outputDir: string
    private readonly _removeInsidePdfCoverPageNumber: number
    public existsCover(insidePdf: string, coverDir:string){
        const onlyInsideFileName = path.basename(insidePdf)
        return fs.existsSync(coverDir + onlyInsideFileName)
    }
    private convertBookTitleVolume(bookTitle :string){
        const re = new RegExp('（([0-9]+)）');
        const result = re.exec(bookTitle)
        if(result){
            return bookTitle.replace(re,`第${('00' + result[1]).slice(-2)}巻`)
        }else{
            return bookTitle
        }
    }
    public async createPdf(targetFileName: string){
        const coverFileName = this._cooverDir + "\\" + targetFileName.replace(".pdf",".jpg")
        const separateCover = new SeparateCover(coverFileName)
        await separateCover.separateCoverImage()
        const bookInformation = new BookInformation()
        const isbn = await bookInformation.getISBN(separateCover.backCoverFilePath)
        let bookFileName = ""
        if(isbn){
            const bookInfo = await bookInformation.getBookInfo(isbn)
            if (bookInfo.data.Items[0]) {
                const resultBookInfo = bookInfo.data.Items[0]
                if(!resultBookInfo.subTitle)
                    bookFileName = `[${resultBookInfo.author}] ${this.convertBookTitleVolume(resultBookInfo.title)}.pdf`
                else
                    bookFileName = `[${resultBookInfo.author}] ${resultBookInfo.title} ${resultBookInfo.subTitle}.pdf`
            }
        }else{
            bookFileName = targetFileName.replace('.pdf','_renew.pdf')
        }
        const insidePdf = await PDFDocument.load(fs.readFileSync(this._insidePdfDir + "\\" + targetFileName))
        for (let index = 0; index < this._removeInsidePdfCoverPageNumber; index++) {
            insidePdf.removePage(0)
        }
        const frontCoverPage = insidePdf.insertPage(0)
        const frontJpgSourceImage = await insidePdf.embedJpg(fs.readFileSync(separateCover.coverFilePath))
        const frontJpgImage = frontJpgSourceImage.scale(0.3)
        frontCoverPage.setHeight(frontJpgImage.height)
        frontCoverPage.setWidth(frontJpgImage.width)
        frontCoverPage.drawImage(frontJpgSourceImage,{
            x: 0,
            y: 0,
            width: frontJpgImage.width,
            height: frontJpgImage.height,
          })
        // const backCoverPage = insidePdf.insertPage(insidePdf.getPageCount())
        const backCoverPage = insidePdf.addPage()
        const backCoverJpgSourceImage = await insidePdf.embedJpg(fs.readFileSync(separateCover.backCoverFilePath))
        const backCoverJpgImage = backCoverJpgSourceImage.scale(0.3)
        backCoverPage.setHeight(backCoverJpgImage.height)
        backCoverPage.setWidth(backCoverJpgImage.width)
        backCoverPage.drawImage(backCoverJpgSourceImage,{
            x:0,
            y:0,
            width:backCoverJpgImage.width,
            height:backCoverJpgImage.height
        })
        const flapPage = insidePdf.addPage()
        const flapJpgSourceImage = await insidePdf.embedJpg(fs.readFileSync(separateCover.flapFilePath))
        const flapJpgImage = flapJpgSourceImage.scale(0.3)
        flapPage.setHeight(flapJpgImage.height)
        flapPage.setWidth(flapJpgImage.width)
        flapPage.drawImage(flapJpgSourceImage,{
            x:0,
            y:0,
            width:flapJpgImage.width,
            height:flapJpgImage.height
        })
        const backPage = insidePdf.addPage()
        const backJpgSourceImage = await insidePdf.embedJpg(fs.readFileSync(separateCover.backFilePath))
        const backJpgImage = backJpgSourceImage.scale(0.3)
        backPage.setHeight(backJpgImage.height)
        backPage.setWidth(backJpgImage.width)
        backPage.drawImage(backJpgSourceImage,{
            x:0,
            y:0,
            width:backJpgImage.width,
            height:backJpgImage.height
        })
        // const allCoverPage = insidePdf.insertPage(insidePdf.getPageCount())
        const allCoverPage = insidePdf.addPage()
        const allCoverJpgImage = await insidePdf.embedJpg(fs.readFileSync(separateCover.filePath))
        allCoverPage.setHeight(allCoverJpgImage.height)
        allCoverPage.setWidth(allCoverJpgImage.width)
        allCoverPage.drawImage(allCoverJpgImage,{
            x:0,
            y:0,
            width:allCoverJpgImage.width,
            height:allCoverJpgImage.height
        })
        fs.writeFileSync(this._outputDir + "\\" + bookFileName,await insidePdf.save())
    }
    constructor(insidePdfDir: string, coverDir: string, outputDir:string, _removeInsidePdfCoverPageNumber? :number){
        this._insidePdfDir = insidePdfDir
        this._cooverDir = coverDir
        this._outputDir = outputDir
        this._removeInsidePdfCoverPageNumber = (_removeInsidePdfCoverPageNumber==undefined)? 0: _removeInsidePdfCoverPageNumber
    }
    
    


}
