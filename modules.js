var db = require('./db.js');
var app = require('./app.js');


module.exports.login = function(username, pwd, callback) {
    db.login(username, pwd, function(result) {
        var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        if (json.length == 1) {
            callback("Login Success!", json);
        } else {
            callback("Wrong Username or Password!");
        }
    });
};

module.exports.curtCourses = function(Id, year, semester, callback) {
    db.curtCourses(Id, year, semester, function(result) {
        var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        callback(json);
    });
};

module.exports.transcript = function(Id, callback) {
    db.transcript(Id, function(result) {
        var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        callback(json);
    });
};

module.exports.courseInfo = function(course_number, id, callback) {
    db.courseInfo(course_number, id, function(result) {
        var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        callback(json);
    });
};

module.exports.changePwd = function(id, old_pwd, new_pwd, callback) {
    db.changePwd(id, old_pwd, new_pwd, function(result) {
        //var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        //console.log("enter modules");
        callback(result);
    });
};

module.exports.changeAdd = function(Id, new_address, callback) {
    db.changeAdd(Id, new_address, function(result) {
        //var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        //console.log("enter modules");
        callback(result);
    });
};

module.exports.getAvailableCourses = function(id, year, semester, nextYear, nextSemester, callback) {
    db.getAvailableCourses(id, year, semester, nextYear, nextSemester, function(result) {
        var json = JSON.parse(JSON.stringify(result));
        //console.log(json.length);
        //console.log("enter modules");
        callback(json[0]);
    });
};