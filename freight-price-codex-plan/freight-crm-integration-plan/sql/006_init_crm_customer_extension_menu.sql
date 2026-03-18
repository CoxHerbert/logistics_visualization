-- 006_init_crm_customer_extension_menu.sql
-- CRM 客户扩展、隐藏详情路由、按钮权限初始化

SET @crm_root_menu_id = (
  SELECT id
  FROM system_menu
  WHERE path = '/crm'
     OR component_name = 'CrmCenter'
  LIMIT 1
);

SET @customer_menu_id = (
  SELECT id
  FROM system_menu
  WHERE parent_id = @crm_root_menu_id
    AND path = 'customer'
  LIMIT 1
);

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '客户详情', 'crm:customer:query', 2, 91, @crm_root_menu_id, 'customer/detail/:id', '',
  '/crm/customer/detail/index', 'CrmCustomerDetail',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @crm_root_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @crm_root_menu_id
      AND path = 'customer/detail/:id'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '合同详情', 'crm:contract:query', 2, 92, @crm_root_menu_id, 'contract/detail/:id', '',
  '/crm/contract/detail/index', 'CrmContractDetail',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @crm_root_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @crm_root_menu_id
      AND path = 'contract/detail/:id'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '回款计划详情', 'crm:receivable-plan:query', 2, 93, @crm_root_menu_id, 'receivable-plan/detail/:id', '',
  '/crm/receivable/plan/detail/index', 'CrmReceivablePlanDetail',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @crm_root_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @crm_root_menu_id
      AND path = 'receivable-plan/detail/:id'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '回款详情', 'crm:receivable:query', 2, 94, @crm_root_menu_id, 'receivable/detail/:id', '',
  '/crm/receivable/detail/index', 'CrmReceivableDetail',
  0, b'0', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @crm_root_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @crm_root_menu_id
      AND path = 'receivable/detail/:id'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '银行账户查询', 'crm:customer-bank-account:query', 3, 31, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-bank-account:query'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '银行账户新增', 'crm:customer-bank-account:create', 3, 32, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-bank-account:create'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '银行账户修改', 'crm:customer-bank-account:update', 3, 33, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-bank-account:update'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '银行账户删除', 'crm:customer-bank-account:delete', 3, 34, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-bank-account:delete'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '资质查询', 'crm:customer-license:query', 3, 41, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-license:query'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '资质新增', 'crm:customer-license:create', 3, 42, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-license:create'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '资质修改', 'crm:customer-license:update', 3, 43, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-license:update'
  );

INSERT INTO system_menu (
  name, permission, type, sort, parent_id, path, icon, component, component_name,
  status, visible, keep_alive, always_show, creator, create_time, updater, update_time, deleted
)
SELECT
  '资质删除', 'crm:customer-license:delete', 3, 44, @customer_menu_id, '', '', '', '',
  0, b'1', b'0', b'0', 'system', NOW(), 'system', NOW(), b'0'
FROM DUAL
WHERE @customer_menu_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM system_menu
    WHERE parent_id = @customer_menu_id
      AND permission = 'crm:customer-license:delete'
  );

INSERT INTO system_role_menu (role_id, menu_id, creator, create_time, updater, update_time, deleted)
SELECT 1, m.id, 'system', NOW(), 'system', NOW(), b'0'
FROM system_menu m
WHERE m.permission IN (
    'crm:customer:query',
    'crm:contract:query',
    'crm:receivable-plan:query',
    'crm:receivable:query',
    'crm:customer-bank-account:query',
    'crm:customer-bank-account:create',
    'crm:customer-bank-account:update',
    'crm:customer-bank-account:delete',
    'crm:customer-license:query',
    'crm:customer-license:create',
    'crm:customer-license:update',
    'crm:customer-license:delete'
  )
  AND NOT EXISTS (
    SELECT 1 FROM system_role_menu rm
    WHERE rm.role_id = 1
      AND rm.menu_id = m.id
  );
