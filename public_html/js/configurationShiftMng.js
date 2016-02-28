/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var divShiftMng_table;
$(document).ready(function () {
    divShiftMng_table_html = $("#divShiftMng_table").html();
    
   $("#btnAddShift").click(function () {
        addShift();
    });
    
    chargeShift();
});

function chargeShift() {
    
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/shift/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html += "<tr>";
                html += " <td>";
                html += data[tableIndex].idshift;
                html += " </td>";
                html += " <td>";
                html += data[tableIndex].name;
                html += " </td>";                
                html += " <td>";
                html += data[tableIndex].active;
                html += " </td>";                
                html += " <td>";
                html += "<a onclick=activateShift(" + JSON.stringify(data[tableIndex]) + ")>Activate</a>";
                html += " </td>";                
                html += " </tr>";
            }
            $("#divShiftMng_table").html(divShiftMng_table_html);
            $("#divShiftMng_table").append(html);

        }
    });

}

function addShift() {

    shiftName = $('#shiftName').val();

    var json = {
        name: shiftName,
        places: tableSize
    };

    //console.log(json);

    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: 'http://localhost:8080/shift/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            chargeShift();
        }
    });

}


function shiftEdit(table) {
    //console.log(order.idOrder);    
    $('#openModal').css('opacity', 1);
    $('#openModal').css('pointer-events', 'all');
    $('#tableNameEdit').val(table.name);
    $('#tableSizeEdit').val(table.places);
    tableSelected = table;
}


function activateShift(shift){
    //console.log(shift);
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'put',
        url: 'http://localhost:8080/shift/activate/' + shift.idshift,
        data: JSON.stringify(shift),
        success: function (data, textStatus, jqXHR) {
            chargeShift();
        }
    });
    
}


