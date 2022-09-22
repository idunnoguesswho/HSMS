CREATE TABLE OnTheJobTraining(
	OTJID int primary key,
	EmployeeID int, --FK: Employee.EmployeeID
	JobSafetyTaskID int, --FK: JobSafetyTasks.JobSafetyTasksID
	CompletedDate DateTime2,
	SupervisorID int --FK: Employee.EmployeeID
)