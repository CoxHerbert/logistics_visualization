import { portalRequestClient } from '#/api/request';

export namespace FreightQuoteApi {
  export interface FeeItem {
    name: string;
    amount: number;
  }

  export interface Quote {
    id: number;
    currency: string;
    unitPrice: number;
    quantity: number;
    surcharge: number;
    total: number;
    remark?: string;
    createTime?: string;
  }

  export interface QuoteCreateReqVO {
    currency: string;
    unitPrice: number;
    quantity: number;
    surcharge?: number;
    remark?: string;
  }
}

export function createFreightQuote(data: FreightQuoteApi.QuoteCreateReqVO) {
  return portalRequestClient.post<number>('/freight/quote/create', data);
}

export function getFreightQuote(id: number) {
  return portalRequestClient.get<FreightQuoteApi.Quote>(`/freight/quote/get?id=${id}`);
}
