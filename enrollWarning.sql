
drop trigger if exists enrollWarning;
drop table if exists warningTable;
create table warningTable(warning int);
delimiter //
create trigger enrollWarning
before update on uosoffering
for each row
begin
	if new.Enrollment * 2 < old.MaxEnrollment then
		insert into warning
        value (1);
	else
		delete from warning;
	end if;
end;
//
delimiter ;



