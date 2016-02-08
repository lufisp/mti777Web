/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*Extender as funções do jquery, fn é um atalho ao prototipo
 * ver: http://www.jquery.info/spip.php?article92 para mais detalhes
 * */
(function ($) {
    $.fn.autocomplete = function (products, output) {

        var startsWith = function (letters) {
            return function (product) {
                word = product.label;
                return word.indexOf(letters) !== -1;
            }
        }

        var matches = function (letters) {
            return letters ? $.grep(products, startsWith(letters)) : [];
        }

        this.keyup(function () {
            var letters = $(this).val();
            output(letters, matches(letters),$(this));
        });
    };
})(jQuery);


var render = function ($output) {
    return function (letters, matchesProd, $input) {
        $output.empty()

        if (matchesProd.length) {
            var $highlight = $('<span/>')
                    .text(letters)
                    .addClass('highlight');

            $.each(matchesProd, function (index, match) {
                var ind = match.label.indexOf(letters);
                var before = match.label.substring(0, ind);
                console.log(letters);
                var after = match.label.substring(ind + letters.length, match.label.length);
                $match = $('<li/>')
                        .append(before, $highlight.clone(), after)
                        .addClass('match')
                        .on('click', function () {
                            $input.val(match.label);
                            $output.empty();
                            $($input).attr('data-value', match.value);                            
                        });

                $output.append($match);
            });
        }
    }
}

