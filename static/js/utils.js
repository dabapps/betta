'use strict';

window.define(function () {

  return {
    each: function (obj, fn) {
      if (typeof obj === 'object') {
        if (obj instanceof Array) {
          for (var i = 0; i < obj.length; i += 1) {
            fn(obj[i], i);
          }
        } else {
          for (var key in obj) {
            fn(obj[key], key);
          }
        }
      }
    }
  };

});
