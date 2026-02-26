-- 兼容旧版本 freight_lead_activity 表结构（缺少租户与扩展字段）
-- 执行前请先备份数据库

ALTER TABLE `freight_lead_activity`
  ADD COLUMN `next_contact_time` datetime DEFAULT NULL COMMENT '下次联系时间' AFTER `content`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN `creator_type` tinyint NOT NULL DEFAULT '1' COMMENT '创建来源：1-管理端 2-APP端' AFTER `next_contact_time`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN `updater` varchar(64) DEFAULT '' COMMENT '更新者' AFTER `create_time`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间' AFTER `updater`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN `tenant_id` bigint NOT NULL DEFAULT '0' COMMENT '租户编号' AFTER `deleted`;

-- 旧表如存在 type 字段，可按需要迁移到 creator_type（可选）
UPDATE `freight_lead_activity`
SET `creator_type` = CASE
    WHEN `type` IN ('app', 'APP', '2') THEN 2
    ELSE 1
END
WHERE `creator_type` IS NULL OR `creator_type` NOT IN (1, 2);
