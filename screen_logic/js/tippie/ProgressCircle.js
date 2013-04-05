;(function ($) {
    /**
     * class Tippie.ProgressCircle
     **/
    Tippie.ProgressCircle = function (config) {
        config = (config = config || {});
        this.Element = $(config.element);
        this.Element.html('<div class="percent"></div><div id="slice"><div class="pie"></div></div>');
        this.Max = $(config.max);
    };

    Tippie.ProgressCircle.prototype = {

        Render: function (percent) {

            if(percent >= 50)
            {
                this.Element.find('#slice').append('<div class="pie fill"></div>');
                this.Element.find('#slice').addClass('gt50');
            }
            else
            {
                this.Element.find('.fill').remove();
                this.Element.find('#slice').removeClass('gt50');
            }

            this.Element.css('font-size', '50px');
            this.Element.find('#slice .pie').css({
                '-webkit-transform':'rotate('+ 360 / 100 * percent +'deg)'
            });

            $('.percent').html(Math.round(percent)+'%');
        }
    };
})(jQuery);