<template>
  <div class="contact-page">
    <section class="contact-hero section-card">
      <div class="contact-hero__content">
        <p class="contact-hero__kicker">Contact Us</p>
        <h1>告诉我们你的出货计划</h1>
        <p class="contact-hero__desc">
          无需登录，提交后直接进入 CRM 线索。我们会结合货型、起运地、目的地和时效要求，给你一个可执行的建议。
        </p>
      </div>
      <div class="contact-hero__side">
        <div class="contact-meta-card">
          <p class="contact-meta-card__label">微信咨询</p>
          <p class="contact-meta-card__value">{{ wechatId }}</p>
          <p class="contact-meta-card__hint">如果需求紧急，可以先微信沟通，再补充资料。</p>
        </div>
      </div>
    </section>

    <section class="contact-body">
      <div class="contact-form-card section-card">
        <div class="card-head">
          <p class="card-head__kicker">Quick Form</p>
          <h2>提交咨询</h2>
        </div>

        <a-form layout="vertical">
          <a-row :gutter="14">
            <a-col :xs="24" :md="12">
              <a-form-item label="公司 / 联系人名称" required>
                <a-input v-model:value="contactForm.name" maxlength="255" placeholder="如：宁波雷之声" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="手机号" required>
                <a-input v-model:value="contactForm.mobile" maxlength="20" placeholder="用于销售回访" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="14">
            <a-col :xs="24" :md="12">
              <a-form-item label="邮箱">
                <a-input v-model:value="contactForm.email" maxlength="255" placeholder="可选，便于发送方案" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="微信">
                <a-input v-model:value="contactForm.wechat" maxlength="255" placeholder="可选" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="备注">
            <a-textarea
              v-model:value="contactForm.remark"
              :rows="5"
              maxlength="500"
              placeholder="如：货物类型、件数、出货城市、目的仓、预计时效、预算区间"
            />
          </a-form-item>

          <div class="contact-actions">
            <a-button type="primary" size="large" :loading="submittingContact" @click="submitContact">
              提交咨询
            </a-button>
            <RouterLink to="/me">
              <a-button size="large">查看顾问联系方式</a-button>
            </RouterLink>
          </div>
        </a-form>
      </div>

      <div class="contact-side">
        <div class="contact-note-card section-card">
          <p class="contact-note-card__kicker">What To Send</p>
          <h3>建议补充的信息</h3>
          <ul class="contact-note-list">
            <li>起运地和目的地</li>
            <li>货物类型和是否带电</li>
            <li>件数、重量、体积</li>
            <li>预计出货时间和时效要求</li>
          </ul>
        </div>

        <div class="contact-note-card section-card">
          <p class="contact-note-card__kicker">Limits</p>
          <h3>提交限制</h3>
          <p class="contact-note-card__text">前端有冷却限制，服务端也有 IP 限流，避免匿名接口被刷。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { RouterLink } from 'vue-router';

import { createPortalClue } from '@/api/portal';

const LOCAL_RATE_LIMIT_KEY = 'portal_clue_submit_records_v1';
const LOCAL_MIN_INTERVAL_MS = 60 * 1000;
const LOCAL_MAX_SUBMITS_PER_DAY = 3;

const contactForm = reactive({
  name: '',
  mobile: '',
  email: '',
  wechat: '',
  remark: '',
});

const submittingContact = ref(false);
const wechatId = import.meta.env.VITE_WECHAT_ID || '请在 .env 中配置 VITE_WECHAT_ID';

function safeTrim(value?: string) {
  return value?.trim() || '';
}

function getLocalSubmitRecords() {
  try {
    const raw = localStorage.getItem(LOCAL_RATE_LIMIT_KEY);
    if (!raw) return [] as number[];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Number.isFinite(item));
  } catch {
    return [];
  }
}

function validateLocalSubmitLimit() {
  const now = Date.now();
  const records = getLocalSubmitRecords().filter((item) => now - item < 24 * 60 * 60 * 1000);
  const latest = records[records.length - 1];

  if (latest && now - latest < LOCAL_MIN_INTERVAL_MS) {
    const remainSeconds = Math.ceil((LOCAL_MIN_INTERVAL_MS - (now - latest)) / 1000);
    throw new Error(`提交过于频繁，请 ${remainSeconds} 秒后再试`);
  }

  if (records.length >= LOCAL_MAX_SUBMITS_PER_DAY) {
    throw new Error('今日提交次数已达上限，请明天再试');
  }

  return records;
}

function persistSubmitRecord(records: number[]) {
  const nextRecords = [...records, Date.now()];
  localStorage.setItem(LOCAL_RATE_LIMIT_KEY, JSON.stringify(nextRecords));
}

async function submitContact() {
  const name = safeTrim(contactForm.name);
  const mobile = safeTrim(contactForm.mobile);

  if (!name) {
    message.error('请填写公司或联系人名称');
    return;
  }
  if (!mobile) {
    message.error('请填写手机号');
    return;
  }

  let records: number[] = [];
  try {
    records = validateLocalSubmitLimit();
  } catch (error) {
    message.error(error instanceof Error ? error.message : '提交过于频繁');
    return;
  }

  submittingContact.value = true;
  try {
    await createPortalClue({
      name,
      mobile,
      telephone: mobile,
      email: safeTrim(contactForm.email) || undefined,
      wechat: safeTrim(contactForm.wechat) || undefined,
      remark: safeTrim(contactForm.remark) || undefined,
    });
    persistSubmitRecord(records);
    message.success('咨询已提交，我们会尽快联系你');
    contactForm.name = '';
    contactForm.mobile = '';
    contactForm.email = '';
    contactForm.wechat = '';
    contactForm.remark = '';
  } catch (error) {
    message.error(error instanceof Error ? error.message : '咨询提交失败');
  } finally {
    submittingContact.value = false;
  }
}
</script>

<style scoped lang="scss">
.contact-page {
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background: linear-gradient(180deg, #fff, #f8fafc);
  box-shadow: 0 20px 50px -42px rgba(15, 23, 42, 0.28);
}

.contact-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.7fr);
  gap: 18px;
  padding: 28px;
}

.contact-hero__kicker,
.card-head__kicker,
.contact-note-card__kicker {
  margin: 0;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.contact-hero__content h1,
.card-head h2,
.contact-note-card h3 {
  margin: 12px 0 0;
  color: #0f172a;
}

.contact-hero__content h1 {
  font-size: 34px;
  line-height: 1.15;
}

.contact-hero__desc {
  margin: 14px 0 0;
  color: #475569;
  line-height: 1.8;
}

.contact-hero__side {
  display: flex;
  align-items: stretch;
}

.contact-meta-card,
.contact-note-card {
  width: 100%;
  padding: 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.96);
  color: #fff;
}

.contact-meta-card__label {
  margin: 0;
  opacity: 0.72;
  font-size: 12px;
}

.contact-meta-card__value {
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: 800;
}

.contact-meta-card__hint {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
}

.contact-body {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 18px;
}

.contact-form-card,
.contact-note-card.section-card {
  padding: 24px;
}

.contact-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card-head {
  margin-bottom: 16px;
}

.contact-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.contact-note-card.section-card {
  background: linear-gradient(180deg, #fff, #f8fafc);
  color: inherit;
}

.contact-note-card__text {
  margin: 12px 0 0;
  color: #475569;
  line-height: 1.8;
}

.contact-note-list {
  margin: 14px 0 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.9;
}

@media (max-width: 992px) {
  .contact-hero,
  .contact-body {
    grid-template-columns: 1fr;
  }
}
</style>
