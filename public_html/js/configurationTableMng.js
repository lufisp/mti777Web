/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tableSelected = "";

$(document).ready(function () {
    $('#closeModal').click(function () {
        $('#openModal').css('opacity', 0);
        $('#openModal').css('pointer-events', 'none');
    });

    $('#tableUpdateBtn').click(function () {
        tableUpdate();
    });
    
    $("#btnAddTable").click(function () {
        addTable();
    });
    

    divTableMng_table_html = $("#divTableMng_table").html();
    for (var i = 1; i < 13; i++) {
        $("#tableSize").append($('<option>',
                {
                    value: i,
                    text: i
                }
        ));
        $("#tableSizeEdit").append($('<option>',
                {
                    value: i,
                    text: i
                }
        ));
    }
    chargeTables();
});

function chargeTables() {
   
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/table/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html += "<tr>";
                html += " <td>";
                html += data[tableIndex].idtable;
                html += " </td>";
                html += " <td>";
                html += data[tableIndex].name;
                html += " </td>";
                html += " <td>";
                html += data[tableIndex].places;
                html += " </td>";
                html += " <td>";
                html += "<span onclick=tableRemove(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-remove'></span>";
                html += "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                html += "<span onclick=tableEdit(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-pencil'></span>";
                html += " </td>";
                html += " </tr>";
            }
            $("#divTableMng_table").html(divTableMng_table_html);
            $("#divTableMng_table").append(html);

        }
    });

}

function addTable() {

    tableSize = $("#tableSize").val();
    tableName = $('#tableName').val();

    var json = {
        name: tableName,
        places: tableSize,
        availableFlag: true
    };

    //console.log(json);

    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: 'http://localhost:8080/table/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            chargeTables();
        }
    });

}

function tableRemove(table) {
    //console.log(order.idOrder);    
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'delete',
        url: 'http://localhost:8080/table/' + table.idtable,
        success: function (data, textStatus, jqXHR) {
            chargeTables();
        }
    });
}

function tableEdit(table) {
    //console.log(order.idOrder);    
    $('#openModal').css('opacity', 1);
    $('#openModal').css('pointer-events', 'all');
    $('#tableNameEdit').val(table.name);
    $('#tableSizeEdit').val(table.places);
    tableSelected = table;
}

function tableUpdate() {
    $('#openModal').css('opacity', 0);
    $('#openModal').css('pointer-events', 'none');
    var tableNameEdit = $('#tableNameEdit').val();
    var tableSizeEdit = $('#tableSizeEdit').val();
    var json = {
        idtable: tableSelected.idtable,
        name: tableNameEdit,
        places: tableSizeEdit,
        availableFlag: tableSelected.availableFlag
    };
    console.log(json);
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'put',
        url: 'http://localhost:8080/table/' + tableSelected.idtable,
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            chargeTables();
        }
    });
    
}


