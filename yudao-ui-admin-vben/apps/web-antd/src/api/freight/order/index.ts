import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FreightOrderApi {
  export interface Order {
    id?: number;
    orderNo?: string;
    customerId: number;
    customerName?: string;
    contractId?: number;
    contractNo?: string;
    contractName?: string;
    contactName?: string;
    contactPhone?: string;
    bizType: string;
    transportMode: string;
    incoterms?: string;
    originPort: string;
    destinationPort: string;
    pickupAddress?: string;
    deliveryAddress?: string;
    carrierName?: string;
    cargoName?: string;
    hsCode?: string;
    packageCount?: number;
    packageType?: string;
    grossWeightKg?: number;
    volumeCbm?: number;
    containerInfo?: string;
    hasBattery?: boolean;
    sensitive?: boolean;
    customsType?: string;
    shippingMark?: string;
    deliveryType?: string;
    deliveryWarehouseCode?: string;
    deliveryWarehouseName?: string;
    amazonShipmentId?: string;
    amazonReferenceNo?: string;
    bookingNo?: string;
    soNo?: string;
    blNo?: string;
    containerNo?: string;
    sealNo?: string;
    customsNo?: string;
    pickupTime?: string;
    etd?: string;
    eta?: string;
    atd?: string;
    ata?: string;
    signTime?: string;
    currency?: string;
    receivableAmount?: number;
    payableAmount?: number;
    profitAmount?: number;
    status?: string;
    salesUserId?: number;
    operatorUserId?: number;
    remark?: string;
    createTime?: string;
  }

  export interface OrderPageReqVO extends PageParam {
    orderNo?: string;
    customerId?: number;
    contractId?: number;
    contractNo?: string;
    contractName?: string;
    status?: string;
    transportMode?: string;
    originPort?: string;
    destinationPort?: string;
    bookingNo?: string;
    blNo?: string;
    salesUserId?: number;
    createTime?: string[];
  }

  export interface OrderLog {
    id: number;
    orderId: number;
    actionType: string;
    fromStatus?: string;
    toStatus?: string;
    operatorId?: number;
    operatorName?: string;
    content?: string;
    createTime?: string;
  }

  export interface OrderFee {
    id?: number;
    orderId?: number;
    feeType: string;
    feeName: string;
    currency?: string;
    unitName?: string;
    quantity?: number;
    unitPrice?: number;
    amount?: number;
    remark?: string;
  }

  export interface OrderException {
    id?: number;
    orderId: number;
    exceptionType: string;
    exceptionStage?: string;
    severity?: string;
    title: string;
    content?: string;
    solution?: string;
    responsibleUserId?: number;
    occurTime?: string;
    closed?: boolean;
    closedTime?: string;
    createTime?: string;
  }
}

export function getFreightOrderPage(params: FreightOrderApi.OrderPageReqVO) {
  return requestClient.get<PageResult<FreightOrderApi.Order>>(
    '/freight/order/page',
    {
      params,
    },
  );
}

export function getFreightOrder(id: number) {
  return requestClient.get<FreightOrderApi.Order>(
    `/freight/order/get?id=${id}`,
  );
}

export function createFreightOrder(data: FreightOrderApi.Order) {
  return requestClient.post<number>('/freight/order/create', data);
}

export function updateFreightOrder(data: FreightOrderApi.Order) {
  return requestClient.put('/freight/order/update', data);
}

export function updateFreightOrderStatus(data: {
  id: number;
  remark?: string;
  toStatus: string;
}) {
  return requestClient.put('/freight/order/update-status', data);
}

export function getFreightOrderLogList(orderId: number) {
  return requestClient.get<FreightOrderApi.OrderLog[]>(
    `/freight/order/log/list?orderId=${orderId}`,
  );
}

export function getFreightOrderFeeList(orderId: number) {
  return requestClient.get<FreightOrderApi.OrderFee[]>(
    `/freight/order/fee/list?orderId=${orderId}`,
  );
}

export function saveFreightOrderFees(data: {
  fees: FreightOrderApi.OrderFee[];
  orderId: number;
}) {
  return requestClient.post('/freight/order/fee/save', data);
}

export function getFreightOrderExceptionList(orderId: number) {
  return requestClient.get<FreightOrderApi.OrderException[]>(
    `/freight/order/exception/list?orderId=${orderId}`,
  );
}

export function saveFreightOrderException(
  data: FreightOrderApi.OrderException,
) {
  return requestClient.post<number>('/freight/order/exception/save', data);
}

export function deleteFreightOrderException(id: number) {
  return requestClient.post(`/freight/order/exception/delete?id=${id}`);
}
