; (function ($) {
    Tippie.Application = function (canvas) {
        this.Events = new Tippie.EventCoordinator();
        this.Canvas = $(canvas);
        this.progressBar = new Tippie.ProgressCircle({
            element: $(canvas).find('.timer'),
            max: 100
        });
    };
    Tippie.Application.prototype =
    {

        Canvas: null,
        Events: null,

        InitControls: function () {

            var _scope = this;

            this.Canvas.find('#slider-val').append(this.Canvas.find('#slider-1'));
            this.Canvas.find('#slider-1').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, $(this).slider().val());
                _scope.progressBar.Render($(this).slider().val());
            });

            this.Canvas.find('#divide-meal').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            });

            this.Canvas.find('#meal-total').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            });

            this.Canvas.find('#up').on('click', function(e){
                _scope.Events.Trigger(Tippie.Application.EVENT.DIVISION_CHANGED, e);
            });

            this.Canvas.find('#down').on('click', function(e){
                _scope.Events.Trigger(Tippie.Application.EVENT.DIVISION_CHANGED, e);
            });

            Tippie.Instance().Events.On(Tippie.Application.EVENT.SLIDER_CHANGED, function (value) {
                Tippie.Instance().UpdateTip(value);
                Tippie.Instance().CalculateTip();
            }, this);

            //divisions:

            Tippie.Instance().Events.On(Tippie.Application.EVENT.DIVISION_CHANGED, function (e) {
                var divide = this.Canvas.find('#divide-meal');
                switch(e.currentTarget.id){
                    case 'up':
                    {
                        divide.val(Number(divide.val()) + 1);
                        break;
                    }

                    case 'down':
                    {
                        divide.val(divide.val() - 1);
                        break;
                    }
                }
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            }, this);
        },

        UpdateTip: function(value){
            this.Canvas.find('.rating li').each(function( index ) {

                if(value > $(this).prev().data('percent') && value <= $(this).data('percent') || !$(this).prev().data('percent') && value <= $(this).data('percent'))
                {
                    $(this).addClass('active');
                }
                else
                {
                    $(this).removeClass('active');
                }
            });
        },

        UpdateRating: function(value){
            this.Canvas.find('#slider-1').slider().val(value).slider("refresh");
        },

        CalculateTip: function(){
            var bill = this.Canvas.find('#meal-total').val() - 0;
            var tippie = this.Canvas.find('#slider-1').slider().val() - 0;
            var total = Math.round(((tippie / 100) * bill) * 100) / 100;

            this.Canvas.find('#tip-amount').text('$' + parseFloat(total).toFixed(2));
            this.Canvas.find('#bill-total').text('$' + parseFloat(bill + total).toFixed(2));
            this.Canvas.find('#tip-split').text('$' + parseFloat((bill + total) / this.Canvas.find('#divide-meal').val()).toFixed(2));

        }
    };

    Tippie.Application.EVENT =
    {
        SLIDER_CHANGED: 'slider:changed',
        RATING_CHANGED: 'rating:changed',
        DIVISION_CHANGED: 'division:changed'
    };
})(jQuery);