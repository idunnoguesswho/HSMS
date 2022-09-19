CREATE TABLE employeeRole(
  employeeID int,
  roleName varchar(100),
  projectID int,
  payRate currency,
  StartDate date,
  endDate date,
  SupervisorID int, --FK: Employee.EmployeeID
  LOARate currency,
  ExpensesAllowed bit
)
