; (function ($) {
    /*
     The purpose of the Initializer is to create a new instance of the Tippie.Application
     and give it to the Tippie singleton interface.

     By separating the Application from the initialization it allows us to provide it
     the dependencies it needs without having to be aware of the HTML layer providing
     us far more flexibility to change the markup in the future.
     */

    console.log('init!');
    jQuery(document).ready(function () {
        Tippie.Instance().InitControls();
        Tippie.Instance().UpdateTip(jQuery('body').find('.ui-slider a').attr('aria-valuemin'));
        Tippie.Instance().Events.On(Tippie.Application.EVENT.SLIDER_CHANGED, function (value) {
            Tippie.Instance().UpdateTip(value);
            Tippie.Instance().CalculateTip();
        }, this);



        //ratings:

        jQuery('body').find('.rating li').each(function( index ) {
            $(this).on('click', function(e){
                    Tippie.Instance().UpdateRating($(this).data('percent'));
                    Tippie.Instance().UpdateTip($(this).data('percent'));
                }
            )
        });
    });
  //  $('#slider-val').append($('#slider-1'));
    /*flyouts.push(new Tippie.Flyout({
        cacheable: true,
        closeClass: 'ir',
        flyout: '#arcade .flyout',
        trigger: '#arcade',
        url: '/namedcell?name=Arcade-Flyout',
        noajax: noAjax
    }));*/




    //Handler for article modals
    /*jQuery('body').on('click', ".article-modal", function (e) {
        e.stopPropagation();
        e.preventDefault();

        var articleSlug = jQuery(this).data("articleSlug");
        var articleId = jQuery(this).data("articleId");
        if (isNaN(articleId))
            return; //continue
        if (!articleSlug)
            articleId = 'default-article-slug';
        Tippie.Instance().GetArticleModal().Show('/article/' + articleSlug + '/' + articleId);
    });*/


    window.Tippie.Instance(new Tippie.Application
    (
        'body'
    ));

})(jQuery);
