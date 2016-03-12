/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var shiftId;
var listProducts = [];
var divOrderTable_html;
$(document).ready(function () {
    
    $("#divOrder").css('visibility', 'hidden');
    $("#divItemsOrder").css('visibility', 'hidden');
    $("#pgto").css('visibility', 'hidden');

    //keep the inside table html, to keep the headers and don't lose the style
    divOrder_html = $("#divOrder").html();
    divItemsOrder_html = $("#divItemsOrder").html();
    divItemsTable_html = $("#divItems_table").html();
    divPaymentTable_html = $("#divPgto_table").html();
    
    jQuery.ajax({
        type: 'GET',
        url: host + '/shift/active/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            shiftId = data.idshift;
            loadTableRoom();
            
        }
    });
    
    

});

function loadTableRoom() {

    jQuery.ajax({
        type: 'GET',
        url: host + '/table/',
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

