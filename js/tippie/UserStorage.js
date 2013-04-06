;(function ($) {
    /**
     * class Tippie.UserStorage
     **/
    Tippie.UserStorage = function (config) {
        config = (config = config || {});
        this.Key = config.key;
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

        Save: function (obj) {

            localStorage.setObject(this.Key, obj);
        },

        Load: function(){
            return localStorage.getObject(this.Key);
        }
    };
})(jQuery);