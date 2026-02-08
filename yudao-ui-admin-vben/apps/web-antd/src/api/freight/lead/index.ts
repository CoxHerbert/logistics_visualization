import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FreightLeadApi {
  export interface Lead {
    id: number;
    contactName: string;
    contactPhone: string;
    departureCity?: string;
    destinationCity?: string;
    shipMode: number;
    cargoType: number;
    status: number;
    source: number;
    remark?: string;
    createTime?: string;
  }

  export interface LeadPageReqVO extends PageParam {
    status?: number;
    contactPhone?: string;
    createTime?: string[];
  }
}

/** 分页查询线索 */
export function getFreightLeadPage(params: FreightLeadApi.LeadPageReqVO) {
  return requestClient.get<PageResult<FreightLeadApi.Lead>>('/freight/lead/page', {
    params,
  });
}

/** 查询线索详情 */
export function getFreightLead(id: number) {
  return requestClient.get<FreightLeadApi.Lead>(`/freight/lead/get?id=${id}`);
}

/** 更新线索 */
export function updateFreightLead(data: {
  id: number;
  status: number;
  remark?: string;
}) {
  return requestClient.put('/freight/lead/update', data);
}
