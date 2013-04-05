; (function ($) {
    /**
     * class Tippie.Application
     *
     * Keeps state of the current page loaded into the browser and provides a
     * consistent and abstracted API for interacting with that page.
     **/
    Tippie.Application = function (canvas) {
        /**
         * new Tippie.Application(canvas, flyoutManager, accountNavigation)
         * - canvas: (HtmlElement | jQuery | String): A jQuery object, HTML element, or CSS selector that will ultimately resolve to an HTML element that is the root canvas of the application.
         * - flyoutManager ([[Tippie.FlyoutManager]]): The flyout manager that will coordinate interaction between a
         * - accountNavigation ([[Tippie.AccountNavigation]]): The account navigation class that will manage the drawers.ll registered [[Tippie.Flyout]]s.
         *
         * Instantiates and returns a new [[Tippie.Application]] that may be passed to
         * [[Tippie.Instance]] which will provide it as a singleton to anything that
         * needs to interact with the page.
         **/

        this.Events = new Tippie.EventCoordinator();
        this.Canvas = $(canvas);
        this.progressC = new Tippie.ProgressCircle({
            element: $('.timer'),
            max: 100
        });



    };
    Tippie.Application.prototype =
    {

        Canvas: null,

        /**
         * Tippie.Application#Events -> Tippie.EventCoordinator
         *
         * Provides access to the [[Tippie.EventCoordinator]] instance that the
         * application uses to raise it's events.
         **/
        Events: null,




        _getTest: function () {

           this.Canvas.find('#slider-val').append(this.Canvas.find('#slider-1'));

            //return test;
        },


        /**
         * Tippie.Application#Authenticate(identity, credential, config) -> void
         * - identity (String): The email or username of the visitor to authenticate.
         * - credential (String): The password to use to authenticate the visitor.
         * - config (Object): A configuration object for the call
         *   consisting of the following keys:
         *   - success (Function): The function to call if the authentication is successful.
         *   - failure (Function): The function to call if the authentication fails.
         *   - error (Function): The function to call if there is an error during authentication.
         *   - scope (Object): The scope to execute the success, failure, and error functions in.
         *
         * Authenticates the current visitor against the authentication service
         * calls the appropriate callbacks depending on the response. If successful
         * raises an [[Tippie.Application.EVENT]].`VISITOR_AUTHENTICATED` event for
         * handling by other components.
         **/

        InitControls: function () {

            var _scope = this;

            this.Canvas.find('#slider-val').append(this.Canvas.find('#slider-1'));
            this.Canvas.find('#slider-1').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, $(this).slider().val());
                _scope.progressC.Render($(this).slider().val());
            });

            this.Canvas.find('#divide-meal').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            });

            this.Canvas.find('#meal-total').change(function() {
                _scope.Events.Trigger(Tippie.Application.EVENT.SLIDER_CHANGED, _scope.Canvas.find('#slider-1').slider().val());
            });

            //percent:
           // this.progressC.Render(15);


        },

        UpdateTip: function(value){
            this.Canvas.find('.rating li').each(function( index ) {

                if(value > $(this).prev().data('percent') && value <= $(this).data('percent') || !$(this).prev().data('percent') && value <= $(this).data('percent'))
                {
                    $(this).addClass('active');
                }
                else
                {
                    $(this).removeClass('active');
                }

            });
        },

        UpdateRating: function(value){
            this.Canvas.find('#slider-1').slider().val(value).slider("refresh");

        },

        CalculateTip: function(){
            var bill = this.Canvas.find('#meal-total').val() - 0;
            var tippie = this.Canvas.find('#slider-1').slider().val() - 0;
            var total = Math.round(((tippie / 100) * bill) * 100) / 100;

            //this.Canvas.find("#tip-split").text()

            this.Canvas.find('#tip-amount').text('$' + parseFloat(total).toFixed(2));
            this.Canvas.find('#bill-total').text('$' + parseFloat(bill + total).toFixed(2));
            this.Canvas.find('#tip-split').text('$' + parseFloat((bill + total) / this.Canvas.find('#divide-meal').val()).toFixed(2));

        }
    };


    /**
     * Tippie.Application.EVENT = Object
     *
     * An enumeration of events an [[Tippie.Application]] can raise:
     * - SLIDER_CHANGED: When an item is successfully favorited.
     * - FAVORITE_UNFAVORITED: When an item is successfully unfavorited.
     * - VISITOR_AUTHENTICATED: When a visitor is authenticated.
     * - BAGITEM_REMOVED: When item is removed from the shopping bag.
     * - BAGITEM_SAVEDFORLATER: When item is saved for later.
     **/
    Tippie.Application.EVENT =
    {
        SLIDER_CHANGED: 'slider:changed',
        RATING_CHANGED: 'rating:changed'
    };
})(jQuery);