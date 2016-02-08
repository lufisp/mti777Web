/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function orderClick(order) {
    id = order.idOrder;
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
                html = html + "<span class='glyphicon glyphicon-plus-sign'></span>&nbsp";
                html = html + "<span class='glyphicon glyphicon-minus-sign'></span>&nbsp";
                html = html + "<span class='glyphicon glyphicon-remove'></span>";
                html = html + " </td>"
                html = html + "</tr>"

            }
            //recover the html salved in the document load.
            $("#divItemsOrder").html(divItemsOrder_html);
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
        }
    });
    console.log(id);
}

function chargeListProducts() {
    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/itemMenuDet/lastUpdated/',
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
            url: 'http://localhost:8080/orderItems/' + order.idOrder + '/' + idItemMenuDet,
            dataType: 'json',
            data: "{}",
            success: function (data, textStatus, jqXHR) {
                orderClick(order);
            }
        });

    }

    console.log("Id do detalhe do item: " + idItemMenuDet);

}

