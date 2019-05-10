const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
module.exports = {myCache};

// var obj = { my: "Special", variable: 42 };
// myCache.set( "myKey", obj, function( err, success ){
//   if( !err && success ){
//     console.log( "Node Cache Success: ", success );
//     // true
//     // ... do something ...
    
//   }
//   else {
//     console.log( "Node Cache Error" );
//   }
// });

// myCache.get( "myKey", function( err, value ){
//   if( !err ){
//     if(value == undefined){
//       // key not found
//     }
//     else{
//       console.log( value );
//       //{ my: "Special", variable: 42 }
//       // ... do something ...
//     }
//   }
// });


// myCache2.get( "myKey", function( err, value ){
//     if( !err ){
//         if(value == undefined){
//         // key not found
//         }
//         else{
//         console.log( "Cached Data: ", value );
//         //{ my: "Special", variable: 42 }
//         // ... do something ...
//         }
//     }
//     });
  