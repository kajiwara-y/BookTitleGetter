import 'pdfjs-dist/legacy/build/pdf.js';
import { PDFDocumentProxy, getDocument } from "pdfjs-dist"
import { createCanvas } from 'canvas'
import { PdfConvert } from "./types"
import { TypedArray } from 'pdfjs-dist/types/src/display/api';

export class Pdf2Image {
    static async open(data: TypedArray) {
        // Some PDFs need external cmaps.
        const CMAP_URL = './node_modules/pdfjs-dist/cmaps/';
        const CMAP_PACKED = true;
        const pdfDoc = await getDocument({
            data: data, cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
            useSystemFonts: false,
            disableFontFace: false
        }).promise;
        return new Pdf2Image(pdfDoc);
    }
    private readonly _pdfDoc: PDFDocumentProxy;
    constructor(pdfDoc: PDFDocumentProxy) {
        this._pdfDoc = pdfDoc;
    }
    public numPages() {
        return this._pdfDoc.numPages;
    }

    public async getImageDataUrl(pageNo: number, option: PdfConvert.getImageDataUrl.getImageDataUrlOption) {
        const page = await this._pdfDoc.getPage(pageNo);
        const scale = option.scale;
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(viewport.width, viewport.height / 5) //ページの上部20%までにISBNはあるものと仮定
        const canvasContext = canvas.getContext('2d');
        canvas.height = viewport.height / 5; //ページの上部20%までにISBNはあるものと仮定
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext,
            viewport,
        };
        await page.render(renderContext).promise;
        return canvas.toDataURL();
    }
}