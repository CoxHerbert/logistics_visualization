-- 二期：客户营业执照 / 资质表

CREATE TABLE IF NOT EXISTS crm_customer_license (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '编号',
  customer_id BIGINT NOT NULL COMMENT '客户ID',
  license_type VARCHAR(64) NOT NULL COMMENT '资质类型',
  license_no VARCHAR(128) DEFAULT NULL COMMENT '证照编号',
  company_name VARCHAR(255) DEFAULT NULL COMMENT '公司名称',
  expire_date DATE DEFAULT NULL COMMENT '到期日期',
  attachment_url VARCHAR(500) DEFAULT NULL COMMENT '附件地址',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  creator VARCHAR(64) DEFAULT '' COMMENT '创建者',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updater VARCHAR(64) DEFAULT '' COMMENT '更新者',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  tenant_id BIGINT NOT NULL DEFAULT 0 COMMENT '租户编号',
  deleted BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  PRIMARY KEY (id),
  KEY idx_crm_customer_license_customer_id (customer_id),
  KEY idx_crm_customer_license_tenant_id (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='CRM客户营业执照与资质';
