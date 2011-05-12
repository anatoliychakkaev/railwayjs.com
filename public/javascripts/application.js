$(function () {
    var $target, $table;
    $('table.sortable td.draggable').live('mousedown', function () {
        $target = $(this).parent();
        $table = $target.parents('table');
        $target.addClass('drag-me');

        var $sibl = $target.siblings();
        $sibl.mouseover(move);

        $target.bind('mouseup', function () {
            $target.removeClass('drag-me');
            $target.unbind('mouseup');
            $sibl.unbind('mouseover');

            var data = [];
            $target.parent().find('tr').each(function () {
                data.push($(this).attr('data-path'));
            });
            $.post('/pages/reorder', {order: data});
        });
        return false;
    });

    function move () {
        if (this.offsetTop < $target[0].offsetTop) {
            $target.insertBefore(this);
        } else {
            $target.insertAfter(this);
        }
    }
});
