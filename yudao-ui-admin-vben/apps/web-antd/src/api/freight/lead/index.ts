import type { PageParam, PageResult } from '@vben/request';

import { portalRequestClient } from '#/api/request';

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
  return portalRequestClient.get<PageResult<FreightLeadApi.Lead>>('/leads/page', {
    params,
  });
}

/** 查询线索详情 */
export function getFreightLead(id: number) {
  return portalRequestClient.get<FreightLeadApi.Lead>(`/leads/get?id=${id}`);
}

/** 更新线索 */
export function updateFreightLead(data: {
  id: number;
  status: number;
  remark?: string;
}) {
  return portalRequestClient.put('/leads/update', data);
}


export namespace FreightLeadActivityApi {
  export interface Activity {
    id: number;
    leadId: number;
    content: string;
    nextContactTime?: string;
    creatorType: number;
    creator?: string;
    createTime?: string;
  }

  export interface ActivityCreateReqVO {
    leadId: number;
    content: string;
    nextContactTime?: string;
  }
}

/** 查询线索跟进记录 */
export function getFreightLeadActivityList(leadId: number) {
  return portalRequestClient.get<FreightLeadActivityApi.Activity[]>(
    `/leads/activity/list?leadId=${leadId}`,
  );
}

/** 新增线索跟进记录 */
export function createFreightLeadActivity(
  data: FreightLeadActivityApi.ActivityCreateReqVO,
) {
  return portalRequestClient.post<number>('/leads/activity/create', data);
}
