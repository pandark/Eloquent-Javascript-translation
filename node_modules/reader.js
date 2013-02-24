#! /usr/bin/env node
'use strict';

var fs = require('fs')
  , events = require('events')
  , util = require('util');

function Reader() {
  if(false === (this instanceof Reader)) {
    return new Reader();
  }

  events.EventEmitter.call(this);
}
util.inherits(Reader, events.EventEmitter);

Reader.prototype.read = function (inputFile) {
  var self = this;

  var buff = ''
    , paragraphs
    , stream = fs.createReadStream(
      inputFile
      , { flags: 'r'
        , encoding: 'utf8'
        , fd: null
        , mode: (function () { return parseInt(444, 8); })()
        , bufferSize: 64 * 1024
      });

  fs.exists(inputFile, function(exists) {
    if(!exists) {
      self.emit('error', 'File ' + inputFile + ' does not exist.');
    }

    if (fs.statSync(inputFile).isDirectory()) {
      self.emit('error', 'File ' + inputFile + ' is a directory.');
    }

    stream.on('data', function (chunk) {
      buff += chunk;
      paragraphs = buff.toString().split('\n\n');
      buff = paragraphs.pop() || '';
      paragraphs.forEach(function (p) {
        self.emit('data', p.toString());
      });
    });

    stream.on('end', function () {
      paragraphs.push(buff.toString());
      if (buff !== '') {
        self.emit('data', buff.toString());
      }
      self.emit('end', 'It\'s all done :)');
      stream.destroy();
    });

    stream.on('error', function(){
      self.emit('error', 'Error');
    });

  });
};

module.exports = Reader;

