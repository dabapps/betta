'use strict';

window.define(['utils'], function (utils) {

  var Store = function () {
    var eventInProgress = false;
    var listeners = {};
    var actions = {};

    return {
      bind: function (type, fn) {
        if (type && fn) {
          if (!listeners[type]) {
            listeners[type] = [];
          }
          listeners[type].push(fn);
        }
      },
      unbind: function (type, fn) {
        if (type && fn) {
          if (listeners[type]) {
            var index = listeners[type].indexOf(fn);
            if (index >= 0) {
              listeners[type].splice(index, 1);
            }
          }
        }
      },
      emitEvent: function (type) {
        if (type) {
          if (eventInProgress) {
            console.error('Event already in progress. You cannot trigger a new event from an event listener.');
          } else {
            eventInProgress = true;
              if (listeners[type]) {
                utils.each(listeners[type], function (value) {
                  value();
                });
              }
            eventInProgress = false;
          }
        }
      },
      action: function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var type = args.splice(0, 1)[0];

        if (actions[type]) {
          actions[type].apply(null, args);
        }
      },
      createAction: function (type, fn) {
        if (type && fn) {
          actions[type] = fn;
        }
      }
    };
  };

  return Store;

});
