import { requestClient } from '#/api/request';

export namespace CrmPermissionApi {
  export interface Permission {
    id?: number;
    ids?: number[];
    userId?: number;
    bizType: number;
    bizId: number;
    level: number;
    toBizTypes?: number[];
    deptName?: string;
    nickname?: string;
    postNames?: string[];
    createTime?: Date;
  }

  export interface BusinessTransferReqVO {
    id: number;
    newOwnerUserId: number;
    oldOwnerPermissionLevel?: number;
    toBizTypes?: number[];
  }

  export interface PermissionListReqVO {
    bizId: number;
    bizType: number;
  }
}

export enum BizTypeEnum {
  CRM_CLUE = 1,
  CRM_CUSTOMER = 2,
  CRM_CONTACT = 3,
  CRM_BUSINESS = 4,
  CRM_CONTRACT = 5,
  CRM_PRODUCT = 6,
  CRM_RECEIVABLE = 7,
  CRM_RECEIVABLE_PLAN = 8,
  CRM_CUSTOMER_BANK_ACCOUNT = 9,
  CRM_CUSTOMER_LICENSE = 10,
}

export enum PermissionLevelEnum {
  OWNER = 1,
  READ = 2,
  WRITE = 3,
}

export function getPermissionList(
  params: CrmPermissionApi.PermissionListReqVO,
) {
  return requestClient.get<CrmPermissionApi.Permission[]>(
    '/crm/permission/list',
    { params },
  );
}

export function createPermission(data: CrmPermissionApi.Permission) {
  return requestClient.post('/crm/permission/create', data);
}

export function updatePermission(data: CrmPermissionApi.Permission) {
  return requestClient.put('/crm/permission/update', data);
}

export function deletePermissionBatch(ids: number[]) {
  return requestClient.delete(`/crm/permission/delete?ids=${ids.join(',')}`);
}

export function deleteSelfPermission(id: number) {
  return requestClient.delete(`/crm/permission/delete-self?id=${id}`);
}
