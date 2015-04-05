(function() {
    'use strict';
    var module = angular.module('Database', []);


    module.controller('DatabaseController', function($scope) {

        function initDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATA (id unique, data)');
            //tx.executeSql('INSERT INTO APPDATA  (id, data) VALUES ("userData", "{\'userName\':\'naka5@hotmail.com\', \'password\':\'naka5\'}")');

        }

        function errorInitDB(err) {
            console.log("Error processing SQL: " + err.code);
        }

        function successInitDB() {
            console.log("success!");
            db.transaction(getUserData, errorQuery);
        }



        function getUserData(tx) {
            tx.executeSql('SELECT * FROM APPDATA', [], querySuccess, errorQuery);
        }

        function querySuccess(tx, results) {
            var len = results.rows.length;
            console.log("APPDATA table: " + len + " rows found.");
            for (var i = 0; i < len; i++) {
                console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
                console.log(results.rows.item(i).data.userName);
            }
        }

        function errorQuery(err) {
            console.log("Error processing SQL: " + err.code);
        }

        var db = window.openDatabase("NakaBase", "1.0", "PhoneGap Demo", 200000);
        db.transaction(initDB, errorInitDB, successInitDB);
    });

})();
