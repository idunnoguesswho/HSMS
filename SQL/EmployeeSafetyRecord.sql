CREATE TABLE EmployeeSafetyRecord (
  EmployeeID int, --FK: Employee.EmployeeID
  SafetyRecordTypeID int, --FK: SafetyRecordType.SafetyRecordTypeID
  StartDate datetime2,
  EndDate datetime2,
  isActive bit,
  Attachment file
)
  
