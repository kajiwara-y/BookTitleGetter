# BookTitleGetter

自炊したPDFの表紙画像からISBNをスキャン、そのISBN楽天BookAPIに問い合わせを実施し、自炊したPDFの書籍情報を取得します。

## Feature
 
* PDFの最終ページからISBNを取得し、その書籍情報の取得
* 表紙の画像から表表紙・裏表紙・脇を切り出す(予定)

## Dependency

```
node --version
v15.9.0
```

## Setup

```
npm install
npm run build
```

## Usage
```
npm start <targetFile>
```

## License
MIT