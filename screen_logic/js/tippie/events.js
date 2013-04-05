; (function ($) {
    /**
     * class Tippie.EventCoordinator
     *
     * Coordinates the registration and triggering of arbitrary events handlers.
     * May be instantiated directly or as a public property to another class
     * allowing any class to expose an event-driven model.
     **/
    Tippie.EventCoordinator = function () {
        /**
         * new Tippie.EventCoordinator()
         *
         * Instantiates and returns a new [[Tippie.EventCoordinator]].
         **/
        this._events = {};
    };

    Tippie.EventCoordinator.prototype = {
        _events: null,

        /**
         * Tippie.EventCoordinator#On(name, handler, scope) -> void
         * - name (String): The name of the event to handle.
         * - handler (Function): The function to handle the given event.
         * - scope (Object): The optional scope to execute the handler in. If not provided it will default to the handler.
         *
         * Registers a new handler for the given event to be executed within the given scope.
         **/
        On: function (name, handler, scope) {
            this._events[name] = (this._events[name] = this._events[name] || []);
            if (this._events[name].length === 0) {
                this._events[name].push(
                    {
                        handler: handler,
                        scope: scope
                    }
                );
            }
            else {
                var hasEvent = false;
                var eventsByNameLength = this._events[name].length;
                for (var i = 0; i < eventsByNameLength; i++) {
                    if (this._events[name][i].handler === handler || this._events[name][i].scope === scope) {
                        hasEvent = true;
                    }
                }

                if (!hasEvent) {
                    this._events[name].push(
                        {
                            handler: handler,
                            scope: scope
                        }
                    );
                }
            }
        },

        /**
         * Tippie.EventCoordinator#Trigger(name[, argument1[, argument2[, argumentN]]]) -> void
         * - name (String): The name of the event to trigger handlers for.
         * - arguments (Object): Arguments to be passed to the event handlers.
         *
         * Executes the registered handlers for the given event, passing them the
         * optional arguments in the same order as they are passed.
         **/
        Trigger: function (name) {
            if (!this._events[name]) {
                return;
            }

            var argumentsCopy = [];
            var argumentsLength = arguments.length;
            for (var i = 0; i < argumentsLength; i++) {
                argumentsCopy[i] = arguments[i];
            }

            var eventsByNameLength = this._events[name].length;
            for (var i = 0; i < eventsByNameLength; i++) {
                this._events[name][i].handler.apply((this._events[name][i].scope || this._events[name][i].handler), argumentsCopy.slice(1));
            }
        }
    };
})(jQuery);