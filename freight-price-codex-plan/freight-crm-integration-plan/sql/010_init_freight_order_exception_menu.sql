-- 010_init_freight_order_exception_menu.sql
-- 业务单异常记录按钮权限初始化

SET @freight_root_menu_id = (
  SELECT id
  FROM system_menu
  WHERE path = '/freight'
  LIMIT 1
);

SET @order_menu_id = (
  SELECT id
  FROM system_menu
  WHERE parent_id = @freight_root_menu_id
    AND path = 'orders'
  LIMIT 1
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '异常记录查询', 'freight:order:exception:query', 3, 11, @order_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @order_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM system_menu
    WHERE parent_id = @order_menu_id
      AND permission = 'freight:order:exception:query'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '异常记录新增', 'freight:order:exception:create', 3, 12, @order_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @order_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM system_menu
    WHERE parent_id = @order_menu_id
      AND permission = 'freight:order:exception:create'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '异常记录修改', 'freight:order:exception:update', 3, 13, @order_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @order_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM system_menu
    WHERE parent_id = @order_menu_id
      AND permission = 'freight:order:exception:update'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '异常记录删除', 'freight:order:exception:delete', 3, 14, @order_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @order_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM system_menu
    WHERE parent_id = @order_menu_id
      AND permission = 'freight:order:exception:delete'
  );

INSERT INTO system_role_menu (role_id, menu_id, creator, create_time, updater, update_time, deleted)
SELECT 1, m.id, 'system', NOW(), 'system', NOW(), b'0'
FROM system_menu m
WHERE m.permission IN (
    'freight:order:exception:query',
    'freight:order:exception:create',
    'freight:order:exception:update',
    'freight:order:exception:delete'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM system_role_menu rm
    WHERE rm.role_id = 1
      AND rm.menu_id = m.id
  );
