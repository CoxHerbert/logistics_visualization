-- 001_create_freight_price.sql
-- 运价维护表（多租户 tenant_id 必须存在，默认 1 兜底）

CREATE TABLE IF NOT EXISTS `freight_price` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,

  `tenant_id` BIGINT NOT NULL DEFAULT 1 COMMENT '租户编号',

  `transport_type` INT NOT NULL COMMENT '运输类型：1海派 2海卡 3整柜 4美森',
  `origin` VARCHAR(50) NOT NULL COMMENT '起运港/起运地（上海/宁波/深圳等）',
  `destination` VARCHAR(50) NOT NULL COMMENT '目的港/目的地（LAX/ONT8/纽约等）',

  `price_mode` INT NOT NULL COMMENT '计价模式：1按CBM 2按KG 3整柜一口价',
  `unit_price` DECIMAL(10,2) NOT NULL COMMENT '单价（对应price_mode）',
  `min_price` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '最低收费（可为0）',
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD' COMMENT '币种',

  `valid_from` DATE NOT NULL COMMENT '生效日期',
  `valid_to` DATE NOT NULL COMMENT '失效日期',

  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0启用 1停用',
  `remark` VARCHAR(255) NULL COMMENT '备注',

  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creator` VARCHAR(64) NULL,
  `updater` VARCHAR(64) NULL,
  `deleted` BIT NOT NULL DEFAULT b'0',

  PRIMARY KEY (`id`),
  KEY `idx_tenant_route_type` (`tenant_id`, `transport_type`, `origin`, `destination`, `status`, `valid_from`, `valid_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='运价维护表';
