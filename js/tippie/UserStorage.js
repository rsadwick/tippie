;(function ($) {
    /**
     * Tippie.UserStorage
     * @classDescription: creates / loads / saves localstorage
     * @param {string} key    the unquie name from the localstorage obj
     * @param {Event} events    the events obj.
     */
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

        /**
         * CreateStorage
         * @classDescription: creates or loads the local storage obj
         */
        CreateStorage: function()
        {
            if(!localStorage.getObject(this.Key)){
                this.TippieUserObj = {};
                this.TippieUserObj.id = this.Key + new Date().getTime();
                this.TippieUserObj.tips = [];
                this.TippieUserObj.settings = [];
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

        /**
         * SaveTip
         * @classDescription: saves the specific tip obj
        */
        SaveTip: function (obj) {
            var currentTip = this.TippieUserObj.tips;
            currentTip.push(obj);
            localStorage.setObject(this.Key, this.TippieUserObj);
            //reload saved objs:
            this.LoadTipView();
        },

        /**
         * LoadTipView
         * @classDescription: Loads the tip infomation and passes to the tip view
        */
        LoadTipView: function()
        {
            this.Events.Trigger(Tippie.Application.EVENT.TIP_LOADED, this.TippieUserObj.tips);
        },

        /**
         * LoadSettings
         * @classDescription: Returns the setting obj to the tip view
         */
        LoadSettings: function()
        {
            this.Events.Trigger(Tippie.Application.EVENT.SETTING_LOADED, this.TippieUserObj.settings);
        }
    };
})(jQuery);