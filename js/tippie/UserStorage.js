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
    var _scope = this;
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
                this.TippieUserObj.settings = [];
                this.TippieUserObj.settings.push([
                    "settings-max-tip", 100,
                    "settings-poor-tip", 2,
                    "settings-okay-tip", 7,
                    "settings-minimal-tip", 12,
                    "settings-great-tip", 15,
                    "settings-excellent-tip", 20])
                //this.TippieUserObj.settings.maxTip = 5;
                localStorage.setObject(this.Key, this.TippieUserObj);
            }
            else
            {
                this.TippieUserObj = localStorage.getObject(this.Key);
            }

            this.Events.On(Tippie.Application.EVENT.SETTING_CHANGED, function (settings) {

                this.TippieUserObj.settings = settings;
                localStorage.setObject(this.Key, this.TippieUserObj)
                this.LoadSettings();
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

            this.Events.Trigger(Tippie.Application.EVENT.SETTING_LOADED, this.TippieUserObj.settings);
        }
    };
})(jQuery);