(function ($) {
    /**
     * Tippie.Instance()
     * @classDescription: Exposes a static singleton method that will return the current instance of
     * the [[Tippie.Application]] that represents the page.
     * @param {htmlElement} newInstance    Application instance to make available
     */
    var Tippie = {};

    Tippie.Instance = function (newInstance) {
        if (null != newInstance)
            Tippie._instance = newInstance;
        return Tippie._instance;
    };
    window.Tippie = Tippie;
})(jQuery);
