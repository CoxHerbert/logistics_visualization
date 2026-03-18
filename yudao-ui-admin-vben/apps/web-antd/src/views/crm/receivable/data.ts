import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { useUserStore } from '@vben/stores';

import { getContract, getContractSimpleList } from '#/api/crm/contract';
import { getCustomerBankAccountListByCustomer } from '#/api/crm/customer/bankAccount';
import { getCustomerSimpleList } from '#/api/crm/customer';
import {
  getReceivablePlan,
  getReceivablePlanSimpleList,
} from '#/api/crm/receivable/plan';
import { getSimpleUserList } from '#/api/system/user';

/** 新增/修改表单 */
export function useFormSchema(): VbenFormSchema[] {
  const userStore = useUserStore();

  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'no',
      label: '回款编号',
      component: 'Input',
      componentProps: {
        placeholder: '保存时自动生成',
        disabled: true,
      },
    },
    {
      fieldName: 'ownerUserId',
      label: '负责人',
      component: 'ApiSelect',
      rules: 'required',
      dependencies: {
        triggerFields: ['id'],
        disabled: (values) => values.id,
      },
      componentProps: {
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
        placeholder: '请选择负责人',
        allowClear: true,
      },
      defaultValue: userStore.userInfo?.id,
    },
    {
      fieldName: 'customerId',
      label: '客户名称',
      component: 'ApiSelect',
      rules: 'required',
      componentProps: {
        api: getCustomerSimpleList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择客户',
      },
      dependencies: {
        triggerFields: ['id'],
        disabled: (values) => values.id,
      },
    },
    {
      fieldName: 'contractId',
      label: '合同名称',
      component: 'Select',
      rules: 'required',
      dependencies: {
        triggerFields: ['customerId'],
        disabled: (values) => !values.customerId || values.id,
        async componentProps(values) {
          if (!values.customerId) {
            return {
              options: [],
              placeholder: '请先选择客户',
            } as any;
          }
          if (!values.id) {
            values.contractId = undefined;
            values.bankAccountId = undefined;
            values.planId = undefined;
          }
          const contracts = await getContractSimpleList(values.customerId);
          return {
            options: contracts.map((item) => ({
              label: item.name,
              value: item.id,
            })),
            placeholder: '请选择合同',
            onChange: async (value: any) => {
              values.contractId = value;
              values.planId = undefined;
              if (!value) {
                values.bankAccountId = undefined;
                return;
              }
              const contract = await getContract(value);
              values.bankAccountId = contract?.bankAccountId;
            },
          } as any;
        },
      },
    },
    {
      fieldName: 'bankAccountId',
      label: '收款账户',
      component: 'Select',
      componentProps: {
        options: [],
        placeholder: '请选择收款账户',
      },
      dependencies: {
        triggerFields: ['customerId', 'contractId', 'id'],
        disabled: (values) => !values.customerId,
        async componentProps(values) {
          if (!values.customerId) {
            return {
              options: [],
              placeholder: '请先选择客户',
            } as any;
          }
          const list = await getCustomerBankAccountListByCustomer(
            values.customerId,
          );
          if (!values.id && !values.bankAccountId) {
            const defaultAccount = list.find((item) => item.defaultStatus);
            if (defaultAccount) {
              values.bankAccountId = defaultAccount.id;
            }
          }
          return {
            options: list.map((item) => ({
              label: `${item.accountName} / ${item.bankName}`,
              value: item.id,
            })),
            placeholder: '请选择收款账户',
            onChange: (value: any) => {
              values.bankAccountId = value;
            },
          } as any;
        },
      },
    },
    {
      fieldName: 'planId',
      label: '回款期数',
      component: 'Select',
      rules: 'required',
      dependencies: {
        triggerFields: ['contractId'],
        disabled: (values) => !values.contractId,
        async componentProps(values) {
          if (!values.contractId) {
            return {
              options: [],
              placeholder: '请先选择合同',
            } as any;
          }
          if (!values.id) {
            values.planId = undefined;
          }
          const plans = await getReceivablePlanSimpleList(
            values.customerId,
            values.contractId,
          );
          return {
            options: plans.map((item) => ({
              label: item.period,
              value: item.id,
            })),
            placeholder: '请选择回款期数',
            onChange: async (value: any) => {
              const plan = await getReceivablePlan(value);
              values.returnTime = plan?.returnTime;
              values.price = plan?.price;
              values.returnType = plan?.returnType;
            },
          } as any;
        },
      },
    },
    {
      fieldName: 'returnType',
      label: '回款方式',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.CRM_RECEIVABLE_RETURN_TYPE, 'number'),
        placeholder: '请选择回款方式',
      },
    },
    {
      fieldName: 'price',
      label: '回款金额',
      component: 'InputNumber',
      rules: 'required',
      componentProps: {
        placeholder: '请输入回款金额',
        min: 0,
        precision: 2,
      },
    },
    {
      fieldName: 'returnTime',
      label: '回款日期',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        placeholder: '请选择回款日期',
        showTime: false,
        valueFormat: 'x',
        format: 'YYYY-MM-DD',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
      },
      formItemClass: 'md:col-span-2',
    },
  ];
}

/** 列表搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'no',
      label: '回款编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入回款编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'customerId',
      label: '客户',
      component: 'ApiSelect',
      componentProps: {
        api: getCustomerSimpleList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择客户',
        allowClear: true,
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '回款编号',
      field: 'no',
      minWidth: 160,
      fixed: 'left',
      slots: { default: 'no' },
    },
    {
      title: '客户名称',
      field: 'customerName',
      minWidth: 150,
      slots: { default: 'customerName' },
    },
    {
      title: '合同编号',
      field: 'contract',
      minWidth: 160,
      slots: { default: 'contractNo' },
    },
    {
      title: '收款户名',
      field: 'bankAccountName',
      minWidth: 180,
    },
    {
      title: '开户行',
      field: 'bankName',
      minWidth: 180,
    },
    {
      title: '回款日期',
      field: 'returnTime',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
    {
      title: '回款金额（元）',
      field: 'price',
      minWidth: 150,
      formatter: 'formatAmount2',
    },
    {
      title: '回款方式',
      field: 'returnType',
      minWidth: 150,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.CRM_RECEIVABLE_RETURN_TYPE },
      },
    },
    {
      title: '备注',
      field: 'remark',
      minWidth: 150,
    },
    {
      title: '合同金额（元）',
      field: 'contract.totalPrice',
      minWidth: 150,
      formatter: 'formatAmount2',
    },
    {
      title: '负责人',
      field: 'ownerUserName',
      minWidth: 150,
    },
    {
      title: '所属部门',
      field: 'ownerUserDeptName',
      minWidth: 150,
    },
    {
      title: '更新时间',
      field: 'updateTime',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
    {
      title: '创建时间',
      field: 'createTime',
      minWidth: 150,
      formatter: 'formatDateTime',
    },
    {
      title: '创建人',
      field: 'creatorName',
      minWidth: 150,
    },
    {
      title: '回款状态',
      field: 'auditStatus',
      minWidth: 100,
      fixed: 'right',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.CRM_AUDIT_STATUS },
      },
    },
    {
      title: '操作',
      field: 'actions',
      minWidth: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
