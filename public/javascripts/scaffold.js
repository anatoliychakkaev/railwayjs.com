function flash () {
    var xcoord = $('body').innerWidth()/2 - $('.flash').innerWidth()/2;
    $(".flash:first")
    .css({
        'left' : xcoord + 'px',
        'display' : 'block',
        'opacity' : 0.1
    })
    .append('<p class="close">[x]</p>')
    .animate({
        top: 40,
        opacity: 0.4,
    }, "fast", 'swing')
    .animate({
        top: 35,
        opacity: 1
    }, 'fast')
    .find('.close').click(function () {
        $(this).parents('.flash').fadeOut('fast', function () {
            $(this).remove();
            flash();
        });
    });
}
$(flash);
