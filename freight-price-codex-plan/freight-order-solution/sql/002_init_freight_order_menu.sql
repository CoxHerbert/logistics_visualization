-- 002_init_freight_order_menu.sql
-- 国际货代菜单与权限初始化
-- 适用于后端菜单模式，执行后由 system_menu 统一控制左侧菜单

SET @parent_menu_id = (
  SELECT id
  FROM system_menu
  WHERE path = '/freight' OR name = '国际货代'
  LIMIT 1
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '国际货代', '', 1, 90, 0, '/freight', 'lucide:truck', 'BasicLayout', 'Freight',
  0, b'1', b'0', b'1', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE path = '/freight'
);

SET @parent_menu_id = (
  SELECT id
  FROM system_menu
  WHERE path = '/freight'
  LIMIT 1
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  'FBA 成本计算器', '', 2, 10, @parent_menu_id, '/tools/fba-flex', 'mdi:calculator',
  '/freight/tools/fba-flex/index', 'FbaFlexCost',
  0, b'1', b'1', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND component_name = 'FbaFlexCost'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '线索列表', 'freight:lead:query', 2, 20, @parent_menu_id, 'leads', 'lucide:list',
  '/freight/leads/index', 'FreightLeads',
  0, b'1', b'1', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'leads'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '业务单管理', 'freight:order:query', 2, 30, @parent_menu_id, 'orders', 'lucide:file-text',
  '/freight/orders/index', 'FreightOrders',
  0, b'1', b'1', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'orders'
);

SET @lead_menu_id = (
  SELECT id FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'leads' LIMIT 1
);

SET @order_menu_id = (
  SELECT id FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'orders' LIMIT 1
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '线索详情', 'freight:lead:query', 2, 21, @parent_menu_id, 'leads/:id', '',
  '/freight/lead-detail/index', 'FreightLeadDetail',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'leads/:id'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '报价编辑器', 'freight:quote:create', 2, 22, @parent_menu_id, 'quote-editor', '',
  '/freight/quote-editor/index', 'FreightQuoteEditor',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'quote-editor'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '报价预览', 'freight:quote:query', 2, 23, @parent_menu_id, 'quote-preview/:id', '',
  '/freight/quote-preview/index', 'FreightQuotePreview',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'quote-preview/:id'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '业务单详情', 'freight:order:query', 2, 31, @parent_menu_id, 'orders/:id', '',
  '/freight/order-detail/index', 'FreightOrderDetail',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @parent_menu_id AND path = 'orders/:id'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '业务单新增', 'freight:order:create', 3, 1, @order_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @order_menu_id AND permission = 'freight:order:create'
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '业务单修改', 'freight:order:update', 3, 2, @order_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM system_menu WHERE parent_id = @order_menu_id AND permission = 'freight:order:update'
);

INSERT INTO system_role_menu (role_id, menu_id, creator, create_time, updater, update_time, deleted)
SELECT 1, m.id, 'system', NOW(), 'system', NOW(), b'0'
FROM system_menu m
WHERE m.id IN (@parent_menu_id, @lead_menu_id, @order_menu_id)
  AND NOT EXISTS (
    SELECT 1 FROM system_role_menu rm WHERE rm.role_id = 1 AND rm.menu_id = m.id
  );

INSERT INTO system_role_menu (role_id, menu_id, creator, create_time, updater, update_time, deleted)
SELECT 1, m.id, 'system', NOW(), 'system', NOW(), b'0'
FROM system_menu m
WHERE m.permission IN (
    'freight:lead:query',
    'freight:quote:create',
    'freight:quote:query',
    'freight:order:query',
    'freight:order:create',
    'freight:order:update'
  )
  AND NOT EXISTS (
    SELECT 1 FROM system_role_menu rm WHERE rm.role_id = 1 AND rm.menu_id = m.id
  );
