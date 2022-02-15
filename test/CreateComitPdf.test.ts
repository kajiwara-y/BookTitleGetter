import { CreateComitPdf } from '../createComicPdf';

test('regexp', () => {
    const createComicPdf = new CreateComitPdf(".",",",",")
    expect(createComicPdf["convertBookTitleVolume"]("[ヨシノサツキ] はんだくん（1）.pdf")).toBe('[ヨシノサツキ] はんだくん第01巻.pdf');
});