
"use strict";


$( document ).ready( function() {



  // Ajoute target="_blank" aux liens externes.
  ( function() {
    var internal = location.host.replace( "www.", "" );
    internal = new RegExp( internal, "i" );
    var a = document.getElementsByTagName( 'a' );
    for( var i = 0; i < a.length; i++ ) {
      var href = a[ i ].host;
      if( !internal.test( href ) ) {
        a[ i ].setAttribute( 'target', '_blank' );
      }
    }
  })();




});