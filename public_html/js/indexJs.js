/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    loadTableRoom();
    $("#divOrder").hide();
    $("#divItemsOrder").hide();
    $("#pgto").hide();

});

function loadTableRoom() {

    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/table/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr onclick=tableRoomClick(" + data[tableIndex].idtable + ")>"
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

function tableRoomClick(id) {
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/table/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr onclick=tableRoomClick(" + data[tableIndex].idtable + ")>"
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
    console.log(id);
}
