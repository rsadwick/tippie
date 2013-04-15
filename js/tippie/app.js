; (function ($) {
    Tippie.Application = function (canvas) {
        this.Events = new Tippie.EventCoordinator();
        this.Canvas = $(canvas);
        this.progressBar = new Tippie.ProgressCircle({
            element: $(canvas).find('.timer'),
            max: 100
        });
    };

    Tippie.Application.EVENT =
    {
        SLIDER_CHANGED: 'slider:changed',
        RATING_CHANGED: 'rating:changed',
        DIVISION_CHANGED: 'division:changed',
        SETTING_CHANGED: 'settings:changed',
        SETTING_MAX_CHANGED: 'settings:max_changed',
        SETTING_LOADED: 'setting:loaded',
        TIP_SAVED: 'tip:saved',
        TIP_LOADED: 'tip:loaded',
        REQUEST_TIP: 'request:tip'
    };

    Tippie.Application.prototype =
    {
        Canvas: null,
        Events: null,
        divisionStepper: null,
        settingsMax: null,
        settingsGreat: null,
        settingsMinimal: null,
        settingsOkay: null,
        settingsPoor: null,

        InitControls: function () {

            var _scope = this;

            this.Canvas.find('#slider-1').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED);
                _scope.progressBar.Render($(this).slider().val());
            });

            this.Canvas.find('#meal-total').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED);
            });

            //Save state:
            this.Canvas.find('#saveBtn').on('click', function(e){
                _scope.Events.Trigger(Tippie.Application.EVENT.TIP_SAVED, e);
            });

            //email modal:
            this.Canvas.find('#emailBtn').on('click', function(){
                //prepare date for msg body:
                var msg = "Total: " +  _scope.Canvas.find('#bill-total').text();
                msg += "\nTip: " +  _scope.Canvas.find('#tip-amount').text();
                //only display split if necessary:
                if( _scope.Canvas.find('#divide-meal').val() > 1)
                    msg += "\nSplit: " + _scope.Canvas.find('#tip-split').text();
                _scope.Canvas.find('#emailDialog textarea').text(msg);
                $.mobile.changePage('#emailDialog', {transition: 'pop', role: 'dialog'});
            });

            //email form
            this.Canvas.find('#email-to').change(function() {
                _scope.Canvas.find('#sendEmailBtn').attr('href','mailto:' + _scope.Canvas.find('#email-to').val() + '?subject=Tippie Info&body=' +  _scope.Canvas.find('#emailDialog textarea').val() )
            });

            //clear tippie:
            this.Canvas.find('#clearBtn').on('click', function(){
                _scope.Canvas.find('#meal-total').val(0.00);
                _scope.Canvas.find('#slider-1').slider().val(0).slider("refresh");
                _scope.Canvas.find('#divide-meal').val(1);
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED);
            });

            Tippie.Instance().Events.On(Tippie.Application.EVENT.TIP_SAVED, function(e){
                var currentTip = {};
                currentTip.name = this.Canvas.find('#tip-name').val();
                currentTip.total = this.Canvas.find('#meal-total').val();
                currentTip.tip =  this.Canvas.find('#slider-1').slider().val() - 0;
                currentTip.divide = this.divisionStepper.GetValue();

                _scope.settings.SaveTip(currentTip);

            }, this);

            Tippie.Instance().Events.On(Tippie.Application.EVENT.TIP_LOADED, function(savedTips){
                //Load previously saved tips into the dom:
                var canvas = _scope.Canvas.find('#tipListing');
                //check for saved tips: if not, message something.
                if(canvas.children().length > 0)
                {
                    canvas.children().remove();
                }

                else{
                    canvas.append($('<p/>').text("You haven't saved any tips yet."));
                }

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
                    });

                    canvas.append(tipBtn);
                    tipBtn.buttonMarkup('refresh');
                }
                canvas.append(canvas.children('a').get().reverse());
            }, this);

            Tippie.Instance().Events.On(Tippie.Application.EVENT.SETTING_LOADED, function(savedSettings){
                //update setting inputs
                for(var currentSetting = 0; currentSetting < savedSettings.length; currentSetting++)
                {
                    _scope.Canvas.find('#' + savedSettings[currentSetting][0]).val(savedSettings[currentSetting][1]);
                    //reversal of ids to update rating values:
                    this.UpdateRatingValue(savedSettings.length - currentSetting - 1, savedSettings[currentSetting][1]);
                    //update max setting for progress bar:
                    if(currentSetting == 0){
                        this.progressBar.SetMax(savedSettings[currentSetting][1]);
                        this.Canvas.find('#slider-1').attr('max', savedSettings[currentSetting][1])
                    }
                }

            }, this);

            Tippie.Instance().Events.On(Tippie.Application.EVENT.REQUEST_TIP, function(data){
                //pull in data, set the values, and update the UI:
                _scope.Canvas.find('#meal-total').val(data.total);
                _scope.Canvas.find('#slider-1').slider().val(data.percent).slider("refresh");
                _scope.divisionStepper.SetValue(data.divide);
                //call event to propagate all UI updates to view:
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());

                $.mobile.changePage('#tipster', {
                    transition: 'fade'
                });
            });

            //Rating buttons:
            this.Canvas.find('.rating li').each(function( index ) {
                $(this).on('click', function(e){
                    _scope.UpdateRating($(this).data('percent'));
                    _scope.UpdateTip($(this).data('percent'));
                })
            });

            Tippie.Instance().Events.On(Tippie.Application.EVENT.SLIDER_CHANGED, function () {
                Tippie.Instance().UpdateTip(_scope.Canvas.find('#slider-1').slider().val());
                Tippie.Instance().CalculateTip();
            }, this);

            //divisions:
            Tippie.Instance().Events.On(Tippie.Application.EVENT.DIVISION_CHANGED, function (e) {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            }, this);

            //Number Steppers:
            this.divisionStepper = new Tippie.NumberStep({
                field : '#divide-meal',
                up: '#up',
                down: '#down',
                events: this.Events,
                trigger: Tippie.Application.EVENT.DIVISION_CHANGED,
                min: 1,
                max: 99999,
                step: 1
            });


            //create/load saved tips & settings:
            this.settings = new Tippie.UserStorage({
                key : 'tippie',
                events: this.Events
            });
            this.settings.CreateStorage();
            this.settings.LoadTipView();
            this.settings.LoadSettings();

            this.settingsMax = new Tippie.NumberStep({
                field : '#settings-max-tip',
                up: '#settings-max-up',
                down: '#settings-max-down',
                events: this.Events,
                trigger: Tippie.Application.EVENT.SETTING_CHANGED,
                min: 0,
                max: 100,
                step: 1
            });

            this.settingsGreat = new Tippie.NumberStep({
                field : '#settings-great-tip',
                up: '#settings-great-up',
                down: '#settings-great-down',
                events: this.Events,
                trigger: Tippie.Application.EVENT.SETTING_CHANGED,
                min: 0,
                max: 100,
                step: 1
            });

            this.settingsMinimal = new Tippie.NumberStep({
                field : '#settings-minimal-tip',
                up: '#settings-minimal-up',
                down: '#settings-minimal-down',
                events: this.Events,
                trigger: Tippie.Application.EVENT.SETTING_CHANGED,
                min: 0,
                max: 100,
                step: 1
            });

            this.settingsOkay = new Tippie.NumberStep({
                field : '#settings-okay-tip',
                up: '#settings-okay-up',
                down: '#settings-okay-down',
                events: this.Events,
                trigger: Tippie.Application.EVENT.SETTING_CHANGED,
                min: 0,
                max: 100,
                step: 1
            });

            this.settingsPoor = new Tippie.NumberStep({
                field : '#settings-poor-tip',
                up: '#settings-poor-up',
                down: '#settings-poor-down',
                events: this.Events,
                trigger: Tippie.Application.EVENT.SETTING_CHANGED,
                min: 0,
                max: 100,
                step: 1
            });


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

        UpdateRatingValue: function(rating, value){
            this.Canvas.find('.rating li').eq(rating).data('percent', Number(value));
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
            var divideCurrency = parseFloat((bill + total) / this.divisionStepper.GetValue()).toFixed(2);
            this.Canvas.find('#tip-amount').text('$' + tipCurrency);
            this.Canvas.find('#bill-total').text('$' + totalCurrency);
            this.Canvas.find('#tip-split').text('$' + divideCurrency);
        }
    };
})(jQuery);