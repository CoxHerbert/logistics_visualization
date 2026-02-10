import { requestClient } from '#/api/request';

export namespace FreightQuoteApi {
  export interface FeeItem {
    name: string;
    amount: number;
  }

  export interface Quote {
    id: number;
    leadId: number;
    currency: string;
    unitPrice: number;
    quantity: number;
    surcharge: number;
    total: number;
    remark?: string;
    createTime?: string;
  }

  export interface QuoteCreateReqVO {
    leadId: number;
    currency: string;
    unitPrice: number;
    quantity: number;
    surcharge?: number;
    remark?: string;
  }
}

export function createFreightQuote(data: FreightQuoteApi.QuoteCreateReqVO) {
  return requestClient.post<number>('/freight/quote/create', data);
}

export function getFreightQuote(id: number) {
  return requestClient.get<FreightQuoteApi.Quote>(
    `/freight/quote/get?id=${id}`,
  );
}

export function getFreightQuoteListByLead(leadId: number) {
  return requestClient.get<FreightQuoteApi.Quote[]>(
    `/freight/quote/list-by-lead?leadId=${leadId}`,
  );
}
