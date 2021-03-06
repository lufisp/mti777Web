/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function tableRoomClick(tableRoom) {
    id = tableRoom.idtable;
    tableName = tableRoom.name;
    $("#divOrder").html(divOrder_html);
    $("#divOrder").css('visibility', 'visible');    
    $("#divItemsOrder").css('visibility', 'hidden');
    $("#pgto").css('visibility', 'hidden');
    $("#mti777_orderLabelId").html("Orders  - " + tableName);
    
        
    

    jQuery.ajax({
        type: 'GET',
        url: host + '/orderClient/table/' + id + '/shift/' + shiftId,
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
                html += "<span onclick=orderClick(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-list-alt'></span>";
                html += "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                html += "<span onclick=orderClose(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-check'></span>";
                html += "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                html += "<span onclick=orderRemove(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-remove'></span>";
                html += " </td>";
                html += " </tr>";
            }
            //recover the html salved in the document load.
            $("#divOrder_table").html(divOrderTable_html).append(html);
            htmlBtn = "<div>";
            htmlBtn += "<button id='btnAddOrder' type='button' class='btn btn-default' onclick=addOrder(" + JSON.stringify(tableRoom) + ")>";
            htmlBtn += "<span class='glyphicon glyphicon-plus'></span>";
            htmlBtn += "Add";
            htmlBtn += "</button>";            
            htmlBtn += "</div>"
            $("#divOrder").append(htmlBtn);
            updateTotalMesa(id);
        }
    });
}

function updateTotalMesa(mesaId) {
    jQuery.ajax({
        type: 'GET',
        url: host + '/table/getTotal/' + mesaId + '/shiftId/' + shiftId,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $("#totalTable").empty();
            $("#totalTable").append("Total: ");
            $("#totalTable").append(data.value);
        }
    });
}


function addOrder(tableRoom) {
    idTableRoom = tableRoom.idtable;
    tableName = tableRoom.name;
    //console.log(idTableRoom + ", " + tableName);
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
        url: host + '/orderClient/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {            
            tableRoomClick(tableRoom);
        }
    });
}

function orderRemove(order) {
    //console.log(order.idOrder);    
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'delete',
        url: host + '/orderClient/' + order.idOrder,
        success: function (data, textStatus, jqXHR) {         
            tableRoomClick(order.tableRoom);
        }
    });
}

function orderClose(order){
    var json = "{}";
    jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'put',
            url: host + '/orderClient/closeOrder/' + order.idOrder,
            data: JSON.stringify(json),
            success: function (data, textStatus, jqXHR) {
               tableRoomClick(order.tableRoom);           
            }
        });
    
}

