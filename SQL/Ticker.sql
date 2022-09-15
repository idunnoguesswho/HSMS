CREATE TABLE Ticker(
  TickerID as int PRIMARY KEY,
  EmployeeID as int, --Foreign Key Employee.EmployeeID
  PP as varchar(10), 
  --Attachment File,
  Quantity as number(5,2),
  PartValue as currency,
  CategoryID as int, --Foreign Key Category.CategoryID
  NetValue as currency
)