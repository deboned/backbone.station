// Backbone.Station v0.0.1
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  }
  else {
    factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
  'use strict';

  var previousStation = Backbone.Station;
  var Station = Backbone.Station = {};
  
  Station.VERSION = '0.0.1';

  Station.noConflict = function () {
    Backbone.Station = previousStation;
    return this;
  };

  _.extend(Station, {
    _walk: function(_handler){
      var iterator = function(list, actionType){
        _.forEach(list, function(actions, channelName){
          _.forEach(actions, function(handler, actionName){
            var targetHandler = function(){};
            if(_.isFunction(handler)){
              targetHandler = _.bind(handler, this);
            }else if(_.isFunction(this[handler])){
              targetHandler = _.bind(this[handler], this);
            }
            _handler.call(this, channelName, actionType, actionName, targetHandler);
          }, this);
        }, this);
      };
    
      _.forEach({
        comply    : this.complyTo,
        reply     : this.replyTo
      }, iterator, this);    
    },
    _initChannels: function(){
      // Init Backbone.Radio channels - e.g. this._initChannels('app', 'ui')
      this.channels = _.reduce(arguments, function(memo, channel){
        memo[channel] = Backbone.Radio.channel(channel);
        return memo;
      }, {});
    
      this._walk(function(channelName, actionType, actionName, targetHandler){
        this.channels[channelName][actionType](actionName, targetHandler);      
      });
    },
    _unsubscribe: function(){
      this._walk(function(channelName, actionType, actionName, targetHandler){
        switch(actionType){
          case 'comply':
            this.channels[channelName].stopComplying(actionName, targetHandler, this);
            break;
          case 'reply':
            this.channels[channelName].stopReplying(actionName, targetHandler, this);
            break;
        }
      });
    }
  });

  return Station;
}));
