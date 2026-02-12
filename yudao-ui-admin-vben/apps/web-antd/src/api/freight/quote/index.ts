import { portalRequestClient } from '#/api/request';

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
  return portalRequestClient.post<number>('/leads/quote/create', data);
}

export function getFreightQuote(id: number) {
  return portalRequestClient.get<FreightQuoteApi.Quote>(
    `/leads/quote/get?id=${id}`,
  );
}

export function getFreightQuoteListByLead(leadId: number) {
  return portalRequestClient.get<FreightQuoteApi.Quote[]>(
    `/leads/quote/list-by-lead?leadId=${leadId}`,
  );
}
