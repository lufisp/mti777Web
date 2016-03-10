/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var promiseTypePayment = new Promise(function (resolve, reject) {
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/paymentType/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            resolve(data);
        }
    });
});

$(document).ready(function () {
    promiseTypePayment.then(function (dataReturned) {
        //console.log(dataReturned);
        $.each(dataReturned, function (i, item) {
            $("#selectPaymentType").append($('<option>',
                    {
                        value: item.idpaymentType,
                        text: item.name
                    }
            ));
        });
    });

});

function chargePayment(orderClient) {
    //console.log("Order Id ->: " + orderClient.idOrder);
    var paymentTotal = 0;
    $("#btnAddPgto").unbind('click');
    $("#btnAddPgto").click(function () {
        addPgto(orderClient);
    });
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/payment/orderClient/' + orderClient.idOrder,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html += "<tr>";
                html += " <td>";
                html += data[tableIndex].idpayment;
                html += " </td>";
                html += " <td>";
                html += data[tableIndex].paymentType.name;
                html += " </td>";
                html += " <td>";
                html += data[tableIndex].orderClient.idOrder;
                html += " </td>";
                html += " <td>";
                paymentTotal += data[tableIndex].total;
                html += data[tableIndex].total;
                html += " </td>";
                html += " <td>";
                html += "<span onclick=paymentRemove(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-remove'></span>";
                html += " </td>";
                html += " </tr>";
            }
            $("#divPgto_table").html(divPaymentTable_html);
            $("#divPgto_table").append(html);
            $("#totalPayment").empty().append("Total: " + paymentTotal);

        }
    });

}

function addPgto(orderClient) {
    idOrderClient =  orderClient.idOrder;
    idPaymentType = $('#selectPaymentType').val();
    paymentAmount = $('#paymentAmount').val();
    
    var json = {
        paymentType: {
            idpaymentType: idPaymentType
        },
        orderClient: {
            idOrder: idOrderClient
        },
        total: paymentAmount,
    };
    
    console.log(json);
    
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: 'http://localhost:8080/payment/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            chargePayment(orderClient);
        }
    });
    
}

function paymentRemove(payment) {
    //console.log(order.idOrder);    
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'delete',
        url: 'http://localhost:8080/payment/' + payment.idpayment,
        success: function (data, textStatus, jqXHR) {
            chargePayment(payment.orderClient);
        }
    });
}


