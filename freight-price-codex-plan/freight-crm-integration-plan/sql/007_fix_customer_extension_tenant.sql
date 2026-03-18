-- 修复：客户银行账户、客户资质表补 tenant_id

ALTER TABLE crm_customer_bank_account
  ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户编号' AFTER update_time;

ALTER TABLE crm_customer_bank_account
  ADD KEY idx_crm_customer_bank_account_tenant_id (tenant_id);

ALTER TABLE crm_customer_license
  ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户编号' AFTER update_time;

ALTER TABLE crm_customer_license
  ADD KEY idx_crm_customer_license_tenant_id (tenant_id);
