import { requestClient } from '#/api/request';

export namespace CrmCustomerLicenseApi {
  export interface License {
    id?: number;
    customerId: number;
    licenseType: string;
    licenseNo?: string;
    companyName?: string;
    expireDate?: string;
    attachmentUrl?: string;
    remark?: string;
    createTime?: string;
  }
}

export function getCustomerLicense(id: number) {
  return requestClient.get<CrmCustomerLicenseApi.License>(
    `/crm/customer-license/get?id=${id}`,
  );
}

export function getCustomerLicenseListByCustomer(customerId: number) {
  return requestClient.get<CrmCustomerLicenseApi.License[]>(
    `/crm/customer-license/list-by-customer?customerId=${customerId}`,
  );
}

export function createCustomerLicense(data: CrmCustomerLicenseApi.License) {
  return requestClient.post('/crm/customer-license/create', data);
}

export function updateCustomerLicense(data: CrmCustomerLicenseApi.License) {
  return requestClient.put('/crm/customer-license/update', data);
}

export function deleteCustomerLicense(id: number) {
  return requestClient.delete(`/crm/customer-license/delete?id=${id}`);
}
