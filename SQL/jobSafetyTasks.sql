CREATE TABLE JobSafetyTasks (
	JobSafetyTaskID int PRIMARY KEY,
	TaskDescription varchar(255),
	InitialRisk varchar(2),
	AdministrativeControls varchar(100),
	EngineeringControls varchar(100),
	PPEControl varchar(100),
	OtherControls varchar(100),
	ControlledRisk varchar(2),
	SafetyRecordTypeID int, --FK:SafetyRecordType.SafetyRecordTypeID
	InitialDate DateTime2,
	LastReviewDate DAteTime2,
	SubmittedByID int, --FK:Employees.EmployeeID
	ApprovedByID int, --FK:Employees.EmployeeID
	DocumentID int --FK:Document.DocumentID
)