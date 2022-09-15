CREATE TABLE DailyLog(
	DailyLogID as int PRIMARY KEY,
  Timestamp As DateTime2,
  EmailAddress as varchar(100),
  ProjectID as int, --FK: Project.ProjectID
  ProjectArea as varchar(100),
  MeetingType as varchar(50),
  ReviewTopic as varchar(100),
  WorkerInput as varchar(255),
  ActionItems as varchar(255),
  AreaLead as varchar(255),
  FormTypeID as int --Foreign Key FormType.FormTypeID
 )
