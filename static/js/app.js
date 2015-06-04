'use strict';

window.less = {
  env: 'development',
  logLevel: 2,
  async: true,
  fileAsync: true,
  dumpLineNumbers: 'comments',
  useFileCache: true
};

window.requirejs.config({
  baseUrl: 'static/js',
  paths: {
    lib: '../lib',
    react: '../lib/react/react.min',
    less: '../lib/less/less.min',
    jquery: '../lib/jquery/dist/jquery.min'
  }
});

window.requirejs(['index']);
