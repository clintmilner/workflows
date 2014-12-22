$ = require 'jquery'

do fill = (item = 'The most creative minds in Fart') ->
  $( '.tagline' ).append "#{item}"
fill