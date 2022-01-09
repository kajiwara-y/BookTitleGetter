import axios from 'axios';
import { rakuten } from './types';

// 参考: https://ribbitwork.gatsbyjs.io/blog/typescript-rakuten-books-api/

export class RakutenBooksClient {
  public static DOMAIN = 'https://app.rakuten.co.jp/';
  public static END_POINT = 'services/api/BooksBook/Search/20170404';

  private readonly _applicationId: string;

  public constructor(applicationId: string) {
    this._applicationId = applicationId;
  }

  public async get(request: rakuten.api.books.Request) {
    const url = this.getUrl(request);
    const response = await axios.get<rakuten.api.books.Response>(url);
    return response;
  }

  private getUrl(request: rakuten.api.books.Request) {
    let url = RakutenBooksClient.DOMAIN + RakutenBooksClient.END_POINT;
    url += `?applicationId=${this._applicationId}`;
    url += `&formatVersion=2`;

    if (request.callback) {
      url += `&callback=${request.callback}`;
    }
    if (request.elements) {
      url += `&elements=${request.elements.join(',')}`;
    }

    if (request.title) {
      url += `&title=${encodeURIComponent(request.title)}`;
    }
    if (request.author) {
      url += `&author=${encodeURIComponent(request.author)}`;
    }
    if (request.publisherName) {
      url += `&publisherName=${encodeURIComponent(request.publisherName)}`;
    }
    if (request.size) {
      url += `&size=${request.size}`;
    }
    if (request.isbn) {
      url += `&isbn=${request.isbn}`;
    }
    if (request.booksGenreId) {
      url += `&booksGenreId=${request.booksGenreId}`;
    }
    if (request.hits) {
      url += `&hits=${request.hits}`;
    }
    if (request.page) {
      url += `&page=${request.page}`;
    }
    if (request.availability) {
      url += `&availability=${request.availability}`;
    }
    if (request.outOfStockFlag) {
      url += `&outOfStockFlag=${request.outOfStockFlag}`;
    }
    if (request.chirayomiFlag) {
      url += `&chirayomiFlag=${request.chirayomiFlag}`;
    }
    if (request.sort) {
      url += `&sort=${request.sort}`;
    }
    if (request.limitedFlag) {
      url += `&limitedFlag=${request.limitedFlag}`;
    }
    if (request.carrier) {
      url += `&carrier=${request.carrier}`;
    }
    if (request.genreInformationFlag) {
      url += `&genreInformationFlag=${request.genreInformationFlag}`;
    }

    return url;
  }
}