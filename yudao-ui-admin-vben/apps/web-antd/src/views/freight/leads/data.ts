import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getRangePickerDefaultProps } from '#/utils';

const leadStatusOptions = [
  { label: '新建', value: 10 },
  { label: '跟进中', value: 20 },
  { label: '已转化', value: 30 },
  { label: '已关闭', value: 40 },
];

const shipModeMap: Record<number, string> = {
  10: '快递',
  20: '零担',
  30: '整车',
};

const cargoTypeMap: Record<number, string> = {
  10: '普货',
  20: '易碎',
  30: '冷链',
};

const sourceMap: Record<number, string> = {
  10: 'Web',
  20: 'Admin',
};

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '线索状态',
      component: 'Select',
      componentProps: {
        options: leadStatusOptions,
        allowClear: true,
        placeholder: '请选择线索状态',
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
        placeholder: ['开始时间', '结束时间'],
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      width: 90,
      fixed: 'left',
    },
    {
      field: 'contactName',
      title: '联系人',
      minWidth: 120,
      slots: {
        default: 'contactName',
      },
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 140,
    },
    {
      field: 'departureCity',
      title: '出发地',
      minWidth: 120,
    },
    {
      field: 'destinationCity',
      title: '目的地',
      minWidth: 120,
    },
    {
      field: 'shipMode',
      title: '运输方式',
      minWidth: 100,
      formatter: ({ cellValue }) => shipModeMap[cellValue] ?? `未知(${cellValue})`,
    },
    {
      field: 'cargoType',
      title: '货物类型',
      minWidth: 100,
      formatter: ({ cellValue }) => cargoTypeMap[cellValue] ?? `未知(${cellValue})`,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      formatter: ({ cellValue }) =>
        leadStatusOptions.find((item) => item.value === cellValue)?.label ??
        `未知(${cellValue})`,
    },
    {
      field: 'source',
      title: '来源',
      minWidth: 100,
      formatter: ({ cellValue }) => sourceMap[cellValue] ?? `未知(${cellValue})`,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
      showOverflow: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 170,
    },
  ];
}
