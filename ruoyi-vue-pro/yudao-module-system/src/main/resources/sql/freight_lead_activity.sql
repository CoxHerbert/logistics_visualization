CREATE TABLE IF NOT EXISTS `freight_lead_activity` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `lead_id` bigint NOT NULL COMMENT '线索编号',
  `content` varchar(1024) NOT NULL COMMENT '跟进内容',
  `next_contact_time` datetime DEFAULT NULL COMMENT '下次联系时间',
  `creator_type` tinyint NOT NULL DEFAULT '1' COMMENT '创建来源：1-管理端 2-APP端',
  `creator` varchar(64) DEFAULT '' COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater` varchar(64) DEFAULT '' COMMENT '更新者',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
  `tenant_id` bigint NOT NULL DEFAULT '0' COMMENT '租户编号',
  PRIMARY KEY (`id`),
  KEY `idx_lead_id` (`lead_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='货运线索跟进记录表';
