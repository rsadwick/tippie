;(function ($) {
    /**
     * class Tippie.NumberStep
     **/
    Tippie.NumberStep = function (config) {
        config = (config = config || {});
        this.Up = $(config.up);
        this.Down = $(config.down);
        this.Field = $(config.field)
        this.Events = config.events;
        this.Trigger = config.trigger;
        this.Render();
    };

    Tippie.NumberStep.prototype = {

        Render: function () {

            _scope = this;
            //change event on input:
            this.Field.change(function() {
                _scope.AssignTriggers();
            });
            //Divide the bill up/down btns
            this.Up.on('click', this.SetEvents);
            this.Down.on('click',  this.SetEvents);
        },

        SetEvents: function(e)
        {
            switch(e.currentTarget.id){
                case _scope.Up.attr('id'):
                {
                    _scope.Field.val(Number(_scope.Field.val()) + 1);
                    break;
                }

                case _scope.Down.attr('id'):
                {
                    if(_scope.Field.val() > 1)
                        _scope.Field.val( _scope.Field.val() - 1);
                    break;
                }
            }
            _scope.AssignTriggers();
        },

        AssignTriggers: function(e){
            //attach an event if needed:
            if(_scope.Events)
            {
                switch(_scope.Trigger){
                    case Tippie.Application.EVENT.DIVISION_CHANGED:
                        _scope.Events.Trigger(Tippie.Application.EVENT.DIVISION_CHANGED, e);
                        break;

                    case Tippie.Application.EVENT.SETTING_CHANGED:
                        _scope.Events.Trigger(Tippie.Application.EVENT.SETTING_CHANGED, e);
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
        }
    };
})(jQuery);