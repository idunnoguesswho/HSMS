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