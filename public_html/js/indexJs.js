/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var shiftId = 2;

var divOrderTable_html;
$(document).ready(function () {
    loadTableRoom();
    $("#divOrder").css('visibility', 'hidden');
    $("#divItemsOrder").css('visibility', 'hidden');
    $("#pgto").css('visibility', 'hidden');

    //keep the inside table html, to keep the headers and don't lose the style
    divOrder_html = $("#divOrder").html();
    divItemsTable_html = $("#divItems_table").html();

});

function loadTableRoom() {

    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/table/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr onclick=tableRoomClick(" + JSON.stringify(data[tableIndex]) + ")>"
                html = html + " <td>"
                html = html + data[tableIndex].idtable;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].name;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].availableFlag;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].places;
                html = html + " </td>"
                html = html + "</tr>"
            }
            $("#divTableRoom_table").append(html);
        }
    });
}

function tableRoomClick(tableRoom) {
    id = tableRoom.idtable;
    tableName = tableRoom.name;
    $("#divOrder").html(divOrder_html);
    $("#divOrder").css('visibility', 'visible');
    $("#divItemsOrder").css('visibility', 'hidden');
    $("#mti777_orderLabelId").html("Orders  - " + tableName);

    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/orderClient/table/' + id,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html += "<tr>";
                html += " <td>";
                html += data[tableIndex].idOrder;
                html += " </td>";
                html += " <td>";
                html += data[tableIndex].openFlag;
                html += " </td>";
                html += " <td>";                
                html += "<span onclick=orderClick(" + data[tableIndex].idOrder + ") class='glyphicon glyphicon-list-alt'></span>";                
                html += "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                html += "<span onclick=orderRemove(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-remove'></span>";                
                html += " </td>";
                html += " </tr>";
            }
            //recover the html salved in the document load.
            $("#divOrder_table").html(divOrderTable_html).append(html);
            htmlBtn = "<div>";
            htmlBtn += "<button type='button' class='btn btn-default' onclick=addOrder(" + JSON.stringify(tableRoom) + ")>";
            htmlBtn += "<span class='glyphicon glyphicon-plus'></span>";
            htmlBtn += "Add";
            htmlBtn += "</button></div>";
            $("#divOrder").append(htmlBtn);
        }
    });
}

function orderClick(id) {
    $("#divItemsOrder").css('visibility', 'visible');
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/orderItems/orderClient/' + id,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr>"
                html = html + " <td>"
                html = html + data[tableIndex].idorderItems;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].itemMenuDet.version;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].itemMenuDet.prix;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].quantity;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].quantity * data[tableIndex].itemMenuDet.prix;
                html = html + " </td>"
                html = html + "</tr>"

            }
            //recover the html salved in the document load.
            $("#divItems_table").html(divItemsTable_html).append(html);
        }
    });
    console.log(id);
}

function addOrder(tableRoom) {
    idTableRoom = tableRoom.idtable;
    tableName = tableRoom.name;
    console.log(idTableRoom + ", " + tableName);
    var json = {
        tableRoom: {
            idtable: idTableRoom
        },
        shift: {
            idshift: shiftId
        },
        openFlag: true,
        creationDate: '1454263234000'
    };
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: 'http://localhost:8080/orderClient/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            var html = "";
            tableRoomClick(tableRoom);
        }
    });
}

function orderRemove(order) {
    console.log(order.idOrder);
    /*var json = {
        tableRoom: {
            idtable: idTableRoom
        },
        shift: {
            idshift: shiftId
        },
        openFlag: true,
        creationDate: '1454263234000'
    };*/
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'delete',
        url: 'http://localhost:8080/orderClient/' + order.idOrder,
        success: function (data, textStatus, jqXHR) {
            var html = "";
            tableRoomClick(order.tableRoom);
        }
    });
}