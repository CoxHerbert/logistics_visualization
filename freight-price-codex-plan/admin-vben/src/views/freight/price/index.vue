<template>
  <div class="p-4">
    <a-card>
      <a-form layout="inline" :model="query">
        <a-form-item label="运输类型">
          <a-select v-model:value="query.transportType" allowClear style="width: 140px">
            <a-select-option :value="1">海派</a-select-option>
            <a-select-option :value="2">海卡</a-select-option>
            <a-select-option :value="3">整柜</a-select-option>
            <a-select-option :value="4">美森</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="起运">
          <a-input v-model:value="query.origin" placeholder="上海/宁波/深圳" style="width: 160px" allowClear />
        </a-form-item>

        <a-form-item label="目的">
          <a-input v-model:value="query.destination" placeholder="洛杉矶/纽约/ONT8" style="width: 160px" allowClear />
        </a-form-item>

        <a-form-item label="状态">
          <a-select v-model:value="query.status" allowClear style="width: 120px">
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">停用</a-select-option>
          </a-select>
        </a-form-item>

        <a-space>
          <a-button type="primary" @click="reload">查询</a-button>
          <a-button @click="reset">重置</a-button>
          <a-button type="primary" @click="openCreate">新增运价</a-button>
        </a-space>
      </a-form>

      <a-table class="mt-4" :columns="columns" :data-source="list" :loading="loading" rowKey="id"
               :pagination="pagination" @change="onTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'transportType'">
            {{ transportTypeText(record.transportType) }}
          </template>

          <template v-else-if="column.dataIndex === 'priceMode'">
            {{ priceModeText(record.priceMode) }}
          </template>

          <template v-else-if="column.dataIndex === 'validRange'">
            {{ record.validFrom }} ~ {{ record.validTo }}
          </template>

          <template v-else-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status === 0">启用</a-tag>
            <a-tag v-else>停用</a-tag>
          </template>

          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a @click="openEdit(record.id)">编辑</a>
              <a-divider type="vertical" />
              <a @click="toggleStatus(record)">{{ record.status === 0 ? '停用' : '启用' }}</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="modal.open" :title="modal.title" @ok="submit" :confirmLoading="modal.saving" width="720px">
      <a-form :model="form" :label-col="{ style: { width: '120px' } }">
        <a-form-item label="运输类型" required>
          <a-select v-model:value="form.transportType">
            <a-select-option :value="1">海派</a-select-option>
            <a-select-option :value="2">海卡</a-select-option>
            <a-select-option :value="3">整柜</a-select-option>
            <a-select-option :value="4">美森</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="起运" required>
          <a-input v-model:value="form.origin" />
        </a-form-item>

        <a-form-item label="目的" required>
          <a-input v-model:value="form.destination" />
        </a-form-item>

        <a-form-item label="计价模式" required>
          <a-select v-model:value="form.priceMode">
            <a-select-option :value="1">按CBM</a-select-option>
            <a-select-option :value="2">按KG</a-select-option>
            <a-select-option :value="3">整柜一口价</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="单价" required>
          <a-input-number v-model:value="form.unitPrice" :min="0" style="width: 220px" />
        </a-form-item>

        <a-form-item label="最低收费" required>
          <a-input-number v-model:value="form.minPrice" :min="0" style="width: 220px" />
        </a-form-item>

        <a-form-item label="币种" required>
          <a-input v-model:value="form.currency" style="width: 120px" />
        </a-form-item>

        <a-form-item label="有效期" required>
          <a-range-picker v-model:value="form.validRange" />
        </a-form-item>

        <a-form-item label="状态" required>
          <a-select v-model:value="form.status" style="width: 120px">
            <a-select-option :value="0">启用</a-select-option>
            <a-select-option :value="1">停用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea v-model:value="form.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import {
  getFreightPricePage, getFreightPrice,
  createFreightPrice, updateFreightPrice,
  updateFreightPriceStatus
} from '@/api/freight/price';

const query = reactive({
  transportType: undefined as number | undefined,
  origin: '',
  destination: '',
  status: undefined as number | undefined,
});

const loading = ref(false);
const list = ref<any[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '类型', dataIndex: 'transportType', width: 90 },
  { title: '起运', dataIndex: 'origin', width: 120 },
  { title: '目的', dataIndex: 'destination', width: 120 },
  { title: '计价', dataIndex: 'priceMode', width: 110 },
  { title: '单价', dataIndex: 'unitPrice', width: 100 },
  { title: '最低', dataIndex: 'minPrice', width: 100 },
  { title: '币种', dataIndex: 'currency', width: 80 },
  { title: '有效期', dataIndex: 'validRange', width: 220 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '操作', dataIndex: 'actions', width: 160 },
];

const modal = reactive({ open: false, title: '新增运价', saving: false, isEdit: false });

const form = reactive<any>({
  id: undefined,
  transportType: 1,
  origin: '',
  destination: '',
  priceMode: 1,
  unitPrice: 0,
  minPrice: 0,
  currency: 'USD',
  validRange: [] as any[],
  status: 0,
  remark: '',
});

function transportTypeText(v: number) {
  return ({ 1: '海派', 2: '海卡', 3: '整柜', 4: '美森' } as any)[v] ?? String(v);
}

function priceModeText(v: number) {
  return ({ 1: '按CBM', 2: '按KG', 3: '一口价' } as any)[v] ?? String(v);
}

function resetForm() {
  form.id = undefined;
  form.transportType = 1;
  form.origin = '';
  form.destination = '';
  form.priceMode = 1;
  form.unitPrice = 0;
  form.minPrice = 0;
  form.currency = 'USD';
  form.validRange = [];
  form.status = 0;
  form.remark = '';
}

async function fetchPage() {
  loading.value = true;
  try {
    const res = await getFreightPricePage({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
    list.value = res.list || [];
    pagination.total = res.total || 0;
  } finally {
    loading.value = false;
  }
}

function reload() {
  pagination.current = 1;
  fetchPage();
}

function reset() {
  query.transportType = undefined;
  query.origin = '';
  query.destination = '';
  query.status = undefined;
  reload();
}

function onTableChange(p: any) {
  pagination.current = p.current;
  pagination.pageSize = p.pageSize;
  fetchPage();
}

function openCreate() {
  modal.open = true;
  modal.title = '新增运价';
  modal.isEdit = false;
  resetForm();
}

async function openEdit(id: number) {
  modal.open = true;
  modal.title = '编辑运价';
  modal.isEdit = true;
  const data = await getFreightPrice(id);
  resetForm();
  Object.assign(form, data);
  form.validRange = [dayjs(data.validFrom), dayjs(data.validTo)];
}

async function toggleStatus(record: any) {
  const next = record.status === 0 ? 1 : 0;
  await updateFreightPriceStatus(record.id, next);
  message.success('操作成功');
  fetchPage();
}

async function submit() {
  if (!form.validRange?.length) {
    message.warning('请选择有效期');
    return;
  }
  modal.saving = true;
  try {
    const payload = {
      id: form.id,
      transportType: form.transportType,
      origin: form.origin,
      destination: form.destination,
      priceMode: form.priceMode,
      unitPrice: form.unitPrice,
      minPrice: form.minPrice,
      currency: form.currency,
      validFrom: dayjs(form.validRange[0]).format('YYYY-MM-DD'),
      validTo: dayjs(form.validRange[1]).format('YYYY-MM-DD'),
      status: form.status,
      remark: form.remark,
    };
    if (modal.isEdit) await updateFreightPrice(payload);
    else await createFreightPrice(payload);

    message.success('保存成功');
    modal.open = false;
    fetchPage();
  } finally {
    modal.saving = false;
  }
}

onMounted(fetchPage);
</script>
