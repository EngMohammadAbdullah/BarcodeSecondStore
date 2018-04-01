function openDatabase() {

    return new Promise(function (resolve, reject) {
        Dbfile.openDb('Kleren.db',
            function (db) {
                centerDatabase = db;
                resolve(db);
            });
    })
}

function createTable(tableName, columnNames) {
    return new Promise(function (resolve, reject) {
        try {

            var tableQuery = "CREATE TABLE " + tableName.trim()
                + columnNames;
            //swal(tableQuery);
            Dbfile.createTable(centerDatabase, tableQuery, function (status) {
                if (status) {
                    swal("created", "success");
                    resolve();
                }
                else {
                    swal('error', '', 'error')
                    reject();
                }
            });


        } catch (e) {
            navigator.notification.alert(e.message)
        }
    })
}


function tableExists(tableName) {
    return new Promise(function (resolve, reject) {

        Dbfile.tableExists(centerDatabase, tableName, function (exist) {
            if (!exist) {

                resolve(false);

            }
            else
                resolve(true);
        })
    });
}


function StartTest() {
    openDatabase().then(function () {
        CreateProductTable();
    })
}

//Drop Table
function DropTable(tableName) {
    return new Promise(function (resolve, reject) {
        try {
            //swal(tableQuery);
            Dbfile.dropTable(centerDatabase, tableName, function (status) {
                if (status) {
                    swal("deleted", "success");
                    resolve();
                }
                else {
                    swal('error', '', 'error')
                    reject();
                }
            });


        } catch (e) {
            reject(e.message)
        }
    })
}
//Create Product
function CreateProductTable() {
    var tableName = "Products";
    tableExists(tableName).then(function (exist) {
        if (!exist) {
            createTable(tableName, "(ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, productType text , productNumber text , containerID text  , productDate DATETIME DEFAULT CURRENT_DATE , GroupCoulmn DEFAULT 1 )");
        }
        else
            swal("exist")
    })
}

//Create container
function createContainerTable() {
    var tableName = "Container";

    tableExists(tableName).then(function (exist) {
        if (!exist) {
            createTable(tableName, "(ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,  productDate DATETIME DEFAULT CURRENT_DATE )");
        }
    })
}

//Create Company
function createContainerTable() {
    var tableName = "Company";

    tableExists(tableName).then(function (exist) {
        if (!exist) {
            createTable(tableName,
                "(comanyName text,Address text,owner text , Gsm text  )");
        }
    })
}

//Add New Product
function AddProduct(product) {
    return new Promise(function (resolve, reject) {
        var tableName = "Products"
        var sqlstr = 'INSERT INTO ' + tableName + ' (productType,productNumber,containerID) VALUES("' + product.productType + '","' + product.productNumber + '","' +
            product.containerID + '")';
        Dbfile.insertRecord(centerDatabase, sqlstr
            , function (status) {
                if (status) {
                    swal("تم إضافة زبون ")
                    resolve()
                }
                else
                    reject();
            })
    })
}

//Get Product 

function GetProducts() {

    return new Promise(function (resolve, reject) {
        var tableName = "Products"
        Dbfile.getData(centerDatabase, "select * from " + tableName, function (result) {
            if (result) {
                resolve(result)
                //swal(result[0]["productNumber"] + result[0]["type"])
            }
            else {
                swal("result error", "", "error");
                reject();
            }
        })
    })
}

//Create Products List
function createProductsList(products) {
    $('#CustomersList').empty();
    for (var i = 0; i < products.length; i++) {
        $('#CustomersList').append('<li ID="' + products[i]["ID"]
            + '" data-filtertext="' +
            products[i]["productType"] + ':' + products[i]["productNumber"]
            + '"> <a href="#"> <img src="images/ccr.png" class="ui-li-thumb"> <h2>' + products[i]["productType"] +
            '</h2> <p class="topic">' + products[i]["productNumber"] + '</p> <p class="ui-li-aside">iOS</p> </a> </li>');
    }

    $('[data-role=listview]').listview().listview('refresh');

}


// Group Products
function GetGroupedProducts() {
    return new Promise(function (resolve, reject) {
        var tableName = "Products";
        var sqlstr = 'select  productType , productNumber ,sum(GroupCoulmn) As typeNumber from ' + tableName + ' group by productType';
        Dbfile.getData(centerDatabase, sqlstr, function (result) {
            if (result) {
                resolve(result)
            }
            else {
                swal("result error", "", "error");
                reject();
            }
        })
    })
}

//Create Grouped Products List
function createGroupedProductsList(products) {
    $('#CustomersList').empty();
    for (var i = 0; i < products.length; i++) {
        $('#CustomersList').append('<li ID="' + products[i]["ID"]
            + '" data-filtertext="' +
            products[i]["productType"] + ':' + products[i]["productNumber"]
            + '"> <a href="#"> <img src="images/ccr.png" class="ui-li-thumb"> <h1>'
            + products[i]["productType"] +
            '</h1> <p class="ui-li-aside">' + products[i]["typeNumber"] + '</p> </a> </li>');
    }

    $('[data-role=listview]').listview().listview('refresh');

}

//Details View List 
function ViewDetailsProducts() {
    GetGroupedProducts().then(function (gProducts) {
        createGroupedProductsList(gProducts);
        $("#clistNumber").append('<span>' + gProducts.length + '</span >')
    })
}

function ViewGroupedProducts() {
    GetProducts()
        .then(function (product) {
            createProductsList(product);
            $("#clistNumber").append('<span>' + product.length + '</span >')
        })
}