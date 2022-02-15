import * as path from 'path';;
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { CreateComitPdf } from './createComicPdf';
import * as fs from 'fs' // 読み込む

const parser = yargs(hideBin(process.argv)).options({
    insideDir: { type: 'string',demandOption: true},
    coverDir: { type: 'string',demandOption: true},
    outputDir: { type: 'string',demandOption: true},
      });

const execute = async () => {
    const argv = await parser.argv;
    const bookInformation = new CreateComitPdf(argv.insideDir,argv.coverDir,argv.outputDir,2)
    const dirents = fs.readdirSync(argv.insideDir, {withFileTypes: true})
    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            continue
        }
        if(fs.existsSync(path.join(argv.coverDir,dirent.name.replace(".pdf",".jpg")))){
            await bookInformation.createPdf(dirent.name)
        }else{
            console.log("cover image not found " + dirent.name.replace(".pdf",".jpg"))
        } 
    }
};
execute()