CREATE TABLE FumeHood (
  FumeHoodID int primary key,
  FumeHoodOwner int, --FK: FumeHoodCustomers.ID
  LabDesignation varchar(100),
  LabNumber varchar(100),
  Manufacturer int, --FK: FumeHoodVendors.ID
  SerialNumber varchar(30),
  Width int,
  Depth int,
  Height int
)
