/*
 * Asset Builder has a quirk that allows custom scripts 
 * to load before Bower scripts during concatenation. 
 * To get around this, use one of the following methods.
 *
 * IIFE
 * (function(){ code goes here }());
 *
 * Self-executing anonymous function
 * var foo = function() { code goes here };
 *
 * document.ready (jQuery)
 * $(document).ready(function() { code goes here });
 * $(function() { code goes here });
 *
 * window.onload (Javascript)
 * window.onload = function() { code goes here };
 *
 *
 *
 */


/**
 * Returns a random integer between min and max values (inclusive)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a uniquely generated random integer array, so we can use this as our order.
 */
function getRandomSequence(limit) {
  var arr = [];
  while (arr.length < limit) {
    var randomnumber = getRandomInt(0, limit - 1);
    var found = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == randomnumber) {
        found = true;
        break;
      }
    }
    if (!found) arr[arr.length] = randomnumber;
  }
  return arr;
}

/**
 * Shows randomly ordered columns in a container.
 */
function orderColumnsRandomly() {
  // Get the children of the container
  var columns = $("#presidentes").children();

  // Empty the container.
  $("#presidentes").html('');

  // Get a random sequence to show the columns
  var sequence = getRandomSequence(columns.length);

  // Loop through the column array with the given sequence and fill the container.
  for (var i = 0; i < sequence.length; i++) {
    $("#presidentes").append($(columns[sequence[i]]));
  }
}

window.onload(orderColumnsRandomly());
