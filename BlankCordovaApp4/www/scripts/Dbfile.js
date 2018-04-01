var Dbfile = {
    DataBase: {},

    openDb: function (name, callback) {

        var db = window.sqlitePlugin.openDatabase({ name: name, androidDatabaseImplementation: 2, location: 'default' },
            function (db) {
                Dbfile.DataBase = db;
                callback(db);

            }, function (error) {
                //navigator.notification.alert('Open database ERROR: ' + JSON.stringify(error));
                swal(
                    'ss',
                    JSON.stringify(error),
                    'error'
                )
            });
    },
    createTable: function (db, query, callBack) {
        db.transaction(function (tx) {

            tx.executeSql(query);

        }, function (error) {
            swal(
                'Oops...',
                error.message,
                'error'
            )
        }, function () {
            callBack(true);
        });
    },
    RunQuery: function (db, query, callBack) {
        db.transaction(function (tx) {

            tx.executeSql(query);

        }, function (error) {
            swal(
                'Oops...',
                error.message,
                'error'
            )
        }, function () {
            callBack(true);
        });
    },
    checkValueExists: function (db, query, callback) {
        db.transaction(function (tx) {
            var res = [];
            tx.executeSql(query, [], function (tx, resultSet) {
                for (var x = 0; x < resultSet.rows.length; x++) {
                    //  navigator.notification.alert('personNo');
                    res.push(resultSet.rows.item(x));
                    //    ", Acct: " + resultSet.rows.item(x).acctNo);
                    //  navigator.notification.alert(resultSet.rows.item(x).personNo);

                }
                callback(res);

            },
                function (tx, error) {
                    swal(
                        'Oops...',
                        'SELECT error: ' + error.message,
                        'error'
                    )
                });

        }, function (error) {
            swal(
                'Oops...',
                'transaction error: ' + error.message,
                'error'
            )
        }, function () {
            //navigator.notification.beep(1);
        });
    },
    dropCreateTable: function (db, tableName, query, callBack) {
        this.DataBase.transaction(function (tx) {

            query =
                "DROP TABLE IF EXISTS  " + tableName + ";CREATE TABLE " + tableName
                + "  (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Name text)";
            tx.executeSql(query);

        }, function (error) {
            callBack(false);
            navigator.notification.alert('err' + error.message);
        }, function () {
            callBack(true);
            // navigator.notification.alert('good' + tableName);

        });
    },
    insertRecord: function (db, query, callBack) {
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {
                // callBack(true);
            },
                function (tx, error) {

                    swal(
                        'Oops...',
                        'INSERT error: ' + error.message,
                        'error'
                    )
                });
        }, function (error) {
            swal(
                'Oops...',
                'INSERT error: ' + error.message,
                'error'
            )
        }, function () {
            callBack(true);
            // navigator.notification.alert('transaction ok');
        });
    },
    getData: function (db, query, callback) {
        db.transaction(function (tx) {
            var res = [];
            tx.executeSql(query, [], function (tx, resultSet) {
                for (var x = 0; x < resultSet.rows.length; x++) {
                    //  navigator.notification.alert('personNo');
                    res.push(resultSet.rows.item(x));
                    //    ", Acct: " + resultSet.rows.item(x).acctNo);
                    //  navigator.notification.alert(resultSet.rows.item(x).personNo);

                }
                callback(res);

            },
                function (tx, error) {
                    swal(
                        'Oops...',
                        error.message,
                        'error'
                    )
                });

        }, function (error) {
            swal(
                'Oops...',
                error.message,
                'error'
            )
        }, function () {
            //navigator.notification.beep(1);
        });

    },
    acctNum: function (acctNum) {
        db.transaction(function (tx) {

            var query = "DELETE FROM customerAccounts WHERE acctNo = ?";

            tx.executeSql(query, [acctNum], function (tx, res) {
                navigator.notification.alert("removeId: " + res.insertId);
                navigator.notification.alert("rowsAffected: " + res.rowsAffected);
            },
                function (tx, error) {

                    swal(
                        'Oops...',
                        'DELETE error: ' + error.message,
                        'error'
                    )
                });
        }, function (error) {
            swal(
                'Oops...',
                error.message,
                'error'
            )
        }, function () {
            //navigator.notification.alert('transaction ok');
            swal({
                title: 'Success',
                text: 'transaction ok',
                timer: 500,
                onOpen: () => {
                    swal.showLoading()
                }
            }).then((result) => {
                if (result.dismiss === 'timer') {
                    console.log('I was closed by the timer')
                }
            })
        });
    },
    updateItem: function (first, id) {
        // UPDATE Cars SET Name='Skoda Octavia' WHERE Id=3;
        db.transaction(function (tx) {

            var query = "UPDATE customerAccounts SET firstname = ? WHERE acctNo = ?";

            tx.executeSql(query, [first, id], function (tx, res) {
                //navigator.notification.alert("insertId: " + res.insertId);
                //navigator.notification.alert("rowsAffected: " + res.rowsAffected);
                swal({
                    title: 'Success',
                    text: 'تم التعديل',
                    timer: 500,
                    onOpen: () => {
                        swal.showLoading()
                    }
                }).then((result) => {
                    if (result.dismiss === 'timer') {
                        console.log('I was closed by the timer')
                    }
                })
            },
                function (tx, error) {
                    //navigator.notification.alert('UPDATE error: ' + error.message);
                    swal(
                        'Oops...',
                        'Update error: ' + error.message,
                        'error'
                    )
                });
        }, function (error) {
            //navigator.notification.alert('transaction error: ' + error.message);
            swal(
                'Oops...',
                error.message,
                'error'
            )
        }, function () {
            //navigator.notification.alert('transaction ok');
            swal({
                title: 'Success',
                text: 'تم التعديل',
                timer: 500,
                onOpen: () => {
                    swal.showLoading()
                }
            }).then((result) => {
                if (result.dismiss === 'timer') {
                    console.log('I was closed by the timer')
                }
            })
        });
    },
    removeItem: function (db, productNumber, callBack) {

        db.transaction(function (tx) {

            var query = "DELETE FROM BagsProduct WHERE productNumber=\'" +
                productNumber.trim() + "\'";

            tx.executeSql(query, [], function (tx, res) {
                callBack('ok');
            },
                function (tx, error) {
                    //navigator.notification.alert('DELETE error: ' + error.message);
                    swal(
                        'Oops...',
                        'DELETE error: ' + error.message,
                        'error'
                    )
                });
        }, function (error) {
            swal(
                'Oops...',
                'transaction error: ' + error.message,
                'error'
            )

        }, function () {

        });

    },

    DeleteItemFrom: function (db, tableName, columnName, columnValue, callBack) {
        db.transaction(function (tx) {

            var query = "DELETE FROM " + tableName.trim() + " WHERE " +
                columnName + "=" +
                columnValue.trim();
            navigator.notification.alert(query);

            tx.executeSql(query, [], function (tx, res) {
                callBack(true);
            },
                function (tx, error) {
                    //navigator.notification.alert('DELETE error: ' + error.message);
                    callBack(false);
                    swal(
                        'Oops...',
                        'DELETE error: ' + error.message,
                        'error'
                    )
                });
        }, function (error) {
            callBack(false);

            swal(
                'Oops...',
                'transaction error: ' + error.message,
                'error'
            )

        }, function () {
            callBack(true);

        });
    },
    tableExists: function (db, tableName, callBack) {
        db.transaction(function (tx) {
            var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='" +
                tableName.trim() + "'";
            tx.executeSql(query, [], function (tx, resultSet) {
                if (resultSet.rows.length) {
                    callBack(true);

                }
                else
                    callBack(false);

            })
        });
    },
    dropTable: function (db, tableName, callBack) {
        this.DataBase.transaction(function (tx) {

            query =
                "DROP TABLE IF EXISTS  " + tableName;
            tx.executeSql(query);

        }, function (error) {
            callBack(false);
            navigator.notification.alert('err' + error.message);
        }, function () {
            callBack(true);
            // navigator.notification.alert('good' + tableName);

        });
    },
    closeDB: function () {
        db.close(function () {
            swal(
                'Database Closed!',
                '',
                'success'
            )

        }, function (error) {

            swal(
                'error.message',
                '',
                'error'
            )
        });

    }
    //,

    //createPromisTable: function (db, query) {
    //    var promise = new Promise(function (resolve, reject) {
    //        db.transaction(function (tx) {
    //            tx.executeSql(query);
    //        }, reject, resolve);
    //    });
    //    return promise;
    //},
    //dropTablePromis: function (db, query) {
    //    var promise = new Promise(function (resolve, reject) {
    //        db.transaction(function (tx) {
    //            tx.executeSql(query);
    //        }, function (error) {
    //            reject(error);
    //            //navigator.notification.alert('err' + error.message);
    //        }, function () {
    //            resolve(true);
    //        });
    //    });
    //    return promise;
    //}

};
module.exports = Dbfile;