'use strict';

var assign = require('object-assign');
var cx = require('classnames');
var blacklist = require('blacklist');
var React = require('react');

module.exports = React.createClass({
    displayName : 'VideoJS',

    componentDidMount : function componentDidMount() {
        var self = this;
        var player = videojs(this.refs.video, this.props.options)
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
                    self.player.ended((e) => self.props.onEnd(e));
                }
                
                if ((typeof self.props.reportUserActivity === 'function') && self.props.reportUserActivity) {
                    self.player.reportUserActivity((e) => self.props.reportUserActivity(e));
                }
            });
        if (this.props.onPlayerInit) this.props.onPlayerInit(player);
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
    },

    handlePlay : function handlePlay() {
        if (this.props.onPlay) this.props.onPlay(this.player);
    },

    render : function render() {
        var props = blacklist(this.props, 'children', 'className', 'src', 'type', 'onPlay');
        props.className = cx(this.props.className, 'videojs', 'video-js vjs-default-skin');

        assign(props, {
            ref      : 'video',
            controls : true
        });

        return React.createElement(
            'div',
            null,
            React.createElement(
                'video',
                props,
                React.createElement('source', {
                    src  : this.props.src,
                    type : this.props.type
                })
            )
        );
    }
});
