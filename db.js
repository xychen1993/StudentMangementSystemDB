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

var views = [];
//view1: student_course
views.push("Drop view if exists student_course;");
views.push("create view student_course as select a.Id as Id, a.Name as Name, b.UoSCode as UoSCode, b.Semester as Semester, b.Year as Year, b.Grade as Grade, c.UoSName as UoSName from student as a, transcript as b, unitofstudy as c where a.Id = b.StudId and c.UoSCode = b.UoSCode;");
//view2: course_info
views.push("drop view if exists course_info;");
views.push("create view course_info as select * from uosoffering, faculty where uosoffering.InstructorId = faculty.Id;");
//views.push("select distinct * from student_course;");
for (var i = 0; i < views.length; i++) {
    var sql = views[i];
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
    var sql = "select UoSCode as course_number, UoSName as course_name, year, semester, grade from student_course where Id = \"" + id + "\" and Grade is NULL and year = \""+ year +"\" and semester = \""+semester+"\";";    
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
    var sql = "select distinct a.UoSCode as course_number, a.UoSName as course_name, a.Year, a.Semester, b.Enrollment, b.maxEnrollment, b.Name as lecturer, a.Grade from student_course as a, course_info as b where a.UoSCode = b.UoSCode and a.year = b.year and a.semester = b.semester and a.Id = \""+ id +"\" and b.UoSCode = \""+ course_number +"\";";    
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
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
};
