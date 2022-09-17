CREATE TABLE CorrectiveAction(
	CorrectiveActionID int primary key,
	CARDescription varchar(100),
	InitialDate DateTime2,
	LastReviewDate DAteTime2,
	SubmittedByID int, --FK:Employees.EmployeeID
	CompletedByID int, --FK:Employees.EmployeeID
	AnticipatedResolution varchar(100),
	ActualResolution varchar(100),
	ManagementAcceptedByID int, --FK:Employees.EmployeeID
	ClosedDate DateTime2,
	ReferenceDocumentID int --FK:Document.DocumentID
)