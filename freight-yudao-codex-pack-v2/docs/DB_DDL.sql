-- DB_DDL.sql — Freight Tool Portal (MySQL, InnoDB, utf8mb4)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1) freight_lead
-- =========================
DROP TABLE IF EXISTS freight_lead;
CREATE TABLE freight_lead (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',

  source VARCHAR(32) NOT NULL COMMENT '来源：TOOL_LCL/TOOL_FCL/TOOL_SENSITIVE/WEB_FORM',
  contact_type VARCHAR(16) NOT NULL COMMENT '联系类型：WECHAT/PHONE/EMAIL/WHATSAPP',
  contact_value VARCHAR(128) NOT NULL COMMENT '联系方式内容',

  name VARCHAR(64) NULL COMMENT '姓名',
  company VARCHAR(128) NULL COMMENT '公司',

  origin_port VARCHAR(64) NULL COMMENT '起运港/起运地',
  destination VARCHAR(64) NULL COMMENT '目的港/目的地',

  ship_mode VARCHAR(16) NOT NULL COMMENT '运输方式：SEA_LCL/SEA_FCL/AIR/EXPRESS',
  cargo_type VARCHAR(16) NOT NULL COMMENT '货物类型：GENERAL/BATTERY/MAGNET/LIQUID/POWDER',

  cartons INT NULL COMMENT '箱数',
  weight_kg DECIMAL(10,2) NULL COMMENT '重量(kg)',
  volume_cbm DECIMAL(10,3) NULL COMMENT '体积(cbm)',

  incoterms VARCHAR(8) NULL COMMENT '贸易术语：EXW/FOB/DDP...',
  fba TINYINT NOT NULL DEFAULT 0 COMMENT '是否FBA(0/1)',
  amazon_warehouse_code VARCHAR(32) NULL COMMENT '亚马逊仓库代码',

  expectation VARCHAR(16) NULL COMMENT '期望：FAST/STABLE/CHEAP',
  status VARCHAR(16) NOT NULL DEFAULT 'NEW' COMMENT '状态：NEW/CONTACTED/QUOTED/WON/LOST',
  remark VARCHAR(512) NULL COMMENT '备注',

  creator VARCHAR(64) NULL COMMENT '创建人',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updater VARCHAR(64) NULL COMMENT '更新人',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',

  PRIMARY KEY (id),
  KEY idx_status (status),
  KEY idx_contact (contact_type, contact_value),
  KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='货代线索';

-- =========================
-- 2) freight_lead_activity
-- =========================
DROP TABLE IF EXISTS freight_lead_activity;
CREATE TABLE freight_lead_activity (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  lead_id BIGINT NOT NULL COMMENT '线索ID',

  type VARCHAR(16) NOT NULL COMMENT '类型：CALL/WECHAT/EMAIL/NOTE',
  content VARCHAR(1024) NOT NULL COMMENT '内容',

  creator VARCHAR(64) NULL COMMENT '创建人',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  deleted BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',

  PRIMARY KEY (id),
  KEY idx_lead_id (lead_id),
  CONSTRAINT fk_activity_lead FOREIGN KEY (lead_id) REFERENCES freight_lead(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='货代线索跟进记录';

-- =========================
-- 3) freight_quote
-- =========================
DROP TABLE IF EXISTS freight_quote;
CREATE TABLE freight_quote (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  lead_id BIGINT NOT NULL COMMENT '线索ID',

  currency VARCHAR(8) NOT NULL DEFAULT 'USD' COMMENT '币种：USD/CNY',
  valid_until DATETIME NULL COMMENT '有效期',
  transit_days_min INT NULL COMMENT '时效最小天数',
  transit_days_max INT NULL COMMENT '时效最大天数',

  schedule_note VARCHAR(256) NULL COMMENT '船期/稳定性说明',
  terms VARCHAR(1024) NULL COMMENT '报价条款',

  total DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '总价',
  file_url VARCHAR(256) NULL COMMENT '导出文件URL（可空）',

  creator VARCHAR(64) NULL COMMENT '创建人',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updater VARCHAR(64) NULL COMMENT '更新人',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',

  PRIMARY KEY (id),
  KEY idx_lead_id (lead_id),
  KEY idx_create_time (create_time),
  CONSTRAINT fk_quote_lead FOREIGN KEY (lead_id) REFERENCES freight_lead(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='货代报价';

-- =========================
-- 4) freight_quote_item
-- =========================
DROP TABLE IF EXISTS freight_quote_item;
CREATE TABLE freight_quote_item (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  quote_id BIGINT NOT NULL COMMENT '报价ID',

  name VARCHAR(64) NOT NULL COMMENT '费用项名称',
  unit VARCHAR(16) NOT NULL COMMENT '单位：CBM/CONTAINER/SHIPMENT',
  qty DECIMAL(12,3) NOT NULL DEFAULT 1 COMMENT '数量',
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '单价',
  amount DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '金额',
  note VARCHAR(128) NULL COMMENT '备注',

  sort INT NOT NULL DEFAULT 0 COMMENT '排序',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

  PRIMARY KEY (id),
  KEY idx_quote_id (quote_id),
  CONSTRAINT fk_item_quote FOREIGN KEY (quote_id) REFERENCES freight_quote(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='货代报价费用项';

-- =========================
-- 5) freight_rule_config
-- =========================
DROP TABLE IF EXISTS freight_rule_config;
CREATE TABLE freight_rule_config (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  config_key VARCHAR(64) NOT NULL COMMENT '配置键（唯一）',
  config_value TEXT NOT NULL COMMENT '配置值（json/text）',
  enabled TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用(0/1)',
  remark VARCHAR(256) NULL COMMENT '备注',

  creator VARCHAR(64) NULL COMMENT '创建人',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updater VARCHAR(64) NULL COMMENT '更新人',
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted BIT(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',

  PRIMARY KEY (id),
  UNIQUE KEY uk_config_key (config_key),
  KEY idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='货代工具规则配置';

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- Seed（可选）
-- =========================
-- INSERT INTO freight_rule_config (config_key, config_value, enabled, remark)
-- VALUES
-- ('LCL_BASE_PRICE_PER_CBM_USD', '320', 1, '拼箱海运费参考单价'),
-- ('DOC_FEE_USD', '35', 1, '文件费参考'),
-- ('ORIGIN_LOCAL_CHARGE_USD', '80', 1, '起运港杂参考');
