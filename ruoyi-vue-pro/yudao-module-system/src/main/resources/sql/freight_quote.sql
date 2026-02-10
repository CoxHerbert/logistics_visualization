CREATE TABLE IF NOT EXISTS `freight_quote` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `lead_id` bigint NOT NULL COMMENT '线索编号',
  `currency` varchar(16) NOT NULL COMMENT '币种',
  `unit_price` decimal(18,2) NOT NULL COMMENT '单价',
  `quantity` decimal(18,2) NOT NULL COMMENT '数量',
  `surcharge` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT '附加费',
  `total` decimal(18,2) NOT NULL COMMENT '总价',
  `remark` varchar(255) DEFAULT '' COMMENT '备注',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT '0' COMMENT '租户编号',
  PRIMARY KEY (`id`),
  KEY `idx_lead_id` (`lead_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='货运报价表';
