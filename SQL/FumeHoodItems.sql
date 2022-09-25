CREATE TABLE FumeHoodItems(
  ID int primary key,
  Description varchar(100),
  CostPerItem money,
  PricePerItem money,
  UnitName varchar(4),
  QuantityOnHand int
)

INSERT INTO FumeHoodItems (Description, CostPerItem, PricePerItem, QuantityOnHand, UnitName)
VALUES ('Rollers', 0,10,0,'EA')

INSERT INTO FumeHoodItems (Description, CostPerItem, PricePerItem, QuantityOnHand, UnitName)
VALUES ('Keeprs', 0,1,0,'EA')

INSERT INTO FumeHoodItems (Description, CostPerItem, PricePerItem, QuantityOnHand, UnitName)
VALUES ('Cable', 0,10,0, 'FT')

INSERT INTO FumeHoodItems (Description, CostPerItem, PricePerItem, QuantityOnHand, UnitName)
VALUES ('FH Inspection', 0,100,0, 'EA')

INSERT INTO FumeHoodItems  (Description, CostPerItem, PricePerItem, QuantityOnHand, UnitName)
VALUES ('FH Service Hour', 80,125,0, 'HR')

