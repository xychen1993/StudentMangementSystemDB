var menu = require('node-menu');
var modules = require('./modules.js');
var startMenus = require('./startMenus.js');

startMenus.start(menu, function(menu, msg) {
    menu.start(); 
})


// while (true) {
//     startMenus.login(menu, function(menu, msg) {
//         menu.start();
//         if (msg == "Login Success!") {
//             startMenus.studentMenu(menu, function(menu, msg) {
//                 if (msg == "Logout") {
//                     continue;
//                 }
//             });
//         }
//     })
// }


// menu.addDelimiter('-', 40, 'Student Management System')
// .addItem(
//     'Sign in with ',
//     function(username, pwd) {
//         var msg = modules.login(username, pwd, function(msg, userId, add) {
//             if (msg == "Login Success!") {
//                 Name = username;
//                 Id = userId;
//                 Password = pwd;
//                 Address = add;
//             }
//             console.log(msg); 
//             console.log(Name);
//             startMenus.studentMenu();
//         });
//     },
//     null,
//     [{'name': 'username', 'type': 'string'}, {'name': 'password', 'type': 'string'}])
// .addDelimiter('*', 40)
// .customHeader(function() { 
//     process.stdout.write("     WELCOME WILDCAT!    \n\n"); 
// }) 
// .disableDefaultHeader() 
// .start();


// menu.addDelimiter('-', 40, 'Main Menu')
//    .addItem(
//        'No parameters',
//        function() {
//            console.log('No parameters is invoked');
//        })
//    .addItem(
//        "Print Field A",
//        testObject.printFieldA,
//        testObject)
//    .addItem(
//        'Print Field B concatenated with arg1',
//        testObject.printFieldB,
//        testObject,
//        [{'name': 'arg1', 'type': 'string'}])
//    .addItem(
//        'Sum',
//        function(op1, op2) {
//            var sum = op1 + op2;
//            console.log('Sum ' + op1 + '+' + op2 + '=' + sum);
//        },
//        null,
//        [{'name': 'op1', 'type': 'numeric'}, {'name': 'op2', 'type': 'numeric'}])
//    .addItem(
//        'String and Bool parameters',
//        function(str, b) {
//            console.log("String is: " + str);
//            console.log("Bool is: " + b);
//        },
//        null,
//        [{'name': 'str', 'type': 'string'}, {'name': 'bool', 'type': 'bool'}])
//    .addDelimiter('*', 40)
//    .customHeader(function() { 
//        process.stdout.write("  Student Management System v1.0\n"); 
//    }) 
//    .disableDefaultHeader() 
//    .customPrompt(function() { 
//        process.stdout.write("\nEnter your selection:\n"); 
//    }) 
//    .disableDefaultPrompt() 
//    .start();