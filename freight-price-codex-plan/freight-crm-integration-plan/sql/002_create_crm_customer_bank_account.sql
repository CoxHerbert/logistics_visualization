-- 二期：客户银行账户表

CREATE TABLE IF NOT EXISTS crm_customer_bank_account (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '编号',
  customer_id BIGINT NOT NULL COMMENT '客户ID',
  account_name VARCHAR(128) NOT NULL COMMENT '户名',
  bank_name VARCHAR(128) NOT NULL COMMENT '开户行',
  bank_account_no VARCHAR(128) NOT NULL COMMENT '银行账号',
  swift_code VARCHAR(64) DEFAULT NULL COMMENT 'SWIFT代码',
  currency VARCHAR(16) DEFAULT NULL COMMENT '币种',
  is_default BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否默认账户',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  creator VARCHAR(64) DEFAULT '' COMMENT '创建者',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updater VARCHAR(64) DEFAULT '' COMMENT '更新者',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户编号',
  deleted BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (id),
  KEY idx_crm_customer_bank_account_customer_id (customer_id),
  KEY idx_crm_customer_bank_account_tenant_id (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CRM客户银行账户';
