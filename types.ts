// 参考: https://ribbitwork.gatsbyjs.io/blog/typescript-rakuten-books-api/

/** 複数のうち最低１つが必須となっているパラメータ用 */
type RequireOne<T, K extends keyof T = keyof T> = K extends keyof T ? PartialRequire<T, K> : never;
type PartialRequire<O, K extends keyof O> = {
  [P in K]-?: O[P];
} & O;

export namespace rakuten {
  export namespace api {
    /** ソートに指定できる文字列 */
    export type Sorting =
      | "+reviewCount"
      | "-reviewCount"
      | "+reviewAverage"
      | "-reviewAverage"
      | "+itemPrice"
      | "-itemPrice"
      | "+updateTimestamp"
      | "-updateTimestamp"
      | "standard";

    export namespace books {
      type Auth = {
        applicationId?: string;
        affiliateId?: string;
      };

      type Options = {
        /** デフォルト: json */
        format?: "json" | "xml";
        callback?: string;
        elements?: (keyof Book)[];
        /** デフォルト: 1 */
        formatVersion?: 1 | 2;
        title?: string;

        /** 1から30まで。デフォルトは30 */
        hits?: number;
        page?: number;
        availability?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        outOfStockFlag?: 0 | 1;
        chirayomiFlag?: 0 | 1;
        sort?: Sorting;
        limitedFlag?: 0 | 1;
        carrier?: number;
        genreInformationFlag?: 0 | 1;
      };

      type EitherRequired = RequireOne<{
        title?: string;
        author?: string;
        publisherName?: string;
        size?: number;
        isbn?: string;
        booksGenreId?: string;
      }>;

      export type Request = Auth & Options & EitherRequired;

      export type RequestWithoutAuth = Options & EitherRequired;

      /** フォーマットバージョン2 */
      export type Book = {
        limitedFlag: 0 | 1;
        authorKana: string;
        author: string;
        subTitle: string;
        seriesNameKana: string;
        title: string;
        subTitleKana: string;
        itemCaption: string;
        publisherName: string;
        listPrice: 0;
        isbn: string;
        largeImageUrl: string;
        mediumImageUrl: string;
        titleKana: string;
        availability: "1";
        postageFlag: 2;
        salesDate: string;
        contents: string;
        smallImageUrl: string;
        discountPrice: 0;
        itemPrice: number;
        size: string;
        booksGenreId: string;
        affiliateUrl: string;
        seriesName: string;
        reviewCount: number;
        reviewAverage: string;
        discountRate: 0;
        chirayomiUrl: string;
        itemUrl: string;
      };

      export type Response = { Items: Book[] };
    }
  }
}

export namespace PdfConvert{
  export namespace  getImageDataUrl {
    export type getImageDataUrlOption = {
      scale: number;
    };
  }
}