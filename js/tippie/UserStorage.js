;(function ($) {
    /**
     * class Tippie.UserStorage Saves/Loads from localStorage for settings.
     **/
    Tippie.UserStorage = function (config) {
        config = (config = config || {});
        this.Key = config.key;
        this.TippieUserObj = {};
        this.Events = config.events;
    };

    //extend storage by adding getter/setter: take advantage of short circuit evaluation
    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    Tippie.UserStorage.prototype = {

        Events: null,

        CreateStorage: function()
        {
            if(!localStorage.getObject(this.Key)){
                this.TippieUserObj = {};
                this.TippieUserObj.id = this.Key + new Date().getTime();
                this.TippieUserObj.tips = [];
                this.TippieUserObj.settings = {};
                localStorage.setObject(this.Key, this.TippieUserObj);
            }
            else
            {
                this.TippieUserObj = localStorage.getObject(this.Key);
            }

            this.Events.On(Tippie.Application.EVENT.SETTING_CHANGED, function (e) {

                switch($(e).data('setting')){
                    case 'max':
                        //TODO: add in setting events to bubble up to app- update view.
                        console.log('max')
                    break;
                    }
            }, this);
        },

        SaveTip: function (obj) {
            var currentTip = this.TippieUserObj.tips;
            currentTip.push(obj);
            localStorage.setObject(this.Key, this.TippieUserObj);
            //reload saved objs:
            this.LoadTipView();
        },

        LoadTip: function(){
            return localStorage.getObject(this.Key);
        },

        LoadTipView: function()
        {
            this.Events.Trigger(Tippie.Application.EVENT.TIP_LOADED, this.TippieUserObj.tips);
        },

        SaveSettings: function(obj)
        {
            this.TippieUserObj.settings = obj;
        },

        LoadSettings: function()
        {
            return this.TippieUserObj.settings;
        }
    };
})(jQuery);