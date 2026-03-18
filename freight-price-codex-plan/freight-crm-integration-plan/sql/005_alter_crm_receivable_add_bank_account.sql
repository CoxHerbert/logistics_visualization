ALTER TABLE crm_receivable
  ADD COLUMN bank_account_id BIGINT NULL COMMENT '客户银行账户 ID' AFTER contract_id,
  ADD COLUMN bank_account_name VARCHAR(255) NULL COMMENT '收款户名快照' AFTER bank_account_id,
  ADD COLUMN bank_name VARCHAR(255) NULL COMMENT '开户行快照' AFTER bank_account_name,
  ADD COLUMN bank_account_no VARCHAR(128) NULL COMMENT '银行账号快照' AFTER bank_name;

CREATE INDEX idx_crm_receivable_bank_account_id ON crm_receivable (bank_account_id);
