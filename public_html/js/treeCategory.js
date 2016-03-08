/* 
 * 
 * Esse código gera a arvore de categorias de menu.
 * o código doi fortemente inspirado no código apresentado no tutorial abaixo:
 * http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
 * 
 */
var margin = {top: 20, right: 120, bottom: 20, left: 50},
width = 500,
        height = 300;
var i = 0;
var duration = 700;
var tree = d3.layout.tree()
        .size([height, width]);

var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });


var svg;
var root;


$(document).ready(function () {
    svg = d3.select("#divMenuCatMng").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    jQuery.ajax({
        type: 'GET',
        url: 'http://localhost:8080/itemCategory/getTreeJson/',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            root = data[0];
            root.x0 = height / 2;
            root.y0 = 0;

            collapse(root);
            //root.children.forEach(collapse);
            update(root);
        }
    });

});





function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();
    var links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 80;
    });

    // Update the nodes…
    var node = svg.selectAll("g.mti777_node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
            .attr("class", "mti777_node")
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", click);

    nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

    nodeEnter.append("text")
            .attr("x", function (d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

    nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

    nodeUpdate.select("text")
            .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

    nodeExit.select("circle")
            .attr("r", 1e-6);

    nodeExit.select("text")
            .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.mti777_link")
            .data(links, function (d) {
                return d.target.id;
            });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
            .attr("class", "mti777_link")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

    // Transition links to their new position.
    link.transition()
            .duration(duration)
            .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}


function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);

    prepareCrudCategory(d);
    //function declared in the itemMenu.js
    selectedCategory(d.id, d.name);

}

//codigo para a seleção das ações de edição de categorias...
$("[class*=editTreeAction]").css('display', 'none');
$(".editTreeLiRename").click(function () {
    $("[class*=editTreeLi]").removeClass("active");
    $(this).addClass("active");
    $("[class*=editTreeAction]").css('display', 'none');
    $(".editTreeAction_Rename").css('display', 'block');
});
$(".editTreeLiRemove").click(function () {
    $("[class*=editTreeLi]").removeClass("active");
    $(this).addClass("active");
    $("[class*=editTreeAction]").css('display', 'none');
    $(".editTreeAction_Remove").css('display', 'block');
});
$(".editTreeLiAdd").click(function () {
    $("[class*=editTreeLi]").removeClass("active");
    $(this).addClass("active");
    $("[class*=editTreeAction]").css('display', 'none');
    $(".editTreeAction_Add").css('display', 'block');
});




function prepareCrudCategory(d) {
    setup_editCategory(d);
    setup_removeCategory(d);
    setup_addCategory(d);
}

function setup_editCategory(d) {
    $(".editTreeDiv_categorySelectedName").empty().append(d.name);

    $("#btnEditCategory").unbind('click');
    $("#btnEditCategory").click(function () {
        var nameCategory = $("#categoryNameInput").val();
        var json = {
            iditemCategory: d.id,
            name: nameCategory,
            rootCategory: {
                iditemCategory: d.parent.id
            }
        };
        jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'put',
            url: 'http://localhost:8080/itemCategory/' + d.id,
            data: JSON.stringify(json),
            success: function (data, textStatus, jqXHR) {
                d.name = nameCategory;
                update(d.parent);
            }
        });
    });

}

function setup_removeCategory(d) {
    $(".editTreeDiv_categorySelectedName").empty().append(d.name);

    $("#btnRemoveCategory").unbind('click');
    $("#btnRemoveCategory").click(function () {
        var nameCategory = $("#categoryNameInput").val();
        jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'delete',
            url: 'http://localhost:8080/itemCategory/' + d.id,
            success: function (data, textStatus, jqXHR) {
                //selectedCategory(selectedCategoryId, selectedNameCategory);
            }
        });
    });

}

function setup_addCategory(d) {
    $(".editTreeDiv_categorySelectedName").empty().append(d.name);

    $("#btnAddCategory").unbind('click');
    $("#btnAddCategory").click(function () {
        var nameCategory = $("#categoryNameAdd").val();
        var json = {
            name: nameCategory,
            rootCategory: {
                iditemCategory: d.id
            }
        };
        jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            type: 'post',
            url: 'http://localhost:8080/itemCategory/',
            dataType: 'json',
            data: JSON.stringify(json),
            success: function (data, textStatus, jqXHR) {
                //tentar adicionar um nó filho
            }
        });
    });

}



