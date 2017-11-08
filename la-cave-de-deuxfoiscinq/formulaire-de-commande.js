"use strict";

var url = "carte-des-vins.json";
var xhr = new XMLHttpRequest();
var debug = false;
var fraisDePort = 15;

main();

function main()
{
  xhr.open( "GET", url );
  xhr.send( null );

  xhr.addEventListener( "load",  displayJSONinHTML );
  xhr.addEventListener( "error", xhrDisplayStatus );
}

function xhrDisplayStatus()
{
  if( debug || xhr.status !== 200 )
    console.log( "Code de réponse HTTP = " + xhr.status );
}

function displayJSONInConsole( responseJSON )
{
  for( let i=0; i<responseJSON.length; i++ )
  {
    let vigneron = responseJSON[ i ];
    console.log( vigneron );
    console.log( vigneron.DOMAINE + " | " + vigneron.CAVE + " | " + vigneron.NOM + " | " + vigneron.URL );
    console.log( vigneron.VINS );
    console.log( vigneron.VINS.length );
    // if( vigneron.VINS != undefined )
    // {
      for( let j=0; j<vigneron.VINS.length; j++ )
      {
        let vin = vigneron.VINS[ j ];
        console.log( vin );
        console.log(
                    vin.ID_VIN
          + " | " + vin.APPELLATION
          + " | " + vin.CEPAGE
          + " | " + vin.ANNEE
          + " | " + vin.COULEUR
          + " | " + vin.PRIX
          + " | " + vin.QUANTITE
          + " | " + vin.DISPONIBLE
          + " | " + vin.REMARQUES
        );
      }
    // }
  }
}

function displayJSONinHTML()
{
  xhrDisplayStatus();
  let responseJSON = JSON.parse( xhr.responseText );
  if( debug )
    displayJSONInConsole( responseJSON );
  let htmlTarget = document.getElementById( "formulaire" );
  try
  {
    var htmlElems = '<div class="container-fluid">';
    for( let i=0; i<responseJSON.length; i++ )
    {
      let vigneron = responseJSON[ i ];
      htmlElems += `
          <div id="vigneron-${ vigneron.ID_VIGNERON }" class="row " style="border-bottom: 4px solid; margin-top: 20px; font-size: 16pt; font-style: italic">
            <a href="${ vigneron.URL }" target="_blank" title="${ vigneron.DOMAINE }">
              ${ vigneron.DOMAINE } &bull;
              ${ vigneron.CAVE } &bull;
              ${ vigneron.NOM }
            </a>
          </div>
        `;

      let cptVins = 0;
      for( let j=0; j<vigneron.VINS.length; j++ )
      {
        let vin = vigneron.VINS[ j ];
        if( vin.DISPONIBLE !== "" )
        {
          let backColor = "white";
          if( cptVins % 2 ) backColor = "#EEE";
          cptVins += 1;
          let nomInput = vin.ID_VIN + " | " + vin.PRIX;
          let remarques = "";
          if( vin.REMARQUES !== "" ) {
            remarques = `<div class="col-xs-12 col-sm-12"  > <small class="text-muted">${ vin.REMARQUES }&nbsp;</small></div>`;
          }

          htmlElems += `
            <div id="vin-${ vin.ID_VIN }" class="row" style="margin-top:5px; background-color: ${ backColor };">
              <div class="col-xs-10 col-sm-10">
                <div class="row" style="padding: 8px 0;">
                    <div class="col-xs-12 col-sm-9"> <em>${ vin.APPELLATION } &#10687; ${ vin.CEPAGE } &#10687; ${ vin.ANNEE }&nbsp;&#10687;&nbsp;${ vin.COULEUR }</em></div>
                    <div class="col-xs-12 col-sm-3 text-right"> ${ vin.PRIX } CHF</div>
                    ${ remarques }
                </div>
              </div>
              <div class="col-xs-2 col-sm-2" style="padding: 4px;">
                  <input name="${ nomInput }" type="number" min="0" class="text-center cptBouteilles" onchange="calculTotal()" />
              </div>
            </div>
          `;
        }
      }
    }

    htmlElems +=`
    <div class="row" style="margin-top: 20px;">
      <div class="col-xs-8  col-sm-10 text-right">nombre de bouteilles commandées</div>
      <div class="col-xs-4  col-sm-2  text-center"><p style="padding-right:30px;" id="nbBouteilles" class="text-right">0</p></div>
    </div>
    <div class="row">
      <div class="col-xs-8  col-sm-10 text-right">total de la commande (CHF)</div>
      <div class="col-xs-4  col-sm-2  text-center"><p style="padding-right:30px;" id="total1" class="text-right">0.00</p></div>
    </div>
    <div class="row">
      <div class="col-xs-8  col-sm-10 text-right">frais d’emballage et de livraison (CHF)</div>
      <div class="col-xs-4  col-sm-2  text-right"><p style="padding-right:30px;">${ fraisDePort.toFixed( 2 ) }</p></div>
    </div>
    <div class="row">
      <div class="col-xs-8  col-sm-10 text-right"><strong>total avec TVA 8% incluse&nbsp;(CHF)</strong></div>
      <div class="col-xs-4  col-sm-2  text-right"><p style="padding-right:30px;" id="total2"><strong>0.00</strong></p></div>
    </div>

    <div class="row" style="margin-top:30px;">
      <div class="col-xs-12" style="border-bottom: 4px solid"><h3>conditions de vente</h3></div>
      <div class="col-xs-12" style="margin-top: 10px;">
        <p style="margin:0px; line-height: 15px">commande minimum de 3 bouteilles de 50 cl (panachage possible)</p>
        <p style="margin:0px; line-height: 15px">emballage de 3, 8 ou 15 bouteilles</p>
        <p style="margin:0px; line-height: 15px">paiement sur facture à 10 jours net – prix indiqués en CHF, TVA 8% comprise, départ cave</p>
        <p style="margin:0px; line-height: 15px">frais d’emballage et de livraison CHF 15.– TTC</p>
        <p style="margin:0px; line-height: 15px">livraison en suisse</p>
        <p style="margin:0px; line-height: 15px">offre valable jusqu’au 31 janvier 2018</p>
      </div>
    </div>

    <div class="row" style="margin-top:30px;">
      <div class="row" style="margin:15px 0;">
        <div class="col-xs-12" style="border-bottom: 4px solid;"><h3>adresse de facturation</h3></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>nom et prénom</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-facturation-nom" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>rue</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-facturation-rue" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>npa et localité</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-facturation-npa-localite" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>no de téléphone</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-facturation-telephone" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>adresse email</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-facturation-mail" type="email" class="" /></div>
      </div>
    </div>

    <div class="row" style="margin-top:30px;">
      <div class="row" style="margin:15px 0;">
        <div class="col-xs-12" style="border-bottom: 4px solid;"><h3>adresse de livraison</h3></div>
        <div class="col-xs-12" style="margin: 12px 0 4px"><p><small class="text-muted">à remplir uniquement si l’adresse de livraison est différente de&nbsp;l’adresse de facturation</small></p></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>nom et prénom</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-livraison-nom" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>rue</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-livraison-rue" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>npa et localité</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-livraison-npa-localite" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>no de téléphone</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="adresse-livraison-telephone" type="text" class="" /></div>
      </div>
      <div class="row" style="margin-top:5px;">
        <div class="col-sm-4 col-xs-12" style="margin: 0px;"><label>adresse email</label></div>
        <div class="col-sm-8 col-xs-12" style="margin: 0px;"><input name="_replyto" type="email" class="" /></div>
      </div>
    </div>

    <div class="row" style="margin-top:30px;">
      <div class="col-xs-12" style="border-bottom: 4px solid"><h3>renseignements</h3></div>
      <div class="col-xs-12" style="margin: 12px 0 0px"><p class="text-center">si tu as des questions concernant ta commande, tu peux me contacter à l’adresse <a href="mailto:jisse@deuxfoiscinq.ch">jisse@deuxfoiscinq.ch</a></p></div>
    </div>

    <div class="row" style="margin-top:60px;">

      <div class="col-xs-12" style="margin: 12px 0 4px"><p class="text-center"><small class="text-muted">je t’enverrai un email de confirmation dans les 24 h ouvrables</small></p></div>
      <div class="col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1" style="margin-top: 3px;">
        <button type="submit" class="btn btn-block" style="height:50px;">ENVOYER LA COMMANDE</button>
      </div>
    </div>

    <input type="text" name="_format" value="plain" style="display:none" />
    <input type="hidden" name="_language" value="fr" />
    <input type="text" name="_gotcha" style="display:none" />
    <input type="hidden" name="_cc" value="&#110;&#106;&#100;&#064;&#098;&#108;&#117;&#101;&#119;&#105;&#110;&#046;&#099;&#104;,&#106;&#105;&#115;&#115;&#101;&#064;&#100;&#101;&#117;&#120;&#102;&#111;&#105;&#115;&#099;&#105;&#110;&#113;&#046;&#099;&#104;" />
    </div> <!-- .container-fluid -->
    `;
    htmlTarget.innerHTML = htmlElems;
  }
  catch( err )
  {
    htmlTarget.innerHTML = "ERREUR displayJSONinHTML";
  }
}


function calculTotal()
{
  var bouteilles = document.getElementsByClassName( "cptBouteilles" );
  var total1 = document.getElementById( "total1" );
  var total2 = document.getElementById( "total2" );
  var nbBouteilles = document.getElementById( "nbBouteilles" );

  let prixTotal = 0;
  let nbBouteillesCpt = 0;
  for( let i=0; i<bouteilles.length; i++ )
  {
    if( bouteilles[ i ].value != "" )
    {
      let prix = bouteilles[ i ].name.split( " | " )[ 1 ];
      nbBouteillesCpt += parseInt( bouteilles[ i ].value );
      prixTotal += prix * bouteilles[ i ].value;
    }
  }
  nbBouteilles.innerHTML = nbBouteillesCpt;
  total1.innerHTML = prixTotal.toFixed( 2 );
  total2.innerHTML = "<strong>" + (prixTotal + fraisDePort).toFixed( 2 ) + "</strong>";
}
