import * as yargs from 'yargs'
import { BookInformation } from './getBookInfo';

const argv = yargs.command('<targetFile>', 'Get Book Information', b =>
    b.positional('targetFile', {
        demandOption: true, type: 'string'
    })
)
    .demandCommand(1)
    .parseSync()
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