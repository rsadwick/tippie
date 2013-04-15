; (function ($) {
    $(document).ready(function () {
        window.Tippie.Instance(new Tippie.Application
        (
            'body'
        ));
        Tippie.Instance().InitControls();
    });
})(jQuery);
