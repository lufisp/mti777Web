/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var divMenuMng_table_html;
var divMenuDet_table_html;
var selectedItemMenu;
var selectedCategoryId;
var selectedNameCategory;
$(document).ready(
        function () {
            divMenuMng_table_html = $("#divMenuMng_table").html();
            divMenuDet_table_html = $("#divMenuDet_table").html();

            $('#btnAddMenuItem').click(function () {
                addMenuItem();
            });

            $('#btnAddMenuItemDet').click(function () {
                addMenuItemDet();
            });

            //botão na janela modal
            $('#itemMenuUpdateBtn').click(function () {
                itemMenuUpdate();
            });

            $('#closeModal').click(function () {
                $('#openModal').css('opacity', 0);
                $('#openModal').css('pointer-events', 'none');
            });

        }
);

function selectedCategory(idCategory, nameCategory) {
    selectedCategoryId = idCategory;
    selectedNameCategory = nameCategory
    $("#mti777_MenuDet_label").empty().append(nameCategory);

    jQuery.ajax({
        type: 'GET',
        url: host + '/itemMenu/itemCategory/' + idCategory,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr onclick=menuClick(" + JSON.stringify(data[tableIndex]) + ")>"
                html = html + " <td>"
                html = html + data[tableIndex].iditemMenu;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].name;
                html = html + " </td>"
                html = html + " <td>"
                html += "<span onclick=itemMenuRemove(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-remove'></span>";
                html += "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                html += "<span onclick=itemMenuEdit(" + JSON.stringify(data[tableIndex]) + ") class='glyphicon glyphicon-pencil'></span>";
                html = html + " </td>"
                html = html + "</tr>"
            }
            //reset the table
            $("#divMenuMng_table").html(divMenuMng_table_html);
            //add just the html constructed above
            $("#divMenuMng_table").append(html);
        }
    });

}

function menuClick(itemMenu) {

    selectedItemMenu = itemMenu;
    $("#mti777_itemMenuDet_label").empty().append(itemMenu.name);
    jQuery.ajax({
        type: 'GET',
        url: host + '/itemMenuDet/lastUpdated/' + itemMenu.iditemMenu,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            var html = "";
            for (var tableIndex in data) {
                html = html + "<tr>"
                html = html + " <td>"
                html = html + data[tableIndex].iditemMenuDet;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].version;
                html = html + " </td>"
                html = html + " <td>"
                html = html + data[tableIndex].prix;
                html = html + " </td>"
                html = html + "</tr>"
            }
            //reset the table
            $("#divMenuDet_table").html(divMenuDet_table_html);
            //add just the html constructed above
            $("#divMenuDet_table").append(html);

        }
    });
}

function addMenuItemDet() {
    version = $("#menuItemDet_version").val();
    prix = $("#menuItemDet_prix").val();

    var json = {
        version: version,
        prix: prix,
        itemMenu: {
            iditemMenu: selectedItemMenu.iditemMenu
        }
    };

    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: host + '/itemMenuDet/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            menuClick(selectedItemMenu);
        }
    });
}

function addMenuItem() {
    name = $("#menuItemName").val();


    var json = {
        name: name,
        itemCategory: {
            iditemCategory: selectedCategoryId
        }
    };

    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: host + '/itemMenu/',
        dataType: 'json',
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            selectedCategory(selectedCategoryId, selectedNameCategory);
        }
    });
}

function itemMenuRemove(itemMenu) {
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'delete',
        url: host + '/itemMenu/' + itemMenu.iditemMenu,
        success: function (data, textStatus, jqXHR) {
            selectedCategory(selectedCategoryId, selectedNameCategory);
        }
    });
}

function itemMenuEdit(itemMenu) {
    //console.log(order.idOrder);    
    $('#openModal').css('opacity', 1);
    $('#openModal').css('pointer-events', 'all');
    $('#itemMenuEdit_name').val(itemMenu.name);
    selectedItemMenu = itemMenu;
}

function itemMenuUpdate() {
    $('#openModal').css('opacity', 0);
    $('#openModal').css('pointer-events', 'none');
    var itemMenuName = $('#itemMenuEdit_name').val();
    
    var json = {
        iditemMenu: selectedItemMenu.iditemMenu,
        name: itemMenuName,
        itemCategory: {
            iditemCategory: selectedCategoryId
        }
    };
    
    
    //console.log(json);
    jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'put',
        url: host + '/itemMenu/' + selectedItemMenu.iditemMenu,
        data: JSON.stringify(json),
        success: function (data, textStatus, jqXHR) {
            selectedCategory(selectedCategoryId, selectedNameCategory);
        }
    });

}
