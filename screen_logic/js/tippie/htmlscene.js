; (function ($) {
    /**
     * class Tippie.Slideshow.HtmlContentScene < Tippie.Slideshow.Scene
     *
     * A simple slideshow scene class that fades in html content.
     **/
    Tippie.Slideshow.HtmlContentScene = (function (_super) {
        __extends(HtmlContentScene, _super);

        HtmlContentScene.name = 'Tippie.Slideshow.HtmlContentScene';

        function HtmlContentScene(config) {
            /**
             * new Tippie.Slideshow.HtmlContentScene(config)
             * - config (Object): A configuration object for the [[Tippie.Slideshow.Scene]]
             *   consisting of the following keys:
             *   - content (string): The URL to an image that will act as the content of the scene.
             *   - thumbnail (string): The URL to an image that the [[Tippie.Slideshow]] can use as a thumbnail in its filmstrip.
             *   - duration (int): The optional override time interval to display a scene.
             **/

            config = (config = config || {});

            this._content = config.content;

            if (config.duration) {
                this._duration = config.duration;
            }
            else {
                this._duration = 5000;
            }

            return HtmlContentScene.__super__.constructor.call(this, config);
        }

        HtmlContentScene.prototype._content = null;
        HtmlContentScene.prototype._duration = null;

        HtmlContentScene.prototype._render = function () {
            console.log('render');;
            this._element = $('<div/>');

            this._element.append(this._content);
            this.GetCanvas().append(this._element);
            return true;
        };

        HtmlContentScene.prototype._reset = function () {
            this._element.data('percent', 0);
        };

        HtmlContentScene.prototype._start = function () {
            var __scope = this;

            this._element.animate(
                { 'data-percent': 1 },
                {
                    complete: function () {
                        __scope._complete();
                    },
                    duration: __scope._duration,
                    step: function (value, animation) {
                        __scope._progress(value);
                    }
                }
            );
        };

        HtmlContentScene.prototype._stop = function () {
            // Hard-stop all animations.

            this._element.stop(true, false);

        };

        return HtmlContentScene;
    })(Tippie.Slideshow.Scene);
})(jQuery);
