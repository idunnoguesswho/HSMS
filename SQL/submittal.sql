CREATE TABLE Submittal(
	SubmittalID int PRIMARY KEY,
	SubmittalNumber varchar(20),
	RevisionNumber varchar(2),
	ProjectID int, --FK: PRoject.ProjectID
	ReviewedByID int, --FK: Employee.EmployeeID
	ApprovedByID int, --FK: Employee.EmployeeID
	SubmittalSubject varhcar(100),
	ReleaseDate DateTime2,
	ReturnedDate DateTime2,
	ClosedDate DateTime2,
	SubmittalTypeID int --FK:SubmittalType.SubmittalTypeID
)