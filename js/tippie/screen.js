;(function($)
{
    // This is a private helper class we use inernally to associate meta data with raw scene objects.
    var SceneWrapper = function(scene)
    {
        this.Scene = scene;

        this.Frame = $('<div class="frame"></div>').data('Tippie.Slideshow.Scene', this);
        this.Frame.append($('<img/>').attr('src', scene.Thumbnail));
        this.Frame.append('<div class="overlay"></div>');
    };
    SceneWrapper.prototype =
    {
        Frame: null,
        Slide: null
    };

    /**
     * class Tippie.Slideshow
     *
     * Provides an user interface for displaying and interacting with multiple [[Tippie.Slideshow.Scene]] objects.
     **/
    Tippie.Slideshow = function(config)
    {
        var __scope = this;

        config = (config = config || {});

        this._container = $(config.container);

        // Remove anything that may be in the container, such as messaging for users without Javascript.
        this._container.empty();

        // Wrap all our scenes in our SceneWrapper class so we can keep additional state.
        this._scenes = $.map(config.scenes, function(scene)
        {
            return new SceneWrapper(scene);
        });

        // Create the stage for the slides.
        this._stage = $('<div class="stage"></div>')
            .on('mouseenter', function(e)
            {
                // We want to store the playback state at the time they moused over so we can restore that state when they mouse out.
                // This is mainly so we don't start playing the slideshow again if they explicitly paused it.
                $(this).data('Tippie.Slideshow.Stage.PreviousPlaybackState', __scope.GetPlaybackState());
                __scope.Pause();
            })
            .on('mouseleave', function(e)
            {
                var playbackState = $(this).data('Tippie.Slideshow.Stage.PreviousPlaybackState');
                if (playbackState == undefined)
                    playbackState = Tippie.Slideshow.PLAYBACK_STATE.PLAYING;

                __scope.SetPlaybackState(playbackState);
            })
        ;
        this._stageViewport = $('<div class="viewport"></div>');
        this._stage.append(this._stageViewport);

        this._container.append(this._stage);

        this._nonStageTab = $('<div class="non-stage-tab"></div>')
            .css('position', 'absolute')
            .on('click', function(e)
            {
                __scope.OpenFilmstrip();
            })
        ;
        this._container.append(this._nonStageTab);

        // Create the non-stage area, which is everything that isn't the stage. Very clever naming.
        this._nonStage = $('<div class="non-stage"></div>')
            .css('position', 'absolute')
            .on('mouseenter', function(e)
            {
                __scope.OpenFilmstrip();
            })
            .on('mouseleave', function(e)
            {
                __scope.CloseFilmstrip();
            })
        ;

        // Create the timeline to track progress through the slides.
        this._timeline = $('<div class="timeline"></div>');
        this._timelineTracker = $('<div class="timeline-tracker"></div>');
        this._timeline.append(this._timelineTracker);

        this._nonStage.append(this._timeline);

        // Create the controls container for the slideshow.
        this._controls = $('<div class="controls clearfix"></div>');

        this._nonStage.append(this._controls);

        this._controls.append('<div class="now-showing ir">Now Playing</div>');

        // Creat the filmstrip to allow quick jumps to slides.
        this._filmstrip = $('<div class="filmstrip clearfix"></div>');
        $.each(this._scenes, function(i, sceneWrapper)
        {
            sceneWrapper.Scene.Events.On
                (
                    Tippie.Slideshow.Scene.EVENT.COMPLETE,
                    __scope._handleSceneComplete,
                    __scope
                );
            sceneWrapper.Scene.Events.On
                (
                    Tippie.Slideshow.Scene.EVENT.PROGRESS,
                    __scope._handleSceneProgress,
                    __scope
                );
            sceneWrapper.Frame.on('click', function(e)
            {
                //go to a specific scene:
                __scope._activateScene(__scope._scenes[2]);
               // __scope._activateScene($(this).data('Tippie.Slideshow.Scene'));
               //
               // __scope.Pause();
            });

            __scope._stageViewport.append(sceneWrapper.Scene.GetCanvas());

            __scope._filmstrip.append(sceneWrapper.Frame);
        });

        this._stageViewport.width(this._stageViewport.children().length * this._stage.innerWidth());

        this._controls.append(this._filmstrip);

        // Create our play button to let people control the slideshow.
        this._playButton = $('<div class="play-button"></div>')
            .on('click', function(e)
            {
                switch (__scope.GetPlaybackState())
                {
                    case Tippie.Slideshow.PLAYBACK_STATE.PAUSED:
                        __scope.Play();
                        break;
                    case Tippie.Slideshow.PLAYBACK_STATE.PLAYING:
                        __scope.Pause();
                        break;
                }
            });
        ;

        this._controls.append(this._playButton);

        this._container.append(this._nonStage);

        // Start our slideshow.
        this.Play();
    };

    /**
     * Tippie.Slideshow.PLAYBACK_STATE = Object
     *
     * An enumeration of potential playback states for an [[Tippie.Slideshow]] with the following members:
     * - PAUSED: The slideshow is not automatically advancing between scenes.
     * - PLAYING: The slideshow is automatically advancing between scenes.
     **/
    Tippie.Slideshow.PLAYBACK_STATE =
    {
        PAUSED: 0,
        PLAYING: 1
    };

    Tippie.Slideshow.prototype =
    {
        _container: null,
        _isTransitioning: false,
        _nonStage: null,
        _nonStageTab: null,
        _playbackState: Tippie.Slideshow.PLAYBACK_STATE.PAUSED,
        _sceneCount: 0,
        _scenes: null,
        _stage: null,
        _stageViewport: null,
        _timeline: null,
        _timeTracker: null,

        _activateScene: function(newSceneWrapper)
        {
            if (null == newSceneWrapper)
                return;

            var __scope = this;

            var lastSceneWrapper = this._activeSceneWrapper;

            if (!newSceneWrapper.Scene.IsRendered())
                newSceneWrapper.Scene.Render();
            else
                newSceneWrapper.Scene.Reset();

            this._activeSceneWrapper = newSceneWrapper;

            if (null != lastSceneWrapper)
            {
                lastSceneWrapper.Scene.Stop();
                this._isTransitioning = true;
                this._stageViewport.stop(true, false).animate
                (
                    {left: $(this._activeSceneWrapper.Scene.GetCanvas()).position().left * -1},
                    {
                        complete: function()
                        {
                            __scope._isTransitioning = false;
                            __scope._activeSceneWrapper.Scene.Start();
                            if (1 == ++__scope._sceneCount)
                                __scope.CloseFilmstrip();
                        },
                        duration: 1000
                    }
                );
            }
            else
                this._activeSceneWrapper.Scene.Start();

            $.each(this._scenes, function(i, sceneWrapper)
            {
                sceneWrapper.Frame[((sceneWrapper == newSceneWrapper) ? 'addClass' : 'removeClass')]('active');
            });
        },

        _getFirstSceneWrapper: function()
        {
            return ((this._scenes.length == 0) ? null : this._scenes[0]);
        },

        _getNextSceneWrapper: function()
        {
            var sceneWrapper = null;

            if (null == this._activeSceneWrapper)
                sceneWrapper = this._getFirstSceneWrapper();
            else
            {
                var activeSceneWrapperIndex = this._getSceneWrapperIndex(this._activeSceneWrapper);
                if (null != activeSceneWrapperIndex)
                {
                    var nextSceneWrapperIndex = (activeSceneWrapperIndex + 1);
                    sceneWrapper = ((this._scenes.length > nextSceneWrapperIndex) ? this._scenes[nextSceneWrapperIndex] : null);
                }
            }

            return sceneWrapper;
        },

        _getSceneWrapperIndex: function(needleSceneWrapper)
        {
            //console.log(needleSceneWrapper)
            var sceneWrapperIndex = null;
            $.each(this._scenes, function(i, haystackSceneWrapper)
            {
                if (haystackSceneWrapper == needleSceneWrapper || haystackSceneWrapper.Scene == needleSceneWrapper)
                {
                    sceneWrapperIndex = i;
                    return false;
                }
            });
            return sceneWrapperIndex;
        },

        _handleSceneComplete: function(completedScene)
        {
            if (this.GetPlaybackState() != Tippie.Slideshow.PLAYBACK_STATE.PLAYING)
                return;

            var nextSceneWrapper = this._getNextSceneWrapper() || this._getFirstSceneWrapper();

            var nextSceneWrapperLeft = nextSceneWrapper.Scene.GetCanvas().position().left;
            var completedSceneLeft = completedScene.GetCanvas().position().left;

            if (nextSceneWrapperLeft < completedSceneLeft)
            {
                this._stageViewport.append(nextSceneWrapper.Scene.GetCanvas());
                this._stageViewport.css('left', completedScene.GetCanvas().position().left * -1);
            }

           // this._activateScene(nextSceneWrapper);
        },

        _handleSceneProgress: function(scene, progress)
        {
            var sceneWidth = (this._timeline.innerWidth() / this._scenes.length);
            this._timelineTracker.width((sceneWidth * this._getSceneWrapperIndex(scene)) + (sceneWidth * progress));
        },

        /**
         * Tippie.Slideshow#CloseFilmstrip() -> void
         *
         * Closes the slideshow's filmstrip and makes a small tab to re-open it visible.
         **/
        CloseFilmstrip: function()
        {
            this._nonStage.stop(true, false).animate({'bottom': this._controls.outerHeight(true) * -1}, 250);
            this._nonStageTab.stop(true, false).animate({'bottom': this._timeline.outerHeight()}, 250);
        },

        /**
         * Tippie.Slideshow#GetPlaybackState() -> Tippie.Slideshow.PLAYBACK_STATE
         *
         * Returns the current [[Tippie.Slideshow.PLAYBACK_STATE]] for the slideshow.
         **/
        GetPlaybackState: function()
        {
            return this._playbackState;
        },

        /**
         * Tippie.Slideshow#OpenFilmstrip() -> void;
         *
         * Hides the filmstrip opening tab and opens the filmstrip for the user to interact with.
         **/
        OpenFilmstrip: function()
        {
            this._nonStageTab.stop(true, false).animate({'bottom': this._nonStageTab.outerHeight(true) * -1}, 250);
            this._nonStage.stop(true, false).animate({'bottom': 0}, 250);
        },

        /**
         * Tippie.Slideshow#Pause() -> void
         *
         * Pauses the auto-advancement of the slideshow's scenes.
         **/
        Pause: function()
        {
            this.SetPlaybackState(Tippie.Slideshow.PLAYBACK_STATE.PAUSED);
        },

        /**
         * Tippie.Slideshow#Play() -> void
         *
         * Starts or resumes the auto-advancement of the slideshow's scenes.
         **/
        Play: function()
        {
            this.SetPlaybackState(Tippie.Slideshow.PLAYBACK_STATE.PLAYING);
        },

        /**
         * Tippie.Slideshow#SetPlaybackState(playbackState) -> void
         * - playbackState (Tippie.Slideshow.PLAYBACK_STATE): The playback state to set the slideshow to.
         *
         * Directly switch the slideshow to a particular playback state. If set to [[Tippie.Slideshow.PLAYBACK_STATE].PLAY and neither the slideshow, or the active scene are animating, the slideshow will immediately advance to the next scene.
         **/
        SetPlaybackState: function(playbackState)
        {
            this._container.removeClass('playbackstate-' + this.GetPlaybackState());

            this._playbackState = playbackState;

            this._container.addClass('playbackstate-' + this.GetPlaybackState());

            if (playbackState == Tippie.Slideshow.PLAYBACK_STATE.PLAYING && !this._isTransitioning && (!this._activeSceneWrapper || !this._activeSceneWrapper.Scene.IsAnimating()))
                this._activateScene(this._getNextSceneWrapper() || this._getFirstSceneWrapper());
        }
    };
})(jQuery);
