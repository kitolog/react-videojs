var assign = require('object-assign');
var cx = require('classnames');
var blacklist = require('blacklist');
var React = require('react');

module.exports = React.createClass({
    displayName : 'VideoJS',

    initPlayer:function (playerRef) {
        var self = this;
        var player = videojs(playerRef, this.props.options)
//        var player = videojs(this.refs.video, this.props.options)
            .ready(function () {
                self.player = this;
                self.player.on('play', self.handlePlay);
                if (self.props.autoPlay) {
                    self.player.autoplay(true);
                }

                if (self.props.isFullScreen) {
                    self.player.requestFullscreen();
                }

                if ((typeof self.props.hasControls !== 'undefined')) {
                    self.player.controls(self.props.hasControls);
                }

                if ((typeof self.props.onEnd === 'function') && self.props.onEnd) {
                    self.player.on('ended', function (e) {
                        self.props.onEnd(e);
                    });
                }

                if ((typeof self.props.onLoad === 'function') && self.props.onLoad) {
                    self.player.on('loadeddata', function (e) {
                        self.props.onLoad(e);
                    });
                }

                if ((typeof self.props.onPlay === 'function') && self.props.onPlay) {
                    self.player.on('play', function (e) {
                        var currentTime = self.player.currentTime();
                        self.props.onPlay({
                            event       : e,
                            currentTime : currentTime
                        });
                    });
                }

                if ((typeof self.props.onPause === 'function') && self.props.onPause) {
                    self.player.on('pause', function (e) {
                        var currentTime = self.player.currentTime();
                        self.props.onPause({
                            event       : e,
                            currentTime : currentTime
                        });
                    });
                }
                
                if ((typeof self.props.onFullscreenChange === 'function') && self.props.onFullscreenChange) {
                    self.player.on('fullscreenchange', function (e) {
                        self.props.onFullscreenChange({
                            event : e
                        });
                    });
                }

                if ((typeof self.props.playList === 'object') && self.props.playList) {
                    console.log('playlist', self.props.playList)
                    self.player.playlist(self.props.playList);
                    self.player.playlist.autoadvance(0);
                }
            });
        if (this.props.onPlayerInit) this.props.onPlayerInit(player);
    },

    getPlayerInstance(){
        return this.player;
    },

    componentDidUpdate : function (prevProps) {
        if (this.props.src !== prevProps.src) {
            if (this.hasOwnProperty('player') && this.player) {
                this.player.src({
                    type : this.props.type,
                    src  : this.props.src
                });
            }
        }
        
        if (this.props.hasControls !== prevProps.hasControls) {
            if (this.hasOwnProperty('player') && this.player) {
                this.player.controls(this.props.hasControls);
            }
        }
    },

    handlePlay : function handlePlay() {
        if (this.props.onPlay) this.props.onPlay(this.player);
    },

    render : function render() {
        var props = blacklist(this.props, 'children', 'className', 'src', 'type', 'onPlay', 'playList', 'isFullScreen', 'hasControls', 'onEnd', 'containerStyle');
        props.className = cx(this.props.className, 'videojs', 'video-js vjs-default-skin');

        assign(props, {
//             id      : 'videojsplayer',
            ref      : (playerRef) => {this.initPlayer(playerRef)},
            controls : true
        });

        var videoComponent = null;
        if (this.props.src != 'playlist') {
            videoComponent = React.createElement('source', {
                src  : this.props.src,
                type : this.props.type
            })
        }
        
        return React.createElement(
            'div',
            null,
            React.createElement(
                'video',
                props,
                videoComponent
            )
        );

//         return(
//             <div>
//                 <video {...props} ref={(playerRef) => {this.initPlayer(playerRef)}}>
//                     {videoComponent}
//                 </video>
//             </div>
//         );
    }
});
