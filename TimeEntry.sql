CREATE TABLE TimeEntry(
  TimeEntryID as int PRIMARY KEY,
  EntryTime as DateTime2,
  Project as varchar(100),
  EmployeeID as int, --Foreign Key to Employee.EmployeeID
  Sunday as DateTime2,
  SundayHours as Number(5,2),
  MondayHours as Number(5,2),
  TuesdayHours as Number(5,2),
  WednesdayHours as Number(5,2),
  ThursdayHours as Number(5,2),
  FridayHours as Number(5,2),
  SaturdayHours as Number(5,2),
  TotalHrs	Hours as Number(5,2),
  LOADays as int,
  PP as varchar(10),
  EmailAddress varchar(200)
 )

CREATE TABLE TimePay(
  TimePayID as int PRIMARY KEY,
  TimeEntryID as int, --Foreign Key TimeEntry.TimeEntryID
  EmployeeID as int,  --Foreign Key Employee.EmployeeID
  PP as varchar(10),
  GrossPayTime as currency,
  LOAPay as currency,
  AdvancePay as currency,
  TickerTotal as currency, --Sum(Ticker.NetPay where Ticker.EmployeeID=Employee.EmployeeID & PP = Ticker.PP)
  EmployeeBenefits as currency,
  NetPay as currency
)
  
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
  
