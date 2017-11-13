var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "project3-nudb"
});

con.connect(function(err) {
    if (err) throw err;
});

var preprocess = [];
//view1: student_course
preprocess.push("Drop view if exists student_course;");
preprocess.push("create view student_course as select a.Id as Id, a.Name as Name, b.UoSCode as UoSCode, b.Semester as Semester, b.Year as Year, b.Grade as Grade, c.UoSName as UoSName, d.Enrollment, d.MaxEnrollment from student as a, transcript as b, unitofstudy as c, uosoffering as d where a.Id = b.StudId and c.UoSCode = b.UoSCode and d.UoSCode = b.UoSCode and d.Year = b.Year and d.Semester = b.Semester;");
//view2: course_info
preprocess.push("drop view if exists course_info;");
preprocess.push("create view course_info as select a.UoSCode, c.UoSName, a.Year, a.Semester, a.Enrollment, a.MaxEnrollment, b.Name as Lecturer, c.Credits, d.PrereqUoSCode from uosoffering as a, faculty as b, unitofstudy as c, requires as d where a.InstructorId = b.Id and a.UoSCode = c.UoSCode and d.UoSCode = a.UoSCode;");
//create procedures for show_available_courses
preprocess.push("drop procedure if exists show_available_courses;");
preprocess.push("create procedure show_available_courses (in studid char(20), in curt_year char(20), in curt_semester char(20),in next_year char(20), in next_semester char(20)) select distinct * from course_info where course_info.UoSCode not in (select UoSCode from transcript where studid = studid) and ((Year = curt_year and Semester = curt_semester) or (Year = next_year and semester = next_semester)) order by year;");
//preprocess.push("create procedure show_available_courses (in studid char(20), in curt_year char(20), in curt_semester char(20),in next_year char(20), in next_semester char(20)) select distinct UoSCode as course_number, UoSName as course_namefrom, Year, Semester, Enrollment, MaxEnrollment, Lecturer from course_info where (Year = curt_year and Semester = curt_semester) or (Year = next_year and semester = next_semester) and UoSCode not in (select UoSCode from student_course where Id = studid) order by year;");
//insert new transcript record
preprocess.push("drop procedure if exists enroll;");
preprocess.push("create procedure enroll(in studid char(20), in course_id char(20), in semester char(20), in year char(20)) insert into transcript values(StudId, course_id, semester, year, null);");
//update enrollment
preprocess.push("drop procedure if exists update_enrollment;");
preprocess.push("create procedure update_enrollment(in course_id char(20), in semester char(20), in year char(20), in amount int) update uosoffering set Enrollment = Enrollment + amount where UoSCode = course_id and Year = year and Semester = semester;");
//withdraw class
preprocess.push("drop procedure if exists withdraw;");
preprocess.push("create procedure withdraw(in stud_id char(20), in course_id char(20), in course_semester char(20), in course_year char(20)) delete from transcript where StudId = stud_id and UoSCode = course_id and Semester = course_semester and Year = course_year;");

for (var i = 0; i < preprocess.length; i++) {
    var sql = preprocess[i];
//    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
    });
}

//need username, pwd 
module.exports.login = function (username, pwd, callback) { 
    var sql = "select * from student where name = \"" + username + "\" and password = \"" + pwd + "\"";
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};
//Need student id, year and semester!
module.exports.curtCourses = function (id, year, semester, callback) { 
    var sql = "select UoSCode as course_number, UoSName as course_name, year, semester, grade from student_course where Id = \"" + id + "\" and year = \""+ year +"\" and semester = \""+semester+"\";";    
    //var sql = "select * from  student_course where Id = \"" + id + "\" and Year = \"" + year + "\" and Semester = \"" + semester + "\" and Grade is  NULL;";
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

//need student id
module.exports.transcript = function (id, callback) { 
    var sql = "select * from  student_course where Id = \"" + id + "\" order by Year DESC";    
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};


//need student id, course id
module.exports.courseInfo = function (course_number, id, callback) { 
    var sql = "select distinct a.UoSCode as course_number, a.UoSName as course_name, a.Year, a.Semester, b.Enrollment, b.maxEnrollment, lecturer, a.Grade from student_course as a, course_info as b where a.UoSCode = b.UoSCode and a.year = b.year and a.semester = b.semester and a.Id = \""+ id +"\" and b.UoSCode = \""+ course_number +"\";";    
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};


//need student id, old pwd, new pwd
module.exports.changePwd = function (id, old_pwd, new_pwd, callback) {
    var sql1 = "Select * from student where Id = \""+id+"\" and password = \""+old_pwd+"\";"
    //console.log("changepwd");
    con.query(sql1, function (err, result, fields) {
        if (err) throw err;
        // console.log(sql1);
        // console.log(result);
        if (result.length != 1) {
            callback("Wrong Password or Username!");
        } else {
            var sql2 = "update student set password = \""+new_pwd+"\" where Id = \""+id+"\" and password = \""+old_pwd+"\";"
            con.query(sql2, function (err, result, fields) {
                if (err) throw err;
                callback("Update password sucessful!");
            });
        }
    }); 
};

//need student id, course id
module.exports.changeAdd = function (Id, new_address, callback) { 
    var sql = "update student set Address = \""+ new_address +"\" where Id = \""+Id+"\";"
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

//need student id, course id
module.exports.getAvailableCourses = function (id, year, semester, nextYear, nextSemester, callback) { 
    var sql = "call show_available_courses(\""+id+"\", \""+year+"\", \""+semester+"\", \""+nextYear+"\", \""+nextSemester+"\");";
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};

module.exports.enroll = function (id, course_number,semester, year, callback) { 
    var sql = "call enroll(\""+id+"\", \""+course_number+"\", \""+semester+"\", \""+year+"\");";
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        var sql2 = "call update_enrollment(\""+course_number+"\", \""+semester+"\", \""+year+"\", 1);";
        con.query(sql2, function (err, result, fields) {
            if (err) throw err;            
            callback(result);
        });
    });
};

module.exports.withdraw = function (id, course_number,semester, year, callback) { 
    var sql = "call withdraw(\""+id+"\", \""+course_number+"\", \""+semester+"\", \""+year+"\");";
    //console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        var sql2 = "call update_enrollment(\""+course_number+"\", \""+semester+"\", \""+year+"\", -1);";
        con.query(sql2, function (err, result, fields) {
            if (err) throw err;            
            callback(result);
        });
    });
};
