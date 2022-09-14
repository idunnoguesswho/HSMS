CREATE TABLE employee(
EmployeeID int primary key,
FirstName as varchar(100),
LastName as varchar(100),
Email as varchar(150),
pw as varchar(20),
dob as date,
mailingAddress varchar(255)
)

CREATE TABLE roles(
roleName as varchar(100),
jobDescription as varchar(255)
)

CREATE TABLE employeeRole(
employeeID int,
roleName varchar(100),
projectID int,
payRate currency,
StartDate date,
endDate date
)

CREATE TABLE RoleRequirement(
roleName varchar(100),
courseName varchar(100)
)