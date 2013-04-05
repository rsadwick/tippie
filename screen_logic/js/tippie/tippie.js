(function ($) {

    var Tippie = {};

    /**
     * Tippie.Instance() -> Tippie.Application | null
     * Tippie.Instance(newInstance) -> Tippie.Application
     * - newInstance (Tippie.Application): The Tippie HSN.Application instance to make available.
     *
     * Exposes a static singleton method that will return the current instance of
     * the [[Tippie.Application]] that represents the page. Additionally if given an
     * argument it will replace the current instance with a new one. While this
     * is not an exact implementation of the Singleton Pattern, it is good enough
     * for use in Javascript.
     **/
    /*
     Usage:
     Tippie.Instance(new Tippie.Application(...));
     var hsnApplicationInstance = Tippie.Instance();
     */
    Tippie.Instance = function (newInstance) {
        if (null != newInstance)
            Tippie._instance = newInstance;
        return Tippie._instance;
    };

    // Expose the HSN namespace into the global scope.
    window.Tippie = Tippie;
})(jQuery);
