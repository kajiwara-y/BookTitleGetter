import { parse } from 'path/posix';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { CreateComitPdf } from './createComicPdf';

const parser = yargs(hideBin(process.argv)).options({
    insideDir: { type: 'string',demandOption: true},
    coverDir: { type: 'string',demandOption: true},
    outputDir: { type: 'string',demandOption: true},
    targetFile: { type: 'string',demandOption: true},
      });

const execute = async () => {
    const argv = await parser.argv;
    const bookInformation = new CreateComitPdf(argv.insideDir,argv.coverDir,argv.outputDir,2)
    bookInformation.createPdf(argv.targetFile)
};
execute()