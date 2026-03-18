-- 一期：业务单关联 CRM 合同

ALTER TABLE freight_order
  ADD COLUMN contract_id BIGINT NULL COMMENT 'CRM合同ID' AFTER customer_name,
  ADD COLUMN contract_no VARCHAR(64) NULL COMMENT '合同编号快照' AFTER contract_id,
  ADD COLUMN contract_name VARCHAR(255) NULL COMMENT '合同名称快照' AFTER contract_no;

CREATE INDEX idx_freight_order_contract_id ON freight_order (contract_id);

