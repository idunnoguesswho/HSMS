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
  TotalHrs as Number(5,2),
  LOADays as int,
  PP as varchar(10),
  EmailAddress as varchar(200)
 )