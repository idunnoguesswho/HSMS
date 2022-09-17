CREATE TABLE Document (
	DocumentID int primary key,
	DocumentNumber varchar(100),
	DocumentRevision varchar(10),
	DocumentTitle varchar(255),
	DocumentSource varchar(255),
	IsActive bit Default(1),
	ProjectID int, --FK: Project.ProjectID
	IncomingSubmittalID int --FK: Submittal.SubmittalID
);