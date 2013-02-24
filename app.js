#! /usr/bin/env node
'use strict';

var argv = require('optimist')
  .usage('Parse a file to make a book.\nUsage: $0')
  .options({
    'input' :
      { 'alias' : 'i'
      , 'description' : 'Input file to be parsed'
      , 'default' : 'book'
      }
  , 'output' :
      { 'alias' : 'o'
      , 'description' : 'Output directory'
      , 'default' : 'web'
      }
  , 'format' :
      { 'alias' : 'f'
      , 'description' : 'Output format (html, epub, latex)'
      , 'default' : 'html'
      }
  , 'delay' :
      { 'alias' : 'd'
      , 'description' : 'Time between git pull'
      }
  , 'help' :
      { 'alias' : 'h'
      , 'description' : 'Displays a helpful message.'
      }
  })
  .argv;

var util = require('util')
  , Reader = require('./lib/reader');

if (argv.h) {
  util.puts('Don\'t panic!');
  return;
}

var reader = new Reader();
reader.read(argv.input);

reader.on('error', function (err) {
  util.puts('Error: ' + err);
});

reader.on('data', function (data) {
  util.puts('New data!\n');
  (function () {
    return data;
  })();
});

reader.on('end', function (data) {
  util.puts('End: ' + data + '\n');
});

