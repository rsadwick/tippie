; (function ($) {
    Tippie.Application = function (canvas) {
        this.Events = new Tippie.EventCoordinator();
        this.Canvas = $(canvas);
        this.progressBar = new Tippie.ProgressCircle({
            element: $(canvas).find('.timer'),
            max: 100
        });
        this.settings = new Tippie.UserStorage({
            key : 'tippie',
            events: this.Events
        });
    };

    Tippie.Application.EVENT =
    {
        SLIDER_CHANGED: 'slider:changed',
        RATING_CHANGED: 'rating:changed',
        DIVISION_CHANGED: 'division:changed',
        TIP_SAVED: 'tip:saved',
        TIP_LOADED: 'tip:loaded',
        REQUEST_TIP: 'request:tip'
    };

    Tippie.Application.prototype =
    {
        Canvas: null,
        Events: null,

        InitControls: function () {

            var _scope = this;

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

            //Divide the bill up/down btns
            this.Canvas.find('#up').on('click', function(e){
                _scope.Events.Trigger(Tippie.Application.EVENT.DIVISION_CHANGED, e);
            });

            this.Canvas.find('#down').on('click', function(e){
                _scope.Events.Trigger(Tippie.Application.EVENT.DIVISION_CHANGED, e);
            });

            //Save state:
            this.Canvas.find('#saveBtn').on('click', function(e){
                _scope.Events.Trigger(Tippie.Application.EVENT.TIP_SAVED, e);
            });

            Tippie.Instance().Events.On(Tippie.Application.EVENT.TIP_SAVED, function(e){
                var currentTip = {};
                currentTip.name = this.Canvas.find('#tip-name').val();
                currentTip.total = this.Canvas.find('#meal-total').val();
                currentTip.tip =  this.Canvas.find('#slider-1').slider().val() - 0;
                currentTip.divide = this.Canvas.find('#divide-meal').val();

                _scope.settings.SaveTip(currentTip);

            }, this);

            Tippie.Instance().Events.On(Tippie.Application.EVENT.TIP_LOADED, function(savedTips){
                //Load previously saved tips into the dom:
                var canvas = this.Canvas.find('#tipListing');
                canvas.children().remove();
                for(var currentTipObj = 0; currentTipObj < savedTips.length; currentTipObj++)
                {
                    var tipBtn = $('<a/>').attr({
                        id : 'tip' + currentTipObj,
                        'class' : 'tip-item',
                        'data-role' : 'button'
                    });
                    tipBtn.text(savedTips[currentTipObj].name);
                    tipBtn.data('total', savedTips[currentTipObj].total);
                    tipBtn.data('divide', savedTips[currentTipObj].divide);
                    tipBtn.data('percent',savedTips[currentTipObj].tip);
                    tipBtn.on('click', function(e){
                        _scope.Events.Trigger(Tippie.Application.EVENT.REQUEST_TIP, $(this).data());
                    })

                    canvas.append(tipBtn);
                    tipBtn.buttonMarkup('refresh');
                }
                canvas.append(canvas.children('a').get().reverse());

            }, this);

            Tippie.Instance().Events.On(Tippie.Application.EVENT.REQUEST_TIP, function(data){
                //pull in data, set the values, and update the UI:
                _scope.Canvas.find('#meal-total').val(data.total);
                _scope.Canvas.find('#slider-1').slider().val(data.percent).slider("refresh");
                _scope.Canvas.find('#divide-meal').val(data.divide);
                //call event to propagate all UI updates to view:
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());

                $.mobile.changePage('#tipster');
            });

            Tippie.Instance().Events.On(Tippie.Application.EVENT.SLIDER_CHANGED, function (value) {
                Tippie.Instance().UpdateTip(value);
                Tippie.Instance().CalculateTip();
            }, this);

            //Tip Items:
            this.Canvas.find('.tip-item').live('click', function(e){
                console.log($(this).data());
            });

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
                        if(divide.val() > 1)
                            divide.val(divide.val() - 1);
                        break;
                    }
                }
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            }, this);

            //load any saved tips:
            this.settings.CreateStorage();
            this.settings.LoadTipView();
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
            var tipCurrency = parseFloat(total).toFixed(2);
            var totalCurrency = parseFloat(bill + total).toFixed(2);
            var divideCurrency = parseFloat((bill + total) / this.Canvas.find('#divide-meal').val()).toFixed(2);
            this.Canvas.find('#tip-amount').text('$' + tipCurrency);
            this.Canvas.find('#bill-total').text('$' + totalCurrency);
            this.Canvas.find('#tip-split').text('$' + divideCurrency);
        }
    };
})(jQuery);