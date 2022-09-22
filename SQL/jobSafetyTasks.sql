CREATE TABLE JobSafetyTasks (
	JobSafetyTaskID int PRIMARY KEY,
	TaskName varchar(100),
	TaskDescription varchar(255),
	HealthHazard varchar(255),
	SafetyHazard varchar(255),
	HazardID int, --FK:Hazards.HazardID; can be many
	ContributingFactor varchar(4), --PEME: People, Equipment, Material, Environment
	Outcomes varchar(255),
	Severity int, 
	Likelyhood int,
	InitialRisk int, --Calc: Likelyhood X InitialRisk
	Substitution varchar(100),
	EngineeringControls varchar(100),
	SystemControls varchar(100),
	AdministrativeControls varchar(100),
	PPEControl varchar(100),
	OtherControls varchar(100),
	ControlledRisk varchar(2),
	OnTheJobTraining bit DEFAULT(1),
	SafetyRecordTypeID int, --FK:SafetyRecordType.SafetyRecordTypeID
	InitialDate DateTime2,
	LastReviewDate DateTime2,
	SubmittedByID int, --FK:Employees.EmployeeID
	ApprovedByID int, --FK:Employees.EmployeeID
	DocumentID int --FK:Document.DocumentID
)
CREATE TABLE RiskSeverity(
	SeverityRank int,
	SeverityDescription varchar(100)
)
INSERT INTO RiskSeverity (SeverityRank,SeverityDescription) 
VALUES (1,'Minor - Make you uncomfortable')
INSERT INTO RiskSeverity (SeverityRank,SeverityDescription) 
VALUES (2,'Serious - Send you to hospital')
INSERT INTO RiskSeverity (SeverityRank,SeverityDescription) 
VALUES (3,'Immediate - Kill you or permanent damage')
INSERT INTO RiskSeverity (SeverityRank,SeverityDescription) 
VALUES (0,'Not Applicable')

CREATE TABLE RiskLikelyhood(
	LikelyhoodRank int,
	LikelyhoodDescription varchar(100)
)
INSERT INTO RiskLikelyhood (LikelyhoodRank,LikelyhoodDescription) 
VALUES (1,'Unlikely or Remote')
INSERT INTO RiskLikelyhood (LikelyhoodRank,LikelyhoodDescription) 
VALUES (2,'Might Happen')
INSERT INTO RiskLikelyhood (LikelyhoodRank,LikelyhoodDescription) 
VALUES (3,'High Likely')
