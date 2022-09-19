CREATE TABLE employee(
  EmployeeID int primary key,
  FirstName varchar(100),
  LastName varchar(100),
  Email varchar(150),
  pw varchar(20),
  dob datetime2,
  mailingAddress varchar(255),
  LoginName varchar(20),
  HireDate datetime2,
  TravellingName varchar(255),
  isActive bit Default(1), 
  Gender varchar(1),
  mobileNumber varchar(10),
  SIN varchar(9),
  BusinessNumber varchar(9),
  EmergencyContactName varchar(20),
  EmergencyContactNumber varchar(10),
  EmergencyContactRelationship varchar(10),
  
  --Start Date	Rate	Expenses Allowed	Living out allowance: (Daily)	Project Selection- Which project were you hired for?	I have submitted (by email)		
  --Bank Name	Transit number (5 digits)	Institution number (3 digits)	Account Number (typically more than 5 digits)	
  --Federal TD1 Form 	Provincial TD1 Form	
  PayrollPolicyAcceptance varchar(3),
  DisciplinePolicyAcceptance varchar(3),
  Harassment-FreeWorkplacePolicyAcceptance varchar(3),
  Drug-FreeWorkplaceAcceptance varchar(3),
  HSMSAcceptance varchar(3),
  WorkplaceInjuryReductionAcceptance varchar(3),
  EthicalLegalStandardAcceptance varchar(3),
  GeneralCompanyRulesAcceptance varchar(3),
  PaymentType varchar(15),
  Ethnicity varchar(15),
  VisibleMinority bit,
  Disability bit,
  DrugAndAlcoholAcceptance varchar(3),
  IsSupervisor bit
)
