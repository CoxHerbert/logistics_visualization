import { requestClient } from '#/api/request';

export namespace CrmCustomerBankAccountApi {
  export interface BankAccount {
    id?: number;
    customerId: number;
    accountName: string;
    bankName: string;
    bankAccountNo: string;
    swiftCode?: string;
    currency?: string;
    defaultStatus?: boolean;
    remark?: string;
    createTime?: string;
  }
}

export function getCustomerBankAccount(id: number) {
  return requestClient.get<CrmCustomerBankAccountApi.BankAccount>(
    `/crm/customer-bank-account/get?id=${id}`,
  );
}

export function getCustomerBankAccountListByCustomer(customerId: number) {
  return requestClient.get<CrmCustomerBankAccountApi.BankAccount[]>(
    `/crm/customer-bank-account/list-by-customer?customerId=${customerId}`,
  );
}

export function createCustomerBankAccount(
  data: CrmCustomerBankAccountApi.BankAccount,
) {
  return requestClient.post('/crm/customer-bank-account/create', data);
}

export function updateCustomerBankAccount(
  data: CrmCustomerBankAccountApi.BankAccount,
) {
  return requestClient.put('/crm/customer-bank-account/update', data);
}

export function deleteCustomerBankAccount(id: number) {
  return requestClient.delete(`/crm/customer-bank-account/delete?id=${id}`);
}
