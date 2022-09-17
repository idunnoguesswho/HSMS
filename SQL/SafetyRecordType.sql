CREATE TABLE SafetyRecordType(
	SafetyRecordTypeID int PRIMARY KEY,
	TypeName varchar(100),
	FormFileName varchar(100),
	RequirementDays int DEFAULT(0),
	PolicyVerbage varhcar(max),
	ProcedureVerbage varchar(max),
	InitialDate DateTime2,
	LastReviewDate DAteTime2,
	SubmittedByID int, --FK:Employees.EmployeeID
	ApprovedByID int --FK:Employees.EmployeeID
)