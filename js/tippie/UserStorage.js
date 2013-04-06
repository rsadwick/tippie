;(function ($) {
    /**
     * class Tippie.UserStorage Saves/Loads from localStorage for settings.
     **/
    Tippie.UserStorage = function (config) {
        config = (config = config || {});
        this.Key = config.key;
        this.TippieUserObj = {};
    };

    //extend storage, take advantage of short circuit evaluation
    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    Tippie.UserStorage.prototype = {

        CreateStorage: function()
        {
          if(!localStorage.getObject(this.Key))
          {
              this.TippieUserObj = {};
              this.TippieUserObj.id = 'tippie' + new Date().getTime();
              this.TippieUserObj.tips = [];
              this.TippieUserObj.settings = {};
              localStorage.setObject(this.Key, this.TippieUserObj);
          }
          else
          {
              this.TippieUserObj = localStorage.getObject(this.Key);
          }
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
            var canvas = $('#tipLib');
            canvas.children().remove();
            for(var currentTipObj = 0; currentTipObj < this.TippieUserObj.tips.length; currentTipObj++)
            {
                var tipBtn = $('<a/>').attr({
                    id : 'tip' + currentTipObj,
                    'class' : 'tip-item',
                    'data-role' : 'button'
                });
                tipBtn.text('yet');
               // tipBtn.data('role', 'button');
                tipBtn.data('total', this.TippieUserObj.tips[currentTipObj].total);
                tipBtn.data('divide', this.TippieUserObj.tips[currentTipObj].divide);
                tipBtn.data('percent', this.TippieUserObj.tips[currentTipObj].tip);

                canvas.append(tipBtn);
                tipBtn.buttonMarkup('refresh');
            }
            canvas.append(canvas.children('a').get().reverse());
        }
    };
})(jQuery);