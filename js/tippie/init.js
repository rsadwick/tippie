; (function ($) {
    console.log('init!');
    var canvas = $('body');
    jQuery(document).ready(function () {
        Tippie.Instance().InitControls();
        Tippie.Instance().UpdateTip(canvas.find('.ui-slider a').attr('aria-valuemin'));

        //ratings:
        canvas.find('.rating li').each(function( index ) {
            $(this).on('click', function(e){
                    Tippie.Instance().UpdateRating($(this).data('percent'));
                    Tippie.Instance().UpdateTip($(this).data('percent'));
                }
            )
        });
    });

    window.Tippie.Instance(new Tippie.Application
    (
        'body'
    ));

})(jQuery);
