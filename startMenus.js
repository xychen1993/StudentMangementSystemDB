var menu = require('node-menu');
var modules = require('./modules.js');
var consoleTable = require('console.table');

var Name = null;
var Id = null;
var Password = null;
var Address = null;

/*
Q1 = Fall, let’s assume Sep – Nov
Q2 = Winter, let’s assume Dec – Feb
Q3 = Spring, let’s assume Mar – May
Q4 = Summer, let’s assume June – August
*/

var year = (new Date()).getFullYear();
var month = (new Date()).getMonth() + 1;
var semester = "";

if (month >= 9 && month <=11) {
    semester = "Q1";
} else if (month >= 12 || month >= 1 && month <= 2) {
    semester = "Q2";
} else if (month >= 3 && month <= 5) {
    semester = "Q3";
} else if (month >= 6 && month <= 8){
    semester = "Q4";
}

module.exports.start = function (menu, callback) {
    menu.resetMenu();
    var message = "";
    menu.addDelimiter('-', 40, 'Please Login')
    .addItem(
        'Login with ',
        function(username, pwd) {
            loginAndGetInfo(username, pwd, "login", callback);
        },
        null,
        [{'name': 'username', 'type': 'string'}, {'name': 'password', 'type': 'string'}])
    .addDelimiter('*', 40)
    .customHeader(function() { 
        process.stdout.write("    Student Management System    \n\n"); 
    }) 
    .disableDefaultHeader();
    callback(menu, message);
}

module.exports.studentMenu = function (menu, callback) {
    menu.resetMenu();
    var message = "";
    menu.addDelimiter('-', 40, 'Options')
    .addItem(
        'Transcript',
        function() {
            console.log("\n===================TRANSCRIPT====================\n")
            console.log("Welcome " + Name + ", it's "+year+" semster "+semester+"!\n");
            modules.transcript(Id,function(result) {
                if (result.length > 0) {
                    console.table(result);
                } else {
                    console.log("No Transcript!");
                }
                module.exports.transcript(menu, callback);
            });
        })
    .addItem(
        'Enroll',
        function() {
            modules.curtCourses(Id, year, semester, function(result) {
                if (result.length > 0) {
                    console.table(result);
                } else {
                    console.log("No Course Enrolled");
                }
            });
        })
    .addItem(
        'Withdraw',
        function() {
            modules.curtCourses(Id, year, semester, function(result) {
                if (result.length > 0) {
                    console.table(result);
                } else {
                    console.log("No Course Enrolled");
                }
            });
        })
    .addItem(
        'Personal Details',
        function() {
            goToersonalDetailsMenu(menu, callback);
        })
    .addItem(
        'Logout',
        function() {
            module.exports.start(menu, callback);
        })
    .addDelimiter('*', 40)
    .customHeader(function() { 
    }) 
    .disableDefaultHeader()
    callback(menu, message);
};


module.exports.transcript = function(menu, callback) {
    menu.resetMenu();
    var message = "";
    menu.addDelimiter('-', 40, 'Options')
    .addItem(
        'Course details ',
        function(course_number) {
           modules.courseInfo(course_number, Id, function(results) {
               if (results.length < 1) {
                   console.log("No Such Course");
               } else {
                   console.table(results);
               }
           });
        },
        null,
        [{'name': 'course_number', 'type': 'string'}])
    .addItem(
        'Back to Student Menu',
        function() {
            goToStudentMenu(menu, callback);})
    .addDelimiter('*', 40)
    .customHeader(function() { 
    }) 
    .disableDefaultHeader();
    callback(menu, message);
}

module.exports.enroll = function(menu, callback) {
    menu.resetMenu();
    var message = "";
    menu.addDelimiter('-', 40, 'Options')
    .addItem(
        'Course details ',
        function(course_number) {
           modules.courseInfo(course_number, Id, function(results) {
               if (results.length < 1) {
                   console.log("No Such Course");
               } else {
                   console.table(results);
               }
           });
        },
        null,
        [{'name': 'course_number', 'type': 'string'}])
    .addItem(
        'Back to Student Menu',
        function() {
            goToStudentMenu(menu, callback);})
    .addDelimiter('*', 40)
    .customHeader(function() { 
    }) 
    .disableDefaultHeader();
    callback(menu, message);
}

module.exports.personal_info = function(menu, callback) {
    menu.resetMenu();
    var message = "";
    //console.log("enter personal_info");
    menu.addDelimiter('-', 40, 'Options')
    .addItem(
        'Change address',
        function(new_address) {
            modules.changeAdd(Id, new_address, function(result) {
                console.log("Address updated!");
                loginAndGetInfo(Name, Password, "update", callback);
            });
        },
        null,
        [{'name': 'new_address', 'type': 'string'}])
    .addItem(
        'Change password',
        function(old_pwd, new_pwd, new_pwd2) {
            //console.log("click Change pwd");
            if (new_pwd != new_pwd2) {
                console.log("New password does not match the confirm password!");
            } else {
                modules.changePwd(Id, old_pwd, new_pwd, function(result) {
                    console.log(result);
                    Password = new_pwd;
                });
            }
        },
        null,
        [{'name': 'old_pwd', 'type': 'string'}, {'name': 'new_pwd', 'type': 'string'}, {'name': 'new_pwd2', 'type': 'string'}])
        .addItem(
        'Back to Student Menu',
        function() {
            goToStudentMenu(menu, callback);})
    .addDelimiter('*', 40)
    .customHeader(function() { 
    }) 
    .disableDefaultHeader();
    callback(menu, message);
}


function loginAndGetInfo(username, pwd, method, callback) {
    modules.login(username, pwd, function(msg, result) {
        if (method == "login") {
            console.log(msg);
        }
        if (msg == "Login Success!") {
            Name = result[0].Name;
            Id = result[0].Id;
            Password = result[0].Password;
            Address = result[0].Address;
            if (method == "login") {
                goToStudentMenu(menu, callback);
            } else if (method == "update") {
                goToersonalDetailsMenu(menu, callback);
            }
        } else {
            Name = null;
            Id = null;
            Password = null;
            Address = null;
        }
    });
}

function goToersonalDetailsMenu(menu, callback) {
    var personal_info = [{
        "student_id": Id,
        "name":Name,
        "address":Address,
        "password": "******"
    }];
    console.log("\n===================PERSONAL DETAILS====================\n");
    console.log("Welcome " + Name + ", it's "+year+" semster "+semester+"!\n");
    console.log("Personal Information:");
    console.table(personal_info);
    module.exports.personal_info(menu, callback);
}

function goToStudentMenu(menu, callback) {
    console.log("\n===================STUDENT MENU====================\n")
    console.log("Welcome " + Name + ", it's "+year+" semster "+semester+"!\n");
    console.log("Currently Enrolled Courses:");
    modules.curtCourses(Id, year, semester, function(result) {
        if (result.length > 0) {
            console.table(result);
        } else {
            console.log("No Course Enrolled");
        }
        module.exports.studentMenu(menu, callback);
    });
}

function showClassesCanEnroll() {
    
}

/*
Q1 = Fall, let’s assume Sep – Nov
Q2 = Winter, let’s assume Dec – Feb
Q3 = Spring, let’s assume Mar – May
Q4 = Summer, let’s assume June – August
*/

function nextSemester() {
    if (semester == "Q1") {
        return [year + 1, "Q2"];
    } else if (semester == "Q2") {
        return [year, "Q3"];
    } else if (semester == "Q3") {
        return [year, "Q4"];
    }
}