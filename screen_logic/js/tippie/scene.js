;(function($)
{
    /**
     * class Tippie.Slideshow.Scene
     *
     * Acts as an abstract base class for all scenes that can be played on the stage of an [[Tippie.Slideshow]].
     **/
    Tippie.Slideshow.Scene = (function()
    {
        Scene.name = 'Tippie.Slideshow.Scene';

        function Scene(config)
        {
            /**
             * new Tippie.Slideshow.Scene(config)
             * - config (Object): A configuration object for the [[Tippie.Slideshow.Scene]]
             *   consisting of the following keys:
             *   - thumbnail (string): The URL to an image that the [[Tippie.Slideshow]] can use as a thumbnail in its filmstrip.
             **/

            this.Events = new Tippie.EventCoordinator();

            config = (config = config || {});

            this.Thumbnail = config.thumbnail;
        }

        /**
         * Tippie.Slideshow.Scene.EVENT = Object
         *
         * An enumeration of events an [[Tippie.Slideshow.Scene]] can raise:
         * - COMPLETE: When the scene's animation has completed.
         * - PROGRESS: When each frame of the scene's animation is completed. Provides the callback with a percentage complete.
         **/
        Scene.EVENT =
        {
            COMPLETE: 'Tippie.Slideshow.Scene:COMPLETE',
            PROGRESS: 'Tippie.Slideshow.Scene:PROGRESS'
        };

        Scene.prototype._canvas = null;
        Scene.prototype._isAnimating = false;
        Scene.prototype._isRendered = false;

        Scene.prototype._complete = function()
        {
            this._isAnimating = false;
            this.Events.Trigger(Tippie.Slideshow.Scene.EVENT.COMPLETE, this);
        };

        Scene.prototype._progress = function(percent)
        {
            this.Events.Trigger(Tippie.Slideshow.Scene.EVENT.PROGRESS, this, percent);
        }

        // This private method must be implemented by all Tippie.Slideshow.Scene subclasses.
        Scene.prototype._render = function()
        {
            throw "_render() is not implemented in " + this.constructor.name;
        };

        // This private method must be implemented by all Tippie.Slideshow.Scene subclasses.
        Scene.prototype._reset = function()
        {
            throw "_reset() is not implemented in " + this.constructor.name;
        };

        // This private method must be implemented by all Tippie.Slideshow.Scene subclasses.
        Scene.prototype._start = function()
        {
            throw "_start() is not implemented in " + this.constructor.name;
        };

        // This private method must be implemented by all Tippie.Slideshow.Scene subclasses.
        Scene.prototype._stop = function()
        {
            throw "_stop() is not implemented in " + this.constructor.name;
        };

        /**
         * Tippie.Slideshow.Scene#Events -> Tippie.EventCoordinator
         *
         * Provides access to the [[Tippie.EventCoordinator]] instance that the
         * scene uses to raise it's events.
         **/
        Scene.prototype.Events = null;

        /**
         * Tippie.Slideshow.Scene#Thumbnail -> String
         *
         * Provides the URL to an image that the [[Tippie.Slideshow]] can use as a thumbnail in its filmstrip.
         **/
        Scene.prototype.Thumbnail = null;

        /**
         * Tippie.Slideshow.Scene#GetCanvas() -> jQuery
         *
         * Provides access to the jQuery-wrapped root HTML element the scene is using to render its contents.
         **/
        Scene.prototype.GetCanvas = function()
        {
            if (null == this._canvas)
                this._canvas = $('<div class="canvas"></div>');

            return this._canvas;
        };

        /**
         * Tippie.Slideshow.Scene#IsAnimating() -> Boolean
         *
         * Returns a boolean representing whether or not the scene is currently animating.
         **/
        Scene.prototype.IsAnimating = function()
        {
            return this._isAnimating;
        };

        /**
         * Tippie.Slideshow.Scene#IsRendered() -> Boolean
         *
         * Returns a boolean representing whether or not the scene has already rendered itself.
         **/
        Scene.prototype.IsRendered = function()
        {
            return this._isRendered;
        };

        /**
         * Tippie.Slideshow.Scene#Render() -> void
         *
         * Instructucts the scene to render all necessary elements onto its canvas, if it has not already done so.
         **/
        Scene.prototype.Render = function()
        {
            if (this.IsRendered())
                return;

            this._isRendered = this._render();

            if (this.IsRendered())
                this.Reset();
        };

        /**
         * Tippie.Slideshow.Scene#Reset() -> void
         *
         * Instructs the scene to reset all of its elements to their default state to prepare for another possible animation.
         **/
        Scene.prototype.Reset = function()
        {
            this._reset();
        };

        /**
         * Tippie.Slideshow.Scene#Start() -> void
         *
         * Instructs the scene to begin the animation of its elements, after which it must call the _complete() method.
         * Additionally, during animation, the scene should regularly call _progress() with a percentage-done value between 0 and 1.
         **/
        Scene.prototype.Start = function()
        {
            this._isAnimating = true;

            this._start();
        };

        /**
         * Tippie.Slideshow.Scene#Stop() -> void
         *
         * Instructs the scene to immediately cancel all animations.
         **/
        Scene.prototype.Stop = function()
        {
            this._stop();
        };

        return Scene;
    })();
})(jQuery);
