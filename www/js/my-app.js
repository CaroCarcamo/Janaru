var $$ = Dom7;

var app = new Framework7({
  root: '#app',
  name: 'My App',
  id: 'com.myapp.test',
  panel: {
    swipe: 'left',
  },
  
  routes: [
    {   path: '/index/', url: 'index.html'  },
    {   path: '/registro/', url: 'registro.html'  },
    {   path: '/recuperoContraseña/', url: 'recuperoContraseña.html'  },
    {   path: '/menuPrincipal/', url: 'menuPrincipal.html'    },
    {   path: '/inventario/', url: 'inventario.html'    },
    {   path: '/reserva/', url: 'reserva.html'    },
    {   path: '/porIngresar/', url: 'porIngresar.html'    },
    {   path: '/porEntregar/', url: 'porEntregar.html'    },
    {   path: '/entregados/', url: 'entregados.html'    },
    {   path: '/productosSinStock/', url: 'productosSinStock.html'    },
    {   path: '/producto/:id', url: 'producto.html'    },
    {   path: '/producto2/:id', url: 'producto2.html'    },
    {   path: '/nuevoProducto/', url: 'nuevoProducto.html'    },
    {   path: '/nuevoProdPorIngresar/', url: 'nuevoProdPorIngresar.html'    },
    {   path: '/nuevoPedido/', url: 'nuevoPedido.html'    },
    {   path: '/pedido/', url: 'pedido.html'    },
    {   path: '/pedidoEnt/', url: 'pedidoEnt.html'    },
    {   path: '/pedido/:id', url: 'pedido.html'    },
  ]

});

var mainView = app.views.create('.view-main');
var db = firebase.firestore();

var item1, item2, item3, item4, item5, item6, item7, item8, item9
var item10, item11, item12, item13, item14, item15, item16, item17, item18, item19
var ProdPedidos

let calendarDefault;
let calendarDateFormat;
let calendarDateTime;
let calendarMultiple;
let calendarRange;
let calendarModal;
let calendarEvents;
let calendarDisabled;
let calendarInline;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    console.log(e);
});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  console.log("Inicia index.");
  idProd = 0;
  idProdPorIng = 0;
  idProdPed = 0;

  db.collection("productos").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      idProd++;
    });
  });

  db.collection("productosPorIng").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      idProdPorIng++;
    });
  });

  db.collection("pedidos").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      idProdPed++;
    });
  });

  $$('#entrar').on('click', function(){
    email = $$('#emailLogin').val();
    password = $$('#passwordLogin').val();
    console.log("e-mail login: " + email);

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
    // Signed in
        var user = userCredential.user;
        console.log("Usuario autenticado.");
  
         mainView.router.navigate('/menuPrincipal/');
         console.log("Entra a menú principal.");
    
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    });    
  });
});


$$(document).on('page:init', '.page[data-name="recuperoContraseña"]', function (e) {
  emailRec = $$('#emailRec').val();
  $$('#entrar').on('click', function(){
      console.log("El mail para el recupero de contraseña es " + emailRec);
  });              
});

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  console.log("Inicia pantalla registro.");  

    $$('#btnRegistrar').on('click', function(){
      nombreR = $$('#nombreReg').val();
      emailR = $$('#emailReg').val();
      passwordR = $$('#passwordReg').val();
      passwordR2 = $$('#passwordReg2').val();
      var datosUsuario = { nombreUsuario: nombreR };
      var idUsuario = emailR;

      db.collection("usuarios").doc(idUsuario).set(datosUsuario)
        .then(function(docRef) {
            console.log("Usuario agregado. - ID: " + docRef.id);
        })
        .catch(function(error) { 
            console.log("Error: " + error);
        });
      
      console.log("El e-mail para el registro es: "+ emailR);
      
      if (emailR != "" && passwordR != "") {
        if (passwordR == passwordR2) {

          firebase.auth().createUserWithEmailAndPassword(emailR, passwordR)
          .then((userCredential) => {
          // Signed in
              var user = userCredential.user;
              console.log("Usuario registrado.");

              firebase.auth().onAuthStateChanged(function(user) {
                console.log("user.displayName: " + user.displayName);
                user
                .updateProfile({ 
                  displayName: nombreR,
              })
              .then(function(){
                console.log("user.displayName: " + user.displayName);
                user.sendEmailVerification();
              });
            });
        
               mainView.router.navigate('/index/');
               console.log("Entra a menú inicio.");
          })
          .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode == 'auth/weak-password') {
                  console.log('Clave muy débil');
                  app.dialog.alert("Contraseña muy débil.","Error");
              } else {
                  console.log(errorCode + "   "  + errorMessage);
              };
            });
        } else {
          app.dialog.alert("Las contraseñas no son iguales.","¡Atención!");
        };
      } else {
        app.dialog.alert("Completa todos los campos.","¡Atención!");
      }
    });
  });

$$(document).on('page:init', '.page[data-name="menuPrincipal"]', function (e) {
    console.log("Inicia menú principal");
    
    var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      calendarInline = app.calendar.create({
        containerEl: '#demo-calendar-inline-container',
        value: [new Date()],
        weekHeader: false,
        renderToolbar: function () {
          return `
          <div class="toolbar calendar-custom-toolbar no-shadow">
            <div class="toolbar-inner">
              <div class="left">
                <a href="#" class="link icon-only"><i class="icon icon-back ${app.theme === 'md' ? 'color-black' : ''}"></i></a>
              </div>
              <div class="center"></div>
              <div class="right">
                <a href="#" class="link icon-only"><i class="icon icon-forward ${app.theme === 'md' ? 'color-black' : ''}"></i></a>
              </div>
            </div>
          </div>
          `;
        },
        on: {
          init: function (c) {
            $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
              calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
              calendarInline.nextMonth();
            });
          },
          monthYearChangeStart: function (c) {
            $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
          }
        }
      });

    $$('#btnInventario').on('click', function(){
        mainView.router.navigate('/inventario/');
        console.log("Click en botón inventario");
    });
    
    $$('#btnReserva').on('click', function(){
        mainView.router.navigate('/reserva/');
        console.log("Click en botón reserva");
    });

    $$('#btnPorIngresar').on('click', function(){
        mainView.router.navigate('/porIngresar/');
        console.log("Click en botón porIngresar");
    });

    $$('#btnPorEntregar').on('click', function(){
        mainView.router.navigate('/porEntregar/');
        console.log("Click en botón porEntregar");
    });

    $$('#btnEntregados').on('click', function(){
        mainView.router.navigate('/entregados/');
        console.log("Click en botón entregados");
    });

    $$('#btnProductosSinStock').on('click', function(){
        mainView.router.navigate('/productosSinStock/');
        console.log("Click en botón productosSinStock");
    }); 

    $$('#btnCerrarSesion').on('click', function(){
      app.dialog.confirm('¿Seguro querés salir?', 'Janaru', function () {
        console.log("Sesión finalizada");
        mainView.router.navigate('/index/');
      });
    });
});

$$(document).on('page:init', '.page[data-name="inventario"]', function (e) {
  console.log("Inicia menú inventario");        

  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });

  db.collection("productos").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      lista_Inv = document.getElementById('listaInv');

      lista_Inv.innerHTML += `<li style="list-style:none" id="` + doc.id + `"/>
      <a href="#" data-id="`+doc.id+`" class="item-link item-content prodInfo">
          <div class="item-media"><i class="icon f7-icons">camera</i></div>
          <div class="item-inner">
          <div class="item-title-row">
              <div id="tituloProd` + doc.id + `" class="item-title">` + doc.data().nombreProd + `</div>
              <div id="cantProd` + doc.id + `" class="item-after">Cant.: ` + doc.data().cant + `</div>
          </div>
          <div id="categProd` + doc.id + `" class="item-subtitle">` + doc.data().tipoProd + `</div>
          <div class="item-text"></div>
          </div>
      </a>
      </li>`

      console.log(doc.id, " => ", doc.data());
    });

    $$('.prodInfo').on('click', function(){
      var prodId = $$(this).data("id");
      detalles(prodId);
    });
  });
});

$$(document).on('page:init', '.page[data-name="reserva"]', function (e) {
    console.log("Inicia menú reserva");   
})

$$(document).on('page:init', '.page[data-name="porIngresar"]', function (e) {
  console.log("Inicia menú porIngresar");

  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });

  db.collection("productosPorIng").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      lista_porIng = document.getElementById('listaPorIng');

      lista_porIng.innerHTML += `<li style="list-style:none" id="` + doc.id + `"/>
      <a href="#" data-id="`+doc.id+`" class="item-link item-content prodInfo2">
          <div class="item-media"><i class="icon f7-icons">camera</i></div>
          <div class="item-inner">
          <div class="item-title-row">
              <div id="tituloProdPorIng` + doc.id + `" class="item-title">` + doc.data().nombreProd + `</div>
              <div id="cantProdPorIng` + doc.id + `" class="item-after">Cant.: ` + doc.data().cant + `</div>
          </div>
          <div id="categProdPorIng` + doc.id + `" class="item-subtitle">` + doc.data().fecha + `</div>
          <div class="item-text"></div>
          </div>
      </a>
      </li>`

      console.log(doc.id, " => ", doc.data());
    });

    $$('.prodInfo2').on('click', function(){
      var prodId2 = $$(this).data("id");
      detalles2(prodId2);
    });
  });
});

$$(document).on('page:init', '.page[data-name="porEntregar"]', function (e) {
   console.log("Inicia menú porEntregar");

   var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });

    db.collection("pedidos").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        listaPorEnt = document.getElementById('listaPorEnt');
        estadoPedido = doc.data().estadoPedido;

        if (estadoPedido == "Por entregar" || estadoPedido == "Entrega por coordinar") {

          listaPorEnt.innerHTML += `<li style="list-style:none" id="` + doc.id + `"/>
          <a href="#" data-id="`+doc.id+`" class="item-link item-content pedidoInfo">
              <div class="item-media"><i class="icon f7-icons">person</i></div>
              <div class="item-inner">
              <div class="item-title-row">
                  <div id="nombreCliente` + doc.id + `" class="item-title">` + doc.data().cliente + `</div>
                  <div id="precioTotal` + doc.id + `" class="item-after">$` + doc.data().total + `</div>
              </div>
              <div id="fechaEnt` + doc.id + `" class="item-subtitle">` + doc.data().fechaEntrega + `</div>
              <div class="item-text"></div>
              </div>
          </a>
          </li>`

          console.log(doc.id, " => ", doc.data());
        }
      });

      $$('.pedidoInfo').on('click', function(){
        var pedidoInfo = $$(this).data("id");
        detallesPedido(pedidoInfo);
      });
    }); 
});

$$(document).on('page:init', '.page[data-name="nuevoPedido"]', function (e) {
  console.log("Inicia menú nuevoPedido"); 

  db.collection("productos").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      lista_pedidos = document.getElementById('selectProd');

      lista_pedidos.innerHTML += `<option>` + doc.data().nombreProd + `</option>`

      console.log("Prod. " + doc.id + " => ", doc.data().nombreProd);
    })
  });

  autocompleteDropdownAll = app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-all',
    openIn: 'dropdown',
    source: function (query, render) {
      var results = ["Por entregar", "Entrega por coordinar", "Entregado", "Cancelado"];
      render(results);
    }
  });

  $$('#btnGuardarPedido').on('click', function(){

    var detallePedido = {
      cliente: $$('#detalle1').val(),
      productos: $$('#detalle2').val(),
      telefono: $$('#detalle3').val(),
      medioContacto: $$('#detalle4').val(),
      metodoEntrega: $$('#detalle5').val(),
      fechaEntrega: $$('#detalle6').val(),
      direccion: $$('#detalle7').val(),
      observaciones: $$('#detalle8').val(),
      total: $$('#detalle9').val(),
      estadoPedido: $$('#autocomplete-dropdown-all').val(),
    }

  idProdPed++;

  db.collection("pedidos").doc('' + idProdPed).set(detallePedido)
    .then(function(docRef) {
        console.log("Producto pedido agregado. - ID: " + docRef.id);
    })
    .catch(function(error) {
        console.log("Error: " + error);
    });

    mainView.router.navigate('/porEntregar/');
        console.log("Click en botón Listo Guardar Pedido.");
  });
});

$$(document).on('page:init', '.page[data-name="entregados"]', function (e) {
  console.log("Inicia menú entregados.");

  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });

  db.collection("pedidos").get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      listaEntregados = document.getElementById('listaEntregados');
      estadoPedido = doc.data().estadoPedido;

      if (estadoPedido == "Entregado") {

        listaEntregados.innerHTML += `<li style="list-style:none" id="` + doc.id + `"/>
        <a href="#" data-id="`+doc.id+`" class="item-link item-content pedidoInfo">
            <div class="item-media"><i class="icon f7-icons">person</i></div>
            <div class="item-inner">
            <div class="item-title-row">
                <div id="nombreCliente` + doc.id + `" class="item-title">` + doc.data().cliente + `</div>
                <div id="precioTotal` + doc.id + `" class="item-after">$` + doc.data().total + `</div>
            </div>
            <div id="fechaEnt` + doc.id + `" class="item-subtitle">` + doc.data().fechaEntrega + `</div>
            <div class="item-text"></div>
            </div>
        </a>
        </li>`

        console.log(doc.id, " => ", doc.data());
      }
    });

    $$('.pedidoInfo').on('click', function(){
      var pedidoInfo = $$(this).data("id");
      detallesPedido(pedidoInfo);
    });
  }); 
});

$$(document).on('page:init', '.page[data-name="productosSinStock"]', function (e) {
   console.log("Inicia menú productosSinStock.");    
});

$$(document).on('page:init', '.page[data-name="producto"]', function (e) {
  console.log("Inicia pantalla de detalle de producto.");

  $$('#i1').html(item1); 
  $$('#i2').html(item2); 
  $$('#i4').html(item4); 
  $$('#i5').html(item5); 
  $$('#i6').html(item6); 
  $$('#i7').html(item7);
  $$('#i8').html(item8); 
  $$('#i9').html(item9);
});

$$(document).on('page:init', '.page[data-name="producto2"]', function (e) {
  console.log("Inicia pantalla de detalle de producto 2.");

  $$('#i10').html(item10); 
  $$('#i11').html(item11); 
  $$('#i13').html(item13); 
  $$('#i14').html(item14); 
  $$('#i15').html(item15); 
  $$('#i16').html(item16);
  $$('#i17').html(item17); 
  $$('#i18').html(item18);
  $$('#i19').html(item19);

});

$$(document).on('page:init', '.page[data-name="pedido"]', function (e) {
  console.log("Inicia pantalla de detalle de pedido.");

  $$('#p1').html(pp1); 
  $$('#p2').html(pp2); 
  $$('#p3').html(pp3); 
  $$('#p4').html(pp4); 
  $$('#p5').html(pp5); 
  $$('#p6').html(pp6);
  $$('#p7').html(pp7); 
  $$('#p8').html(pp8);
  $$('#p9').html(pp9);
  $$('#ppEstado').html(ppEstado);

});

$$(document).on('page:init', '.page[data-name="pedidoEnt"]', function (e) {
  console.log("Inicia pantalla de detalle de pedido entregado.");

  $$('#p10').html(pp10); 
  $$('#p11').html(pp11); 
  $$('#p12').html(pp12); 
  $$('#p13').html(pp13); 
  $$('#p14').html(pp14); 
  $$('#p15').html(pp15);
  $$('#p16').html(pp16); 
  $$('#p17').html(pp17);
  $$('#p18').html(pp18);

});


$$(document).on('page:init', '.page[data-name="nuevoProducto"]', function (e) {
  console.log("Inicia menú Nuevo Producto.");   

  $$('#btnListoInv').on('click', function(){

    var datosProd = {
        nombreProd: $$('#caract1').val(),
        tipoProd: $$('#caract2').val(),
        precio: $$('#caract4').val(),
        cant: $$('#caract5').val(),
        talle: $$('#caract6').val(),
        color: $$('#caract7').val(),
        sabor: $$('#caract8').val(),
        otraVariante: $$('#caract9').val(),
    }

    idProd++;

    db.collection("productos").doc('' + idProd).set(datosProd)
    .then(function(docRef) {
        console.log("Producto agregado. - ID: " + docRef.id);
    })
    .catch(function(error) {
        console.log("Error: " + error);
    });

    mainView.router.navigate('/inventario/');
        console.log("Click en botón Listo.");
  });
});

$$(document).on('page:init', '.page[data-name="nuevoProductoPorIngresar"]', function (e) {
  console.log("Inicia menú Nuevo Producto Por Ingresar.");   

  $$('#btnListoPorIng').on('click', function(){

    var datosProdPorIng = {
        nombreProd: $$('#caract10').val(),
        tipoProd: $$('#caract11').val(),
        precio: $$('#caract13').val(),
        cant: $$('#caract14').val(),
        fecha: $$('#caract15').val(),
        talle: $$('#caract16').val(),
        color: $$('#caract17').val(),
        sabor: $$('#caract18').val(),
        otraVariante: $$('#caract19').val(),
    }

    idProdPorIng++;

    db.collection("productosPorIng").doc('' + idProdPorIng).set(datosProdPorIng)
    .then(function(docRef) {
        console.log("Producto agregado. - ID: " + docRef.id);
    })
    .catch(function(error) {
        console.log("Error: " + error);
    });

    mainView.router.navigate('/porIngresar/');
        console.log("Click en botón Listo Por Ingresar.");
  });
});

function detalles(id) {
  let idElegido
  db.collection("productos").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (id == doc.id) {
          item1 = doc.data().nombreProd;
          item2 = doc.data().tipoProd;
          item4 = doc.data().precio;
          item5 = doc.data().cant;
          item6 = doc.data().talle;
          item7 = doc.data().color;
          item8 = doc.data().sabor;
          item9 = doc.data().otraVariante;

          idElegido = doc.id; 
        }       
      });
      mainView.router.navigate("/producto/" + idElegido);
    })
    .catch(function(error) {
      console.log("Error: ", error);
    });

  console.log("doc.id = " + id);
}

function detalles2(id2) {
  let idElegido2
  db.collection("productosPorIng").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (id2 == doc.id) {
          item10 = doc.data().nombreProd;
          item11 = doc.data().tipoProd;
          item13 = doc.data().precio;
          item14 = doc.data().cant;
          item15 = doc.data().fecha;
          item16 = doc.data().talle;
          item17 = doc.data().color;
          item18 = doc.data().sabor;
          item19 = doc.data().otraVariante;

          idElegido2 = doc.id; 
        }       
      });
      mainView.router.navigate("/producto2/" + idElegido2);
    })
    .catch(function(error) {
      console.log("Error: ", error);
    });

  console.log("doc.id = " + id2);
}

function detallesPedido(idPed) {
  let idElegido2
  db.collection("pedidos").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (idPed == doc.id) {
          pp1 = doc.data().cliente;
          pp2 = doc.data().nombreProd;
          pp3 = doc.data().telefono;
          pp4 = doc.data().medioContacto;
          pp5 = doc.data().metodoEntrega;
          pp6 = doc.data().fechaEntrega;
          pp7 = doc.data().direccion;
          pp8 = doc.data().observaciones;
          pp9 = doc.data().total;
          ppEstado = doc.data().estadoPedido;

          idElegidoPed = doc.id; 
        }       
      });
      mainView.router.navigate("/porEntregar/" + idElegidoPed);
    })
    .catch(function(error) {
      console.log("Error: ", error);
    });

  console.log("ID pedido por entregar: " + idPed);
}

function detallesPedidoEnt(idPedEnt) {
  let idElegido2
  db.collection("pedidosEnt").get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (idPedEnt == doc.id) {
          pp10 = doc.data().cliente;
          pp11 = doc.data().nombreProd;
          pp12 = doc.data().telefono;
          pp13 = doc.data().medioContacto;
          pp14 = doc.data().metodoEntrega;
          pp15 = doc.data().fechaEntrega;
          pp16 = doc.data().direccion;
          pp17 = doc.data().observaciones;
          pp18 = doc.data().total;

          idElegidoPedEnt = doc.id; 
        }       
      });
      mainView.router.navigate("/porEntregar/" + idElegidoPedEnt);
    })
    .catch(function(error) {
      console.log("Error: ", error);
    });

  console.log("Pedido entregado = " + doc.data().cliente);
}

