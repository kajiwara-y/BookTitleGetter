#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import { BookInformation } from './getBookInfo';
import { SeparateCover } from './separateCover';

const parser = yargs(hideBin(process.argv)).options({
targetFile: { type: 'string',demandOption: true},
  });
const execute = async () => {
    const separateCover = new SeparateCover()
    const argv = await parser.argv;
    console.log(argv)
    const fileName = argv.targetFile
    if(fileName)
    {
        await separateCover.separateCoverImage(fileName)
        const bookInformation = new BookInformation()
        const isbn = await bookInformation.getISBN(fileName.replace(".jpg", "") + "_cover_2.jpg")
        if(isbn){
            const bookInfo = await bookInformation.getBookInfo(isbn)
            if (bookInfo.data.Items[0]) {
                console.log(bookInfo.data.Items[0])
            }
        }
    }
};
execute()