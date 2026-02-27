-- 兼容旧版本 freight_lead_activity 表结构（缺少租户与扩展字段）
-- 幂等执行：重复运行不会因重复列报错
-- 执行前请先备份数据库

ALTER TABLE `freight_lead_activity`
  ADD COLUMN IF NOT EXISTS `next_contact_time` datetime DEFAULT NULL COMMENT '下次联系时间' AFTER `content`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN IF NOT EXISTS `creator_type` tinyint NOT NULL DEFAULT '1' COMMENT '创建来源：1-管理端 2-APP端' AFTER `next_contact_time`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN IF NOT EXISTS `updater` varchar(64) DEFAULT '' COMMENT '更新者' AFTER `create_time`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN IF NOT EXISTS `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间' AFTER `updater`;

ALTER TABLE `freight_lead_activity`
  ADD COLUMN IF NOT EXISTS `tenant_id` bigint NOT NULL DEFAULT '1' COMMENT '租户编号' AFTER `deleted`;

-- 旧表如存在 type 字段，可按需要迁移到 creator_type（可选）
SET @has_type_col := (
  SELECT COUNT(1)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'freight_lead_activity'
    AND COLUMN_NAME = 'type'
);

SET @creator_type_migration_sql := IF(
  @has_type_col > 0,
  'UPDATE `freight_lead_activity`
   SET `creator_type` = CASE
       WHEN `type` IN (''app'', ''APP'', ''2'') THEN 2
       ELSE 1
   END
   WHERE `creator_type` IS NULL OR `creator_type` NOT IN (1, 2)',
  'SELECT 1'
);

PREPARE stmt FROM @creator_type_migration_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 旧表如存在 type 字段，补齐默认值，避免插入时报“Field type doesn't have a default value”
SET @type_col_default_sql := IF(
  @has_type_col > 0,
  'ALTER TABLE `freight_lead_activity` MODIFY COLUMN `type` varchar(16) NOT NULL DEFAULT ''admin'' COMMENT ''创建来源（兼容旧字段）''',
  'SELECT 1'
);

PREPARE stmt_type_default FROM @type_col_default_sql;
EXECUTE stmt_type_default;
DEALLOCATE PREPARE stmt_type_default;

-- 统一历史数据租户编号为 1
UPDATE `freight_lead_activity`
SET `tenant_id` = 1
WHERE `tenant_id` IS NULL OR `tenant_id` = 0;
