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

var next = getNextSemester();
var nextYear = next[0];
var nextSemester = next[1];


//get data from database
var all_transcript = null;
var available_courses_enroll = null;
var if_can_not_select_reasons = {};
var can_select = {};
var course_passed = {};
var enrolled_course_info = {};
module.exports.start = function (menu, callback) {
    module.exports.login(menu, callback);
}


module.exports.login = function (menu, callback) {
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
            console.log("\n===================TRANSCRIPT====================\n");
            showWelcome();
            console.table(all_transcript);
            module.exports.transcript(menu, callback);
            
        })
    .addItem(
        'Enroll',
        function() {
            console.log("\n===================Enroll====================\n");
            showWelcome();
            showAvailableCourses();
            module.exports.enroll(menu, callback);
        })
    .addItem(
        'Withdraw',
        function() {
            showCourseEnrolledWithdraw(menu, callback);
        })
    .addItem(
        'Personal Details',
        function() {
            goToersonalDetailsMenu(menu, callback);
        })
    .addItem(
        'Logout',
        function() {
            module.exports.login(menu, callback);
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
        'Enroll ',
        function(course_number, course_year, course_semester) {
           enroll_course(course_number, course_semester, course_year, menu, callback);
        },
        null,
        [{'name': 'course_number', 'type': 'string'},
         {'name': 'course_year', 'type': 'string'},
         {'name': 'course_semester', 'type': 'string'}])
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

module.exports.withdraw = function(menu, callback) {
    menu.resetMenu();
    var message = "";
    menu.addDelimiter('-', 40, 'Options')
    .addItem(
        'Withdraw ',
        function(course_number, course_year, course_semester) {
            withdraw_course(course_number, course_semester, course_year, menu, callback);
        },
        null,
        [{'name': 'course_number', 'type': 'string'},
         {'name': 'course_year', 'type': 'string'},
         {'name': 'course_semester', 'type': 'string'}])
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
            getInitialData();
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
function getInitialData() {
    enrolled_course_info = {};
    getTranscripts(function(result) {
        all_transcript = result;
        for (var i = 0; i < all_transcript.length; i++) {
            var item = all_transcript[i];
            enrolled_course_info[item.UoSCode+item.Year+item.Semester] = {
                'enrollment' : item.Enrollment,
                'max_enrollment' : item.MaxEnrollment
            };
        }
        //console.log(all_transcript);
        //console.log(enrolled_course_info);
        getAvailableCourses(function(result) {
            available_courses_enroll = result;
        });
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
    showWelcome();
    console.log("Personal Information:");
    console.table(personal_info);
    module.exports.personal_info(menu, callback);
}

function showCourseEnrolledWithdraw(menu, callback) {
    console.log("\n===================Withdraw====================\n")
    showWelcome();
    console.log("Currently Enrolled Courses:");
    modules.curtCourses(Id, year, semester, function(result) {
        if (result.length > 0) {       
            console.table(result);
            console.log("\nNext Semster Enrolled Courses: ");
            modules.curtCourses(Id, nextYear, nextSemester, function(result) {
                if (result.length > 0) {
                    console.table(result);
                } else {
                    console.log("No Course Enrolled");
                }
                module.exports.withdraw(menu, callback);
            });
        } else {
            console.log("No Course Enrolled");
        }
    });
}

function goToStudentMenu(menu, callback) {
    console.log("\n===================STUDENT MENU====================\n")
    showWelcome();
    console.log("Currently Enrolled Courses:");
    modules.curtCourses(Id, year, semester, function(result) {
        if (result.length > 0) {       
            console.table(result);
            console.log("\nNext Semster Enrolled Courses: ");
            modules.curtCourses(Id, nextYear, nextSemester, function(result) {
                if (result.length > 0) {
                    console.table(result);
                } else {
                    console.log("No Course Enrolled");
                }
                module.exports.studentMenu(menu, callback);
            });
        } else {
            console.log("No Course Enrolled");
        }
        
    });
}

function showWelcome() {
    console.log("Welcome " + Name + ", it's "+year+" semster "+semester+"!\n");
}

function getTranscripts(callback) {
    modules.transcript(Id,function(result) {
        if (result.length > 0) {
            callback(result);
        }
    });
}

function getAvailableCourses(callback) {
    //console.log(nextYear, nextSemester);
    modules.getAvailableCourses(Id, year, semester, nextYear, nextSemester, function(result) {
        callback(result);
    });
}

/*
var all_transcript = null;
var available_courses_enroll = null;
var if_can_not_select_reasons = {};
var course_passed = {};
var course_info = {};
*/
function showAvailableCourses() {
    if (available_courses_enroll == null) {
        console.log("No available courses to enroll!");
    } else {
        //console.log(available_courses_enroll);
        var courses_enroll_to_show = [];
        course_passed = {};
        for (var i = 0; i < all_transcript.length; i++) {
            var course = all_transcript[i];
            if (course.Grade == 'D' || course.Grade == 'CR' || course.Grade == 'P') {
                course_passed[course.UoSCode] = true;
            } else {
                course_passed[course.UoSCode] = false;
            }
        }
        if_can_not_select_reasons = {};
        for (var i = 0; i < available_courses_enroll.length; i++) {
            var item = JSON.parse(JSON.stringify(available_courses_enroll[i]));
            var course_id = item.UoSCode;
            
            if (!if_can_not_select_reasons[course_id]) {
                if_can_not_select_reasons[course_id] = [];
            }
            if (course_id in course_passed) {
                if_can_not_select_reasons[course_id].push("You already finished this course!");
            }
            if (!course_passed[item.PrereqUoSCode]) {
                if_can_not_select_reasons[course_id].push("Please finish pre-requisite(course "+ item.PrereqUoSCode +") first!");
            } 
            if (item.Enrollment >= item.MaxEnrollment) {
                if_can_not_select_reasons[course_id].push("Exceed Maximum Enrollment!");
            }
            delete item.PrereqUoSCode;
            delete item.Credits;
            courses_enroll_to_show.push(item)
        }
        console.table(courses_enroll_to_show);
        // console.log(if_can_not_select_reasons);
        // console.table(available_courses_enroll);
    }
}

/*
Q1 = Fall, let’s assume Sep – Nov
Q2 = Winter, let’s assume Dec – Feb
Q3 = Spring, let’s assume Mar – May
Q4 = Summer, let’s assume June – August
*/
function getNextSemester() {
    if (semester == "Q1") {
        return [year + 1, "Q2"];
    } else if (semester == "Q2") {
        return [year, "Q3"];
    } else if (semester == "Q3") {
        return [year, "Q4"];
    }
}

function enroll_course(course_id, course_semester, course_year, menu, callback) {
    if (!(course_id in if_can_not_select_reasons)) {
        console.log("No available course "+ course_id +"!");
    } else {
        if (if_can_not_select_reasons[course_id] != 0) {
            for (var i = 0; i < if_can_not_select_reasons[course_id].length; i++) {
                console.log(if_can_not_select_reasons[course_id][i]);
            }
        } else {
            modules.enroll(Id, course_id, course_semester, course_year, function(result){
                console.log("Enroll "+course_id+" success!");
            })
        }
    }
    getInitialData();
    module.exports.enroll(menu, callback);
}


function withdraw_course(course_number, course_semester , course_year, menu, callback) {
    modules.withdraw(Id, course_number,course_semester, course_year, function(result) {
        //console.log(enrolled_course_info,course_number+course_year+course_semester);
        var info = enrolled_course_info[course_number+course_year+course_semester];
        //console.log("info:",info);
        if (info.enrollment * 2 < info.max_enrollment) {
            console.log("Alert: Enrollment of Course "+course_number+" is Less than 50%!");
        }
        showCourseEnrolledWithdraw(menu, callback);
    });
}