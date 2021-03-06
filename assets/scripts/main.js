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

/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

    // Use this variable to set up the common and page specific functions. If you
    // rename this variable, you will also need to rename the namespace below.
    var Sage = {
        // All pages
        'common': {
            init: function() {
                // JavaScript to be fired on all pages
                $('body').on('click', '.js-nav-toggle', function(event) {
                    event.preventDefault();
                    if ($('#navbar').is(':visible')) {
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                    }
                });

            },
            finalize: function() {
                // JavaScript to be fired on all pages, after page specific JS is fired
            }
        },
        // Home page

        'index': {
            init: function() {
                // JavaScript to be fired on the calculadora

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

                orderColumnsRandomly();


            },
            finalize: function() {
                // JavaScript to be fired on the home page, after the init JS
            }
        },
        'candidato': {
            init: function() {
                // JavaScript to be fired on the calculadora
                function tabla(titulo, imagen, resumen, url) {
                    var html = '<div class="row m-tp noticias"><div class="col-md-2"><img src="' + imagen + '"></div><div class="col-md-10"><a class="smallURL" href="' + url + '">' + titulo + '</a><p class="smallText">' + resumen + '</p>';
                    $('.row').last().after(html);
                    $('html, body').animate({
                        scrollTop: $('.row').last().offset().top
                    }, 2000);
                }

                $("button").click(function() {
                    var categoria = $(this).attr('id');
                    var candidato = $('body').data('candidato');
                    var url = 'https://fakenews-mx.herokuapp.com/FEED';
                    //var devurl = 'https://fakenews-developer.herokuapp.com/FEED';
                    $.ajax({
                        type: "GET",
                        url: url,
                        crossDomain: true,
                        dataType: 'json',
                        data: { "categoria": categoria, "candidato": candidato },
                        success: function(data) {
                            console.log(data);
                            $('.noticias').remove();
                            var leng_json = data.length;
                            for (var i = 0; i < leng_json; i++) {
                                tabla(data[i].titulo, data[i].img, data[i].resumen, data[i].url);
                            }
                        },
                        failure: function(data) {
                            console.log(data);
                        }
                    });
                });

            },
            finalize: function() {
                // JavaScript to be fired on the home page, after the init JS
            }
        },
        'verificador': {
            init: function() {
                // JavaScript to be fired on the calculadora
                $("#checkurl").submit(function() {
                    var url = 'https://fakenews-mx.herokuapp.com/ARTICLE';
                    //var devurl = 'https://fakenews-developer.herokuapp.com/ARTICLE';
                    var url2 = $("#url").val();
                    console.log(url2);
                    $.ajax({
                        type: "GET",
                        url: url,
                        crossDomain: true,
                        data: { "url": url2 },
                        success: function(data) {
                            console.log(data);
                            var html = "";
                            if (data == "El sitio es confiable") {
                                html = "<img src='dist/images/cierto.png'> <h2>La noticia es confiable</h2>"
                            } else if (data == "NoConfiable") {
                                html = "<img src='dist/images/falso.png'> <h2>¡Ten cuidado!</h2><h4>Como dijeran nuestros abuelos, no creas todo lo que te dicen. Esta noticia no se ve tan cierta, así que ten cuidado.</h4>"
                            } else if (data == "NoCat/NoPresidencial") {
                                html = "<img src='dist/images/thinking.png'> <h2>¡La noticia no es de las elecciones!</h2><h4>Ahorita me estoy concentrando en aprender de este tema y de las categoria que creo que mi amo, pronto podrás hablar de más temas.</h4>"
                            }  else {
                                html = "<img src='dist/images/thinking.png'><h2>Nuestro sistema está confundido</h2><h4>Trabajamos arduamente para mejorar nuestro sistema, ¡para la siguiente ya no ocurrirá!</h4>"
                            }

                            $("#results").html(html);
                        },
                        failure: function(data) {
                             var html = " <img src='dist/images/error.png'> <h2>Lo siento, ocurrió un error.</h2> <h4><a href='contacto.html'>Dinos que ocurrió para solucionarlo.</a></h4>"
                            $("#results").html(html);
                            console.log(data);
                        }
                    });
                    return false;
                });

            },
            finalize: function() {
                // JavaScript to be fired on the home page, after the init JS
            }
        }

    };

    // The routing fires all common scripts, followed by the page specific scripts.
    // Add additional events for more control over timing e.g. a finalize event
    var UTIL = {
        fire: function(func, funcname, args) {
            var fire;
            var namespace = Sage;
            funcname = (funcname === undefined) ? 'init' : funcname;
            fire = func !== '';
            fire = fire && namespace[func];
            fire = fire && typeof namespace[func][funcname] === 'function';

            if (fire) {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function() {
            // Fire common init JS
            UTIL.fire('common');

            // Fire page-specific init JS, and then finalize JS
            $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
                UTIL.fire(classnm);
                UTIL.fire(classnm, 'finalize');
            });

            // Fire common finalize JS
            UTIL.fire('common', 'finalize');
        }
    };

    // Load Events
    $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
