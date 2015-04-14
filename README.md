# backbone.station

A mixin for making life with [Backbone.Radio](https://github.com/marionettejs/backbone.radio) even easier.

## Instructions

In order not to fill initialisers with `Backbone.Radio.channel('app').comply( 'do:smth', this.action, this)` all over the place, you can now put all the configuration in two `complyTo` and `replyTo` hashes like this:

    var MyView = Backbone.View.extend(_.extend({}, Backbone.Station, {
      complyTo: {
        channelName: {
          'commandName'        : 'someHandler',
          'anotherCommandName' : function(params){ ... }
        },
        anotherChannelName: { ... }
      },
      replyTo: {
        channelName: {
          'requestName' : ...
        }
      },
      ...
      'someHandler' : function(params){ ... }
    }));
    
You just need to call the `_initChannels` method in the initialiser, like this:

    initialize: function(options){
      this._initChannels.call(this, 'channelName', 'anotherChannelName');
    }
    
In order to remover listeners on view/object disposal, run `_unsubscribe`:

    onDestroy: function(){
      this._unsubcribe.call(this);
    }