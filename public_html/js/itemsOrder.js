/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function orderClick(order) {
    chargePayment(order);
    id = order.idOrder;
    $("#divItemsOrder").css('visibility', 'visible');
    $("#pgto").css('visibility', 'visible');
    jQuery.ajax({
        type: 'GET',
        url: host +'/orderItems/orderClient/' + id,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr>"
                html = html + " <td>"
                html = html + data[tableIndex].idorderItems;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].itemMenuDet.itemMenu.name;
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
                html = html + " <td>"
                html = html + "<span onclick=plusItem(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-plus-sign'></span>&nbsp";
                html = html + "<span onclick=minusItem(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-minus-sign'></span>&nbsp";
                html = html + "<span onclick=removeItem(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-remove'></span>";
                html = html + " </td>"
                html = html + "</tr>"

            }
            //recover the html salved in the document load.
            $("#divItemsOrder").html(divItemsOrder_html);
            $("#orderItemsLabel").append(" " + order.idOrder);
            $("#divItems_table").append(html);
            htmlBtn = "<div class='wrap'>";
            htmlBtn += "<div class='lookup'>";
            htmlBtn += "<label><input id=inputProducts data-value='' type='text' placeholder='enter a product...' /></label>";
            htmlBtn += "<span onclick=addItemMenuDet(" + JSON.stringify(order) + ") class='glyphicon glyphicon-ok'></span>";
            htmlBtn += "<ul class='matches'></ul>";
            htmlBtn += "</div>";
            htmlBtn += "</div>";
            $("#divItemsOrder").append(htmlBtn);

            //check if the product list has not been charged yet
            if (listProducts.length == 0) {
                chargeListProducts();
            } else {
                $('#inputProducts').attr('data-value', "");
                $('#inputProducts').autocomplete(listProducts, render($('.matches')));
            }
            updateTotalOrder(order);
        }
    });
    console.log(id);
}

function updateTotalOrder(order){
    jQuery.ajax({
        type: 'GET',
        url: host + '/orderClient/getTotal/' + order.idOrder,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $("#totalOrder").empty();
            $("#totalOrder").append("Total: ");
            $("#totalOrder").append(data.value);
        }
    });
}

function chargeListProducts() {
    jQuery.ajax({
        type: 'GET',
        url: host + '/itemMenuDet/lastUpdated/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var product;
            for (var tableIndex in data) {
                product = {
                    value: data[tableIndex].iditemMenuDet,
                    label: data[tableIndex].itemMenu.name + " - " + data[tableIndex].version
                };
                listProducts.push(product);
            }
            $('#inputProducts').attr('data-value', "");
            $('#inputProducts').autocomplete(listProducts, render($('.matches')));
        }
    });
}

function addItemMenuDet(order) {
    var input = $('#inputProducts');
    var idItemMenuDet = input.attr('data-value');
    if (idItemMenuDet != "") {
        jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'post',
            url: host + '/orderItems/' + order.idOrder + '/' + idItemMenuDet,
            dataType: 'json',
            data: "{}",
            success: function (data, textStatus, jqXHR) {
                orderClick(order);
                updateTotalMesa(order.tableRoom.idtable);
            }
        });

    }

    console.log("Id do detalhe do item: " + idItemMenuDet);
}

function plusItem(orderItems) {
    orderItems.quantity = orderItems.quantity + 1;
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'put',
        url: host + '/orderItems/',
        data: JSON.stringify(orderItems),
        success: function (data, textStatus, jqXHR) {
            orderClick(orderItems.orderClient);
            updateTotalMesa(orderItems.orderClient.tableRoom.idtable);
        }
    });
}

function minusItem(orderItems) {
    orderItems.quantity = orderItems.quantity - 1;
    if (orderItems.quantity == 0)
        removeItem(orderItems);
    else {
        jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'put',
            url: host + '/orderItems/',
            data: JSON.stringify(orderItems),
            success: function (data, textStatus, jqXHR) {
                orderClick(orderItems.orderClient);
                updateTotalMesa(orderItems.orderClient.tableRoom.idtable);
            }
        });
    }
}

function removeItem(orderItems) {
    orderItems.quantity = orderItems.quantity - 1;
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'delete',
        url: host + '/orderItems/' + orderItems.idorderItems,
        data: JSON.stringify(orderItems),
        success: function (data, textStatus, jqXHR) {
            orderClick(orderItems.orderClient);
            updateTotalMesa(orderItems.orderClient.tableRoom.idtable);
        }
    });
}
