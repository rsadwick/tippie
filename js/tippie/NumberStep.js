;(function ($) {
    /**
     * class Tippie.NumberStep
     **/
    Tippie.NumberStep = function (config) {
        var _scope = this;
        config = (config = config || {});
        this.Up = $(config.up);
        this.Down = $(config.down);
        this.Field = $(config.field);
        this.Events = config.events;
        this.Trigger = config.trigger;
        this.Max = config.max;
        this.Min = config.min;
        this.Step = config.step;
        scope = this;

        //change event on input:
        this.Field.change(function(e) {
            _scope.AssignTriggers(e);
        });

        //Divide the bill up/down btns
        this.Up.on('click', function(e){
            if(_scope.Field.val() < _scope.Max)
            {
                _scope.Field.val(Number(_scope.Field.val()) + _scope.Step);
                if(_scope.Field.val() > _scope.Max)
                {
                    _scope.Field.val(_scope.Max);
                }
            }
            else
            {
                _scope.Field.val(_scope.Max);
            }
            _scope.AssignTriggers((e));

        });

        this.Down.on('click', function(e){
            if(_scope.Field.val() > _scope.Min)
            {
                _scope.Field.val( _scope.Field.val() - _scope.Step);
                if(_scope.Field.val() < _scope.Min)
                {
                    _scope.Field.val(_scope.Min)
                }
            }
            else
            {
               _scope.Field.val(_scope.Min);
            }

            _scope.AssignTriggers((e));
        });
    };

    Tippie.NumberStep.prototype = {
        scope: this,
        AssignTriggers: function(e){
            //attach an event if needed:
            if(this.Events)
            {
                switch(this.Trigger){
                    case Tippie.Application.EVENT.DIVISION_CHANGED:
                        this.Events.Trigger(Tippie.Application.EVENT.DIVISION_CHANGED, e);
                        break;

                    case Tippie.Application.EVENT.SETTING_CHANGED:

                        var settings = [];
                        scope.Field.parents().find('#settings input').each(function(){
                            settings.push([$(this).attr('id'), $(this).val()]);
                        });

                        this.Events.Trigger(Tippie.Application.EVENT.SETTING_CHANGED, settings);
                        break;
                }
            }
        },

        GetValue: function()
        {
            return this.Field.val();
        },

        SetValue: function(val)
        {
            this.Field.val(val);
        },

        SetMaxValue: function(val)
        {
            this.Max = val;
        }
    };
})(jQuery);