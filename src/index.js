'use strict';

var assign = require('object-assign');
var cx = require('classnames');
var blacklist = require('blacklist');
var React = require('react');

module.exports = React.createClass({
    displayName : 'VideoJS',

    componentDidMount () {
        var self = this;
        var player = videojs(this.refs.video, this.props.options)
            .ready(function () {
                self.player = this;
                self.player.on('play', self.handlePlay);
                self.player.autoplay(true);
            });
        if (this.props.onPlayerInit) this.props.onPlayerInit(player);
    },

    componentDidUpdate (prevProps) {
        if (this.props.src !== prevProps.src) {
            if (this.hasOwnProperty('player') && this.player) {
                this.player.src({
                    type : this.props.type,
                    src  : this.props.src
                });
            }
        }
    },

    handlePlay () {
        if (this.props.onPlay) this.props.onPlay(this.player);
    },

    render () {
        var props = blacklist(this.props, 'children', 'className', 'src', 'type', 'onPlay');
        props.className = cx(this.props.className, 'videojs', 'video-js vjs-default-skin');

        assign(props, {
            ref      : 'video',
            controls : true
        });

        return (
            <div>
                <video {... props}>
                    <source src={this.props.src} type={this.props.type}/>
                </video>
            </div>
        )
    }
});
