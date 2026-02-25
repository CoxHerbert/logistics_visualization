<template>
  <section class="hero-section">
    <a-row :gutter="24" align="middle">
      <a-col :xs="24" :lg="13">
        <h1>中美线国际货运代理</h1>
        <p>
          聚焦中国至美国海运与空运专线，提供订舱、报关、清关、尾程派送与保险服务，适配跨境电商与一般贸易场景。
        </p>
        <a-space>
          <RouterLink to="/get-plan?origin=上海&destination=洛杉矶&shipMode=20&cargoType=10">
            <a-button type="primary" size="large">获取中美报价</a-button>
          </RouterLink>
          <RouterLink to="/get-plan?origin=上海&destination=纽约&shipMode=10&cargoType=10&remark=咨询清关方案">
            <a-button size="large">咨询清关方案</a-button>
          </RouterLink>
        </a-space>
        <a-row :gutter="12" class="hero-tags">
          <a-col v-for="tag in strengths" :key="tag">
            <a-tag color="blue">{{ tag }}</a-tag>
          </a-col>
        </a-row>
      </a-col>
      <a-col :xs="24" :lg="11">
        <img class="hero-image" src="/images/home/pier.jpg" alt="中美线国际货运码头主视觉" />
      </a-col>
    </a-row>
  </section>

  <section class="service-section">
    <h2 class="section-title">中美专线服务</h2>
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in serviceCards" :key="item.title" :xs="24" :sm="12" :lg="6">
        <a-card class="service-card" :bodyStyle="{ padding: '12px' }">
          <div class="service-image-wrap">
            <img class="service-image" :src="resolvePublicImage(item.image)" :alt="item.title" />
          </div>
          <div class="service-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </section>

  <!-- ✅ 更简单：直接展示，不点也能看懂 -->
  <section class="flow-section">
    <div class="flow-header">
      <div>
        <h2 class="section-title" style="margin-bottom: 6px">中美海运全流程服务节点</h2>
        <div class="flow-sub">我们把复杂留在内部，您只需要看到：每一步我们做什么、您获得什么保障。</div>
      </div>

      <div class="flow-actions">
        <a-space>
          <a-tag class="legend-tag" color="green">重点保障</a-tag>
          <a-tag class="legend-tag" color="blue">常规节点</a-tag>
          <a-button size="small" @click="toggleAll">
            {{ showAll ? '收起（只看重点）' : '展开全部节点' }}
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 顶部轻提示 -->
    <div class="flow-hint">
      <a-space wrap>
        <span class="hint-item">✅ 关键节点会主动提醒与确认</span>
        <span class="hint-item">✅ 进度可追踪，异常会第一时间给出处理方案</span>
      </a-space>
    </div>

    <!-- 节点卡片（默认只展示重点保障） -->
    <a-row :gutter="[14, 14]" class="flow-grid">
      <a-col v-for="node in visibleNodes" :key="node.key" :xs="24" :md="12" :lg="8">
        <a-card class="node-card" :bodyStyle="{ padding: '14px 14px 12px' }">
          <div class="node-head">
            <div class="node-title">
              <span class="node-dot" :data-focus="node.focus ? '1' : '0'"></span>
              <span class="node-name">{{ node.title }}</span>
            </div>
            <a-tag size="small" :color="node.focus ? 'green' : 'blue'">
              {{ node.focus ? '重点保障' : '常规' }}
            </a-tag>
          </div>

          <div class="node-short">{{ node.short }}</div>

          <div class="node-block">
            <div class="node-label">我们会做什么</div>
            <div class="node-text">• {{ firstAction(node) }}</div>
          </div>

          <div class="node-block">
            <div class="node-label">您获得什么保障</div>
            <div class="node-text">• {{ firstGuarantee(node) }}</div>
          </div>

          <div class="node-footer">
            <RouterLink :to="node.cta || '/get-plan'">
              <a-button type="link" class="node-link">基于该节点获取方案 →</a-button>
            </RouterLink>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </section>

  <section class="contact-section">
    <h2 class="section-title">联系我们</h2>
    <a-row :gutter="[20, 20]" align="top">
      <a-col :xs="24" :lg="10">
        <a-card class="contact-info-card" :bodyStyle="{ padding: '18px' }">
          <h3>中美专线顾问 1 对 1 服务</h3>
          <p>留下联系方式，我们将在 30 分钟内回电，提供航线建议、报价与清关风险提示。</p>
          <ul>
            <li>✅ 支持整箱 / 拼箱 / 空运</li>
            <li>✅ 支持美国清关与保险方案咨询</li>
            <li>✅ 支持订舱到签收节点追踪答疑</li>
          </ul>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="14">
        <a-card class="contact-form-card" :bodyStyle="{ padding: '18px' }">
          <a-form layout="vertical" @submit.prevent="submitContact">
            <a-row :gutter="12">
              <a-col :xs="24" :md="12">
                <a-form-item label="联系人" required>
                  <a-input v-model:value="contactForm.contactName" placeholder="请输入联系人姓名" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="联系电话" required>
                  <a-input v-model:value="contactForm.contactPhone" placeholder="请输入手机号/座机" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="12">
              <a-col :xs="24" :md="12">
                <a-form-item label="公司名称">
                  <a-input v-model:value="contactForm.companyName" placeholder="选填" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="关注航线">
                  <a-input v-model:value="contactForm.shippingRoute" placeholder="如：上海 - 洛杉矶" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="咨询内容">
              <a-textarea
                v-model:value="contactForm.remark"
                :rows="4"
                placeholder="请输入您的货物类型、时效要求或当前问题"
              />
            </a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" :loading="submittingContact">提交咨询</a-button>
              <a-button @click="resetContactForm">重置</a-button>
            </a-space>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { RouterLink } from 'vue-router'
import { createContactConsult } from '@/api/portal'
import { usePortalStore } from '@/stores/portal'

type FlowNode = {
  key: string
  title: string
  short: string
  focus?: boolean
  actions: string[]
  guarantees: string[]
  cta?: string
}

const portalStore = usePortalStore()

const strengths = ['中美固定舱位', '美国清关合规支持', '尾程卡派/快递派送', '7×24 异常响应']


const resolvePublicImage = (path: string) => `${import.meta.env.BASE_URL}${path}`

const serviceCards = [
  {
    title: '中美海运整箱/拼箱',
    description: '覆盖上海、宁波、深圳至美西/美东主力港口，稳定周班。',
    image: 'images/home/china_us_ocean.jpg'
  },
  {
    title: '中美空运专线',
    description: '上海/深圳/香港起飞，直飞 LAX/JFK/ORD，时效稳定。',
    image: 'images/home/china_us_air.jpg'
  },
  {
    title: '美国清关与保险',
    description: '支持 ISF、AMS、Bond 及货运险方案，降低目的港风险。',
    image: 'images/home/customs_insurance.jpg'
  },
  {
    title: '全程可视化',
    description: '订舱到签收全链路节点追踪，异常自动预警与通知。',
    image: 'images/home/tracking_visualization.jpg'
  }
]

// ✅ 你的节点数据保留不变（只是展示方式改了）
const flowNodes: FlowNode[] = [
  {
    key: 'QUOTE',
    title: '方案确认',
    short: '需求/报价口径',
    focus: true,
    actions: ['了解货物与交期需求', '给出清晰的运输方案（整柜/拼箱/快船等）', '确认费用口径与关键时间点'],
    guarantees: ['报价项清晰，避免临时加价误会', '交期更可控，方案更匹配业务'],
    cta: '/get-plan?remark=我想确认运输方案与报价口径'
  },
  {
    key: 'CN_PICKUP',
    title: '国内提货',
    short: '门点/送仓',
    actions: ['安排车辆上门提货或送仓', '核对地址、时间与装货信息', '出发与到达进度同步'],
    guarantees: ['按计划衔接后续节点', '有人跟进，不用反复催进度'],
    cta: '/get-plan?remark=我需要国内提货或送仓安排'
  },
  {
    key: 'WAREHOUSE',
    title: '集货/装前',
    short: '集货/贴标/装前准备',
    actions: ['确认箱唛/件数/外箱情况', '必要时协助贴标与加固建议', '装柜前再次核对货物信息'],
    guarantees: ['装柜更顺利、单证更一致', '减少来回沟通成本'],
    cta: '/get-plan?remark=我需要集货与装前准备建议'
  },
  {
    key: 'BOOKING',
    title: '订舱',
    short: '航次/截关确认',
    focus: true,
    actions: ['提前锁舱并确认航次', '同步截港/截关时间', '关键变动第一时间告知'],
    guarantees: ['尽量保障舱位与船期', '交期计划更稳定'],
    cta: '/get-plan?remark=我想锁定船期与舱位'
  },
  {
    key: 'PICKUP_EMPTY',
    title: '提柜',
    short: '提空柜/验柜',
    actions: ['安排提空柜与验柜', '异常及时更换与记录', '按截关倒排时间'],
    guarantees: ['减少临时返工与等待', '节奏更可控']
  },
  {
    key: 'STUFFING',
    title: '装柜',
    short: '装箱/封条',
    actions: ['按装载方案装柜与加固', '记录封条信息并留档', '装柜完成同步进度'],
    guarantees: ['装柜过程更规范', '后续追溯更方便']
  },
  {
    key: 'EXPORT_CUSTOMS',
    title: '报关',
    short: '资料审核/放行',
    focus: true,
    actions: ['提前审核单证资料', '协助补充必要信息', '放行进度主动同步'],
    guarantees: ['减少来回补资料', '更大概率按计划赶上船期'],
    cta: '/get-plan?remark=我想了解报关资料与流程'
  },
  {
    key: 'ONBOARD',
    title: '装船',
    short: '确认装船',
    actions: ['确认装船状态与关键回执', '同步装船结果与预计到港', '必要时提供替代安排建议'],
    guarantees: ['节点清晰可追踪', '异常更快得到处理方案']
  },
  {
    key: 'SAILING',
    title: '海上运输',
    short: 'ATD/ETA 跟踪',
    actions: ['跟踪离港/到港时间', '定期同步节点进度', '到港前提醒准备事项'],
    guarantees: ['进度透明', '到港衔接更顺畅']
  },
  {
    key: 'ARRIVAL',
    title: '到港',
    short: '到港衔接',
    focus: true,
    actions: ['到港前提醒关键动作与时间点', '协助安排提货/派送资源', '异常第一时间同步'],
    guarantees: ['减少临时手忙脚乱', '衔接更顺滑'],
    cta: '/get-plan?remark=我想要到港后的派送安排建议'
  },
  {
    key: 'IMPORT_CUSTOMS',
    title: '清关',
    short: '美国清关安排',
    focus: true,
    actions: ['对接美国清关支持', '跟进清关进度并同步结果', '必要时提供补充材料指引'],
    guarantees: ['清关过程有人盯', '问题出现能快速给方向'],
    cta: '/get-plan?remark=我想了解美国清关支持与资料'
  },
  {
    key: 'DELIVERY',
    title: '派送',
    short: '卡派/快递',
    actions: ['安排卡派或快递派送', '预约送仓或送门点', '同步派送进度与签收结果'],
    guarantees: ['尾程不失联', '签收结果可追踪']
  },
  {
    key: 'POD',
    title: '签收',
    short: '交付完成',
    actions: ['回传签收信息与回单（如有）', '协助处理异常签收情况', '整理本票经验给下次更省心'],
    guarantees: ['交付闭环', '下一票更顺畅']
  }
]

// ✅ 默认只展示重点保障节点（更轻、不会吓人）
const showAll = ref(false)
const visibleNodes = computed(() => {
  if (showAll.value) return flowNodes
  return flowNodes.filter((n) => n.focus)
})
const toggleAll = () => {
  showAll.value = !showAll.value
}

// 展示“第一条”即可（避免信息过载）
const firstAction = (n: FlowNode) => n.actions?.[0] || '全程跟进与节点同步'
const firstGuarantee = (n: FlowNode) => n.guarantees?.[0] || '进度透明，异常快速响应'

const contactForm = reactive({
  contactName: '',
  contactPhone: '',
  companyName: '',
  shippingRoute: '',
  remark: ''
})
const submittingContact = ref(false)

const resetContactForm = () => {
  contactForm.contactName = ''
  contactForm.contactPhone = ''
  contactForm.companyName = ''
  contactForm.shippingRoute = ''
  contactForm.remark = ''
}

const submitContact = async () => {
  if (!contactForm.contactName.trim() || !contactForm.contactPhone.trim()) {
    message.warning('请先填写联系人和联系电话')
    return
  }

  submittingContact.value = true
  try {
    await createContactConsult({
      contactName: contactForm.contactName.trim(),
      contactPhone: contactForm.contactPhone.trim(),
      companyName: contactForm.companyName.trim(),
      shippingRoute: contactForm.shippingRoute.trim(),
      remark: contactForm.remark.trim()
    })
    message.success('提交成功，我们会尽快联系您')
    resetContactForm()
  } catch {
    message.error('提交失败，请稍后重试')
  } finally {
    submittingContact.value = false
  }
}

onMounted(async () => {
  await portalStore.refreshStats()
})
</script>

<style scoped>
.hero-section,
.flow-section,
.service-section,
section {
  margin: 0 auto;
}

.service-section {
  margin-top: 22px;
}

.contact-section {
  margin-top: 24px;
}

.contact-info-card,
.contact-form-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.contact-info-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.88);
}

.contact-info-card p {
  margin: 10px 0;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.62);
}

.contact-info-card ul {
  margin: 0;
  padding-left: 18px;
  color: rgba(0, 0, 0, 0.68);
  line-height: 1.9;
}

.service-card {
  overflow: hidden;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
}

.service-image-wrap {
  height: 168px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(180deg, #fafcff 0%, #f4f7fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.service-content {
  padding: 12px 4px 2px;
}

.service-content h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.4;
}

.service-content p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(0, 0, 0, 0.62);
  min-height: 44px;
}

/* ====== Hero ====== */
.hero-section {
  margin-top: 8px;
  padding: 40px 28px;
  border-radius: 20px;
  background:
    radial-gradient(800px 400px at 20% 0%, rgba(22, 119, 255, 0.18), transparent 60%),
    radial-gradient(700px 380px at 100% 30%, rgba(82, 196, 26, 0.12), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.hero-section h1 {
  margin: 0 0 12px 0;
  font-size: 40px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(0, 0, 0, 0.88);
}

.hero-section p {
  margin: 0 0 22px 0;
  font-size: 15px;
  line-height: 1.75;
  color: rgba(0, 0, 0, 0.62);
  max-width: 640px;
}

:deep(.ant-btn-lg) {
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
}

:deep(.ant-btn-primary) {
  box-shadow: 0 10px 22px rgba(22, 119, 255, 0.28);
}

:deep(.ant-btn-primary:hover),
:deep(.ant-btn:not(.ant-btn-primary):hover) {
  transform: translateY(-1px);
}

.hero-tags {
  margin-top: 16px;
}

.hero-tags :deep(.ant-tag) {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(22, 119, 255, 0.18);
  background: rgba(22, 119, 255, 0.06);
  color: rgba(0, 0, 0, 0.72);
}

.hero-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  filter: drop-shadow(0 18px 26px rgba(0, 0, 0, 0.12));
  transform: translateY(4px);
}

/* ====== Titles ====== */
.section-title {
  margin: 26px 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.88);
  letter-spacing: -0.01em;
}

/* ====== Flow section ====== */
.flow-section {
  margin-top: 10px;
}

.flow-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}

.flow-sub {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.58);
}

.flow-actions {
  display: flex;
  align-items: center;
}

.legend-tag {
  border-radius: 999px;
  padding: 2px 10px;
}

.flow-hint {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0, 0, 0, 0.08);
}

.hint-item {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.62);
}

/* Grid */
.flow-grid {
  margin-top: 12px;
}

/* Card */
.node-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.node-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.1);
}

.node-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.node-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.node-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
  border: 2px solid rgba(0, 0, 0, 0.08);
  background: rgba(22, 119, 255, 0.95);
}

.node-dot[data-focus='1'] {
  background: rgba(82, 196, 26, 0.95);
}

.node-name {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.88);
}

.node-short {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
}

.node-block {
  margin-top: 10px;
}

.node-label {
  font-size: 12px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.72);
  margin-bottom: 4px;
}

.node-text {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.62);
}

.node-footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.node-link {
  padding: 0;
}

/* Responsive */
@media (max-width: 992px) {
  .hero-section {
    padding: 28px 18px;
  }

  .hero-section h1 {
    font-size: 32px;
  }

  .hero-image {
    margin-top: 18px;
    max-height: 240px;
  }

  .flow-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .hero-section {
    border-radius: 16px;
  }

  .hero-section h1 {
    font-size: 28px;
  }

  :deep(.ant-btn-lg) {
    height: 42px;
    border-radius: 12px;
  }
}
</style>
