CREATE TABLE FumeHoodCustomer (
  FumeHoodCustomerID int primary key,
  BusinessName varchar(50),
  ContactName varchar(50),
  AddressLine1 varchar(100),
  AddressLine2 varchar(100),
  PhoneNumber varchar(10),
  Email varchar(50),
  FumeHoodCount decimal (4,0) DEFAULT(0),
  LastVisit DateTime2,
  NextCall DateTime2,
  NextVisit DateTime2,
  Active bit DEFAULT(1),
  SkipAirFlow bit DEFAULT(0),
  BillPerHood bit DEFAULT(0),
  BillPerHour bit DEFAULT(1),
  BillingRate money default(125)
  KMs Decimal (6,2) default(0),
  TravelGroup varchar(50)
)
  
