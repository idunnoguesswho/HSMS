CREATE TABLE Project(
	ProjectID as int PRIMARY KEY,
	ProjectName as varchar(100),
	TimeApproverID as int, --FK: Employee.EmployeeID
	StartDate as DateTime2,
	Abbreviation as varchar(5),
	StreetAddress as varchar(100),
	City as varchar(75),
	Province as varchar(2),
	LeadHandID as int, --FK: Employee.EmployeeID
	PMID as int, --FK: Employee.EmployeeID
	ClientContactName as varchar(100),
	ClientContactEmail as varchar(100),
	ClientContactPhone as varchar(100),
	InvoiceEmail as varchar(100),
	AcceptedEstimate as currency,
	ContractNumber as varchar(100),
	LOA	 as Currency,
	ClientProjectNumber as varchar(100),
	SiteOwner as varchar(100),	
	Consultant	as varchar(100),
	EmergencyDispatchNumber as varchar(15),
	RCMPorLocalPoliceNumber as varchar(15),
	RCMPorLocalPoliceAddress as varchar(255),
	LocalMedicalCentreAddress as varchar(255),
	LocationOfWashrooms as varchar(100),
	LocationOfLunchRooms as varchar(100),
	PaperworkStation as varchar(100),
	FirstAidProvisions as varchar(100),
	SiteOfficeLocation as varchar(100),
	LastInspection as DateTime2,
	QBONameas varchar(100)
)