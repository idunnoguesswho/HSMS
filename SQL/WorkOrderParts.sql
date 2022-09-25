
 CREATE TABLE WorkOrderParts(
  ID int primary key,
  WorkOrderID int, --FK: WorkOrder.ID
  FumeHoodItemID int, --FK:FumeHoodItems.ID
  Quantity decimal(6,2) default(0),
  NetPrice money
)
