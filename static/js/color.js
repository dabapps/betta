'use strict';

window.define([], function () {

  var color = {
    // Takes values from 0 to 1
    HSLToRGB: function (h, s, l) {
      var r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        var hueToRGB = function hue2rgb(p, q, t){
          if (t < 0) {
            t += 1;
          }
          if (t > 1) {
            t -= 1;
          }
          if (t < 1/6) {
            return p + (q - p) * 6 * t;
          }
          if (t < 1/2) {
            return q;
          }
          if (t < 2/3) {
            return p + (q - p) * (2/3 - t) * 6;
          }
          return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hueToRGB(p, q, h + 1/3);
        g = hueToRGB(p, q, h);
        b = hueToRGB(p, q, h - 1/3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    },

    // Takes values from 0 to 255
    RGBToHSL: function (r, g, b) {
      r = r / 255;
      g  = g / 255;
      b = b / 255;

      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    },

    // Takes values from 0 to 255
    RGBToHex: function (r, g, b) {
      var colorToHex = function (c) {
        var hexSegment = c.toString(16);
        return hexSegment.length === 1 ? '0'.concat(hexSegment) : hexSegment;
      };

      var hex = [colorToHex(r), colorToHex(g), colorToHex(b)].join('');

      if (hex.length === 6 && hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
        hex = [hex[0], hex[2], hex[4]].join('');
      }

      return '#'.concat(hex);
    },

    // Takes 3 or 6 digit hex
    HexToRGB: function (hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return [r, r, g, g, b, b].join('');
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : undefined;
    }
  };

  return color;

});
