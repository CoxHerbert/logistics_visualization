ALTER TABLE freight_order
  ADD COLUMN delivery_type VARCHAR(32) NULL COMMENT '交付类型' AFTER shipping_mark,
  ADD COLUMN delivery_warehouse_code VARCHAR(64) NULL COMMENT 'FBA仓库代码' AFTER delivery_type,
  ADD COLUMN delivery_warehouse_name VARCHAR(255) NULL COMMENT 'FBA仓库名称' AFTER delivery_warehouse_code,
  ADD COLUMN amazon_shipment_id VARCHAR(64) NULL COMMENT 'Amazon Shipment ID' AFTER delivery_warehouse_name,
  ADD COLUMN amazon_reference_no VARCHAR(64) NULL COMMENT 'Amazon Reference' AFTER amazon_shipment_id;
