CREATE TABLE DailyLogEmployee(
	DailyLogEmployeeID as int PRIMARY KEY,
	EmployeeID as int, --FK: Employee.EmployeeID
	DailyLogID as int, --FK: DailyLog.DailyLogID
	StartTime as DateTime2,
	EndTime as DateTime2,
	TimeEntryID as int, --FK: TimeEntryID, can repeat
	EmployeeInput as varchar(255)
)