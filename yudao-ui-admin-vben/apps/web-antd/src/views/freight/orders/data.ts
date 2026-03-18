import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getCustomerSimpleList } from '#/api/crm/customer';
import { getSimpleUserList } from '#/api/system/user';
import { getRangePickerDefaultProps } from '#/utils';

export type OrderFormStage = 'basic' | 'booking' | 'customs' | 'delivery';

export interface OrderTransitionConfig {
  description: string;
  label: string;
  schema: VbenFormSchema[];
  title: string;
  toStatus: string;
}

export const transportModeOptions = [
  { label: '海运整柜', value: 'SEA_FCL' },
  { label: '海运拼箱', value: 'SEA_LCL' },
  { label: '空运', value: 'AIR' },
  { label: '铁路', value: 'RAIL' },
  { label: '卡航', value: 'TRUCK' },
];

export const bizTypeOptions = [
  { label: '出口', value: 'EXPORT' },
  { label: '进口', value: 'IMPORT' },
  { label: 'FBA头程', value: 'FBA' },
  { label: '跨境电商', value: 'CROSS_BORDER' },
];

export const incotermsOptions = [
  { label: 'EXW', value: 'EXW' },
  { label: 'FOB', value: 'FOB' },
  { label: 'CIF', value: 'CIF' },
  { label: 'DDP', value: 'DDP' },
  { label: 'DAP', value: 'DAP' },
];

export const deliveryTypeOptions = [
  { label: '普通地址', value: 'NORMAL' },
  { label: 'FBA仓库', value: 'FBA_WAREHOUSE' },
  { label: '海外仓', value: 'OVERSEAS_WAREHOUSE' },
  { label: '自提', value: 'SELF_PICKUP' },
];

export const orderStatusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '待审核', value: 'PENDING_REVIEW' },
  { label: '待报价', value: 'PENDING_QUOTE' },
  { label: '已报价', value: 'QUOTED' },
  { label: '待订舱', value: 'PENDING_BOOKING' },
  { label: '已订舱', value: 'BOOKED' },
  { label: '报关中', value: 'CUSTOMS_PROCESSING' },
  { label: '运输中', value: 'IN_TRANSIT' },
  { label: '已到港', value: 'ARRIVED' },
  { label: '已签收', value: 'SIGNED' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' },
];

export const statusTextMap: Record<string, string> = {};
for (const item of orderStatusOptions) {
  statusTextMap[item.value] = item.label;
}

export const stageTextMap: Record<OrderFormStage, string> = {
  basic: '基础录单',
  booking: '订舱阶段',
  customs: '报关运输',
  delivery: '到港签收与结算',
};

function createDivider(fieldName: string, title: string): VbenFormSchema {
  return {
    component: 'Divider',
    fieldName,
    label: '',
    formItemClass: 'col-span-2 freight-order-section',
    renderComponentContent: () => ({
      default: () => [title],
    }),
  };
}

function createDateField(fieldName: string, label: string): VbenFormSchema {
  return {
    fieldName,
    label,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  };
}

function createBasicSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    createDivider('basicInfoDivider', '基础资料'),
    {
      fieldName: 'customerId',
      label: '客户',
      component: 'ApiSelect',
      componentProps: {
        api: getCustomerSimpleList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择CRM客户',
      },
      rules: 'required',
    },
    { fieldName: 'contactName', label: '联系人', component: 'Input' },
    { fieldName: 'contactPhone', label: '联系电话', component: 'Input' },
    {
      fieldName: 'bizType',
      label: '业务类型',
      component: 'Select',
      componentProps: {
        options: bizTypeOptions,
        placeholder: '请选择业务类型',
      },
      rules: 'required',
    },
    {
      fieldName: 'transportMode',
      label: '运输方式',
      component: 'Select',
      componentProps: {
        options: transportModeOptions,
        placeholder: '请选择运输方式',
      },
      rules: 'required',
    },
    {
      fieldName: 'incoterms',
      label: '贸易条款',
      component: 'Select',
      componentProps: { options: incotermsOptions, allowClear: true },
    },
    {
      fieldName: 'originPort',
      label: 'POL 起运港',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'destinationPort',
      label: 'POD 目的港',
      component: 'Input',
      rules: 'required',
    },
    { fieldName: 'pickupAddress', label: '提货地址', component: 'Input' },
    { fieldName: 'deliveryAddress', label: '送货地址', component: 'Input' },
    {
      fieldName: 'deliveryType',
      label: '交付类型',
      component: 'Select',
      componentProps: {
        options: deliveryTypeOptions,
        allowClear: true,
        placeholder: '请选择交付类型',
      },
    },
    {
      fieldName: 'deliveryWarehouseCode',
      label: 'FBA仓库代码',
      component: 'Input',
    },
    {
      fieldName: 'deliveryWarehouseName',
      label: 'FBA仓库名称',
      component: 'Input',
    },
    {
      fieldName: 'amazonShipmentId',
      label: 'Amazon Shipment ID',
      component: 'Input',
    },
    {
      fieldName: 'amazonReferenceNo',
      label: 'Amazon Reference',
      component: 'Input',
    },
    createDivider('cargoDivider', '货物信息'),
    { fieldName: 'carrierName', label: '船司/航司', component: 'Input' },
    { fieldName: 'cargoName', label: '货物品名', component: 'Input' },
    {
      fieldName: 'packageCount',
      label: 'PKGS 件数',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0 },
    },
    {
      fieldName: 'grossWeightKg',
      label: 'GW 毛重(KG)',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 3 },
    },
    {
      fieldName: 'volumeCbm',
      label: 'CBM 体积',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 3 },
    },
    { fieldName: 'containerInfo', label: '箱型箱量', component: 'Input' },
    {
      fieldName: 'hasBattery',
      label: '带电',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '否', value: false },
          { label: '是', value: true },
        ],
      },
      defaultValue: false,
    },
    {
      fieldName: 'sensitive',
      label: '敏感货',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '否', value: false },
          { label: '是', value: true },
        ],
      },
      defaultValue: false,
    },
    createDivider('ownerDivider', '业务归属'),
    {
      fieldName: 'salesUserId',
      label: '销售',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
        allowClear: true,
      },
    },
    {
      fieldName: 'operatorUserId',
      label: '操作',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
        allowClear: true,
      },
    },
    {
      fieldName: 'currency',
      label: '币种',
      component: 'Input',
      defaultValue: 'USD',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { rows: 3 },
      formItemClass: 'col-span-2',
    },
  ];
}

function createBookingSchema(): VbenFormSchema[] {
  return [
    createDivider('bookingDivider', '订舱信息'),
    { fieldName: 'bookingNo', label: 'Booking No. 订舱号', component: 'Input' },
    { fieldName: 'soNo', label: 'SO No.', component: 'Input' },
    createDateField('etd', 'ETD 预计离港'),
    createDateField('eta', 'ETA 预计到港'),
  ];
}

function createCustomsSchema(): VbenFormSchema[] {
  return [
    createDivider('customsDivider', '报关与运输'),
    { fieldName: 'customsType', label: '报关方式', component: 'Input' },
    {
      fieldName: 'customsNo',
      label: 'Customs No. 报关单号',
      component: 'Input',
    },
    { fieldName: 'shippingMark', label: '唛头', component: 'Input' },
    { fieldName: 'blNo', label: 'B/L No. 提单号', component: 'Input' },
    {
      fieldName: 'containerNo',
      label: 'Container No. 柜号',
      component: 'Input',
    },
    { fieldName: 'sealNo', label: 'Seal No. 封条号', component: 'Input' },
    createDateField('atd', 'ATD 实际离港'),
  ];
}

function createDeliverySchema(): VbenFormSchema[] {
  return [
    createDivider('deliveryDivider', '到港签收与结算'),
    createDateField('ata', 'ATA 实际到港'),
    createDateField('signTime', 'POD 签收时间'),
    {
      fieldName: 'receivableAmount',
      label: '应收',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2 },
      defaultValue: 0,
    },
    {
      fieldName: 'payableAmount',
      label: '应付',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2 },
      defaultValue: 0,
    },
    {
      fieldName: 'profitAmount',
      label: '利润',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2 },
      defaultValue: 0,
    },
  ];
}

export function getOrderFormStage(status?: string): OrderFormStage {
  if (['BOOKED', 'PENDING_BOOKING'].includes(status || '')) return 'booking';
  if (['CUSTOMS_PROCESSING', 'IN_TRANSIT'].includes(status || ''))
    return 'customs';
  if (['ARRIVED', 'COMPLETED', 'SIGNED'].includes(status || ''))
    return 'delivery';
  return 'basic';
}

export function useFormSchema(
  stage: OrderFormStage = 'basic',
): VbenFormSchema[] {
  const schema = [...createBasicSchema()];
  if (stage === 'booking' || stage === 'customs' || stage === 'delivery')
    schema.push(...createBookingSchema());
  if (stage === 'customs' || stage === 'delivery')
    schema.push(...createCustomsSchema());
  if (stage === 'delivery') schema.push(...createDeliverySchema());
  return schema;
}

const transitionSchemaMap: Record<string, VbenFormSchema[]> = {
  ARRIVED: [
    createDivider('arrivedDivider', '到港节点'),
    createDateField('ata', 'ATA 实际到港'),
  ],
  BOOKED: createBookingSchema(),
  COMPLETED: [
    createDivider('completeDivider', '结算节点'),
    {
      fieldName: 'receivableAmount',
      label: '应收',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2 },
      defaultValue: 0,
    },
    {
      fieldName: 'payableAmount',
      label: '应付',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2 },
      defaultValue: 0,
    },
    {
      fieldName: 'profitAmount',
      label: '利润',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 2 },
      defaultValue: 0,
    },
  ],
  CUSTOMS_PROCESSING: [
    createDivider('customsTransitionDivider', '报关节点'),
    { fieldName: 'customsType', label: '报关方式', component: 'Input' },
    {
      fieldName: 'customsNo',
      label: 'Customs No. 报关单号',
      component: 'Input',
    },
    { fieldName: 'shippingMark', label: '唛头', component: 'Input' },
  ],
  IN_TRANSIT: [
    createDivider('transitDivider', '运输节点'),
    { fieldName: 'blNo', label: 'B/L No. 提单号', component: 'Input' },
    {
      fieldName: 'containerNo',
      label: 'Container No. 柜号',
      component: 'Input',
    },
    { fieldName: 'sealNo', label: 'Seal No. 封条号', component: 'Input' },
    createDateField('atd', 'ATD 实际离港'),
  ],
  PENDING_BOOKING: [
    createDivider('preBookingDivider', '订舱准备'),
    { fieldName: 'carrierName', label: '船司/航司', component: 'Input' },
    { fieldName: 'cargoName', label: '货物品名', component: 'Input' },
    { fieldName: 'containerInfo', label: '箱型箱量', component: 'Input' },
  ],
  PENDING_QUOTE: [
    createDivider('quoteDivider', '报价准备'),
    { fieldName: 'cargoName', label: '货物品名', component: 'Input' },
    {
      fieldName: 'packageCount',
      label: 'PKGS 件数',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 0 },
    },
    {
      fieldName: 'grossWeightKg',
      label: 'GW 毛重(KG)',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 3 },
    },
    {
      fieldName: 'volumeCbm',
      label: 'CBM 体积',
      component: 'InputNumber',
      componentProps: { min: 0, precision: 3 },
    },
  ],
  PENDING_REVIEW: [
    createDivider('reviewDivider', '审核提交'),
    {
      fieldName: 'customerId',
      label: '客户',
      component: 'ApiSelect',
      componentProps: {
        api: getCustomerSimpleList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择CRM客户',
      },
      rules: 'required',
    },
    {
      fieldName: 'bizType',
      label: '业务类型',
      component: 'Select',
      componentProps: { options: bizTypeOptions },
      rules: 'required',
    },
    {
      fieldName: 'transportMode',
      label: '运输方式',
      component: 'Select',
      componentProps: { options: transportModeOptions },
      rules: 'required',
    },
    {
      fieldName: 'originPort',
      label: 'POL 起运港',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'destinationPort',
      label: 'POD 目的港',
      component: 'Input',
      rules: 'required',
    },
  ],
  QUOTED: [
    createDivider('quotedDivider', '报价确认'),
    {
      fieldName: 'incoterms',
      label: '贸易条款',
      component: 'Select',
      componentProps: { options: incotermsOptions, allowClear: true },
    },
    {
      fieldName: 'currency',
      label: '币种',
      component: 'Input',
      defaultValue: 'USD',
    },
  ],
  SIGNED: [
    createDivider('signedDivider', '签收节点'),
    createDateField('signTime', 'POD 签收时间'),
  ],
};

const transitionConfigMap: Record<string, OrderTransitionConfig> = {
  ARRIVED: {
    toStatus: 'ARRIVED',
    label: '确认到港',
    title: '确认到港',
    description: '补充 ATA 实际到港时间，保存后推进到已到港。',
    schema: transitionSchemaMap.ARRIVED,
  },
  BOOKED: {
    toStatus: 'BOOKED',
    label: '确认订舱',
    title: '确认订舱',
    description: '填写 Booking No.、SO No.、ETD、ETA 后推进到已订舱。',
    schema: transitionSchemaMap.BOOKED,
  },
  COMPLETED: {
    toStatus: 'COMPLETED',
    label: '完成业务',
    title: '完成业务',
    description: '确认应收、应付、利润后推进到已完成。',
    schema: transitionSchemaMap.COMPLETED,
  },
  CUSTOMS_PROCESSING: {
    toStatus: 'CUSTOMS_PROCESSING',
    label: '进入报关',
    title: '进入报关',
    description: '补充报关信息后推进到报关中。',
    schema: transitionSchemaMap.CUSTOMS_PROCESSING,
  },
  IN_TRANSIT: {
    toStatus: 'IN_TRANSIT',
    label: '开始运输',
    title: '开始运输',
    description: '补充 B/L No.、Container No.、Seal No.、ATD 后推进到运输中。',
    schema: transitionSchemaMap.IN_TRANSIT,
  },
  PENDING_BOOKING: {
    toStatus: 'PENDING_BOOKING',
    label: '转待订舱',
    title: '转待订舱',
    description: '补充订舱前资料后推进到待订舱。',
    schema: transitionSchemaMap.PENDING_BOOKING,
  },
  PENDING_QUOTE: {
    toStatus: 'PENDING_QUOTE',
    label: '审核通过',
    title: '审核通过',
    description: '补充报价前货物信息后推进到待报价。',
    schema: transitionSchemaMap.PENDING_QUOTE,
  },
  PENDING_REVIEW: {
    toStatus: 'PENDING_REVIEW',
    label: '提交审核',
    title: '提交审核',
    description: '确认基础资料完整后推进到待审核。',
    schema: transitionSchemaMap.PENDING_REVIEW,
  },
  QUOTED: {
    toStatus: 'QUOTED',
    label: '完成报价',
    title: '完成报价',
    description: '补充报价关键字段后推进到已报价。',
    schema: transitionSchemaMap.QUOTED,
  },
  SIGNED: {
    toStatus: 'SIGNED',
    label: '确认签收',
    title: '确认签收',
    description: '补充签收时间后推进到已签收。',
    schema: transitionSchemaMap.SIGNED,
  },
};

export function getOrderTransitionConfig(toStatus?: string) {
  if (!toStatus) return undefined;
  return transitionConfigMap[toStatus];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'orderNo',
      label: '业务单号',
      component: 'Input',
      componentProps: { allowClear: true },
    },
    {
      fieldName: 'customerId',
      label: '客户',
      component: 'ApiSelect',
      componentProps: {
        api: getCustomerSimpleList,
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
      },
    },
    {
      fieldName: 'contractNo',
      label: '合同编号',
      component: 'Input',
      componentProps: { allowClear: true },
    },
    {
      fieldName: 'contractName',
      label: '合同名称',
      component: 'Input',
      componentProps: { allowClear: true },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: { options: orderStatusOptions, allowClear: true },
    },
    {
      fieldName: 'transportMode',
      label: '运输方式',
      component: 'Select',
      componentProps: { options: transportModeOptions, allowClear: true },
    },
    {
      fieldName: 'originPort',
      label: 'POL 起运港',
      component: 'Input',
      componentProps: { allowClear: true },
    },
    {
      fieldName: 'destinationPort',
      label: 'POD 目的港',
      component: 'Input',
      componentProps: { allowClear: true },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: { ...getRangePickerDefaultProps(), allowClear: true },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'orderNo',
      title: '业务单号',
      minWidth: 170,
      fixed: 'left',
      slots: { default: 'orderNo' },
    },
    { field: 'customerName', title: '客户', minWidth: 180 },
    { field: 'contractNo', title: '合同编号', minWidth: 160 },
    { field: 'contractName', title: '合同名称', minWidth: 220 },
    {
      field: 'transportMode',
      title: '运输方式',
      minWidth: 140,
      formatter: ({ cellValue }) =>
        transportModeOptions.find((item) => item.value === cellValue)?.label ??
        cellValue ??
        '-',
    },
    {
      field: 'bizType',
      title: '业务类型',
      minWidth: 140,
      formatter: ({ cellValue }) =>
        bizTypeOptions.find((item) => item.value === cellValue)?.label ??
        cellValue ??
        '-',
    },
    { field: 'originPort', title: 'POL 起运港', minWidth: 140 },
    { field: 'destinationPort', title: 'POD 目的港', minWidth: 140 },
    { field: 'cargoName', title: '货物品名', minWidth: 160 },
    { field: 'packageCount', title: 'PKGS 件数', width: 100 },
    { field: 'grossWeightKg', title: 'GW 毛重(KG)', minWidth: 120 },
    { field: 'volumeCbm', title: 'CBM 体积', minWidth: 110 },
    {
      field: 'status',
      title: '状态',
      minWidth: 160,
      formatter: ({ cellValue }) =>
        statusTextMap[cellValue] ?? cellValue ?? '-',
    },
    {
      field: 'etd',
      title: 'ETD 预计离港',
      formatter: 'formatDateTime',
      minWidth: 170,
    },
    {
      field: 'eta',
      title: 'ETA 预计到港',
      formatter: 'formatDateTime',
      minWidth: 170,
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
      minWidth: 180,
    },
    {
      title: '操作',
      width: 300,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
