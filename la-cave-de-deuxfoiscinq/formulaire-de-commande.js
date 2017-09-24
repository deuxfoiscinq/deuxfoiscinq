"use strict";

var url = "carte-des-vins.json";
var xhr = new XMLHttpRequest();
var debug = false;
var fraisDePort = 12;

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
    console.log( vigneron.DOMAINE  + " | " + vigneron.CAVE  + " | " + vigneron.NOM );
    for( let j=0; j<vigneron.VINS.length; j++ )
    {
      let vin = vigneron.VINS[ i ];
      console.log( vin );
      console.log(
                  vin.AOC
        + " | " + vin.CEPAGE
        + " | " + vin.NOM
        + " | " + vin.CEPAGE_2
        + " | " + vin.COULEUR
        + " | " + vin.REGION
        + " | " + vin.ANNEE
        + " | " + vin.INFORMATIONS_COMPLEMENTAIRES
        + " | " + vin.PRIX
      );
    }
  }
}

function displayJSONinHTML()
{
  xhrDisplayStatus();
  let responseJSON = JSON.parse( xhr.responseText );
  if( debug )
    displayJSONInConsole( responseJSON );
  let htmlTarget = document.getElementById( "formulaire" );
  let cptVins = 0;
  try
  {
    var htmlElems = '<div class="container-fluid">';
    for( let i=0; i<responseJSON.length; i++ )
    {
      let vigneron = responseJSON[ i ];
      htmlElems += `
          <div class="row " style="border-bottom: 4px solid; margin-top: 20px; font-size: 16pt; font-style: italic">
            <a href="${ vigneron.URL }" target="_blank" title="${ vigneron.DOMAINE }">
              ${ vigneron.DOMAINE } &bull;
              ${ vigneron.CAVE } &bull;
              ${ vigneron.NOM }
            </a>
          </div>
        `;

      for( let j=0; j<vigneron.VINS.length; j++ )
      {
        let vin = vigneron.VINS[ j ];
        let aoc = "—";
        if( vin.AOC != "" )
          aoc = "AOC&nbsp";
        let backColor = "white";
        if( j % 2 ) backColor = "#EEE";
        cptVins += 1;
        let nomInput = vin.REFERENCE + " | " + vin.PRIX;

        htmlElems += `
          <div class="row" style="margin-top:5px; background-color: ${ backColor };">
            <div class="col-xs-8 col-sm-10">
              <div class="row">
                  <div class="col-xs-6                 col-sm-4                "> <em>${ vin.CEPAGE }</em></div>
                  <div class="col-xs-6                 col-sm-4                "> <em>${ vin.NOM }</em></div>
                  <div class="col-xs-6                 col-sm-4                "> ${ vin.CEPAGE_2 }</div>
                  <div class="col-xs-6                 col-sm-4                "> ${ vin.REGION }</div>
                  <div class="col-xs-6                 col-sm-2                "> ${ vin.ANNEE }</div>
                  <div class="col-xs-6                 col-sm-2                "> ${ vin.COULEUR }</div>
                  <div class="col-xs-6 col-xs-offset-6 col-sm-4 col-sm-offset-0"> ${ vin.PRIX } CHF</div>
                  <div class="col-xs-6                 col-sm-12               "  > <small class="text-muted">${ aoc } ${ vin.INFORMATIONS_COMPLEMENTAIRES }&nbsp;</small></div>
              </div>
            </div>
            <div class="col-xs-4 col-sm-2" style="margin-top:15px">
                <input name="${ nomInput }" type="number" min="0" class="text-center cptBouteilles" onchange="calculTotal()" />
            </div>
          </div>
        `;
      }
    }

    htmlElems +=`
    <div class="row">
      <div class="col-xs-8  col-sm-10 text-right">total des bouteilles commandées (CHF)</div>
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
        <p style="margin:0px; line-height: 15px">livraison en Suisse uniquement</p>
        <p style="margin:0px; line-height: 15px">paiement sur facture à 10 jours net</p>
        <p style="margin:0px; line-height: 15px">commande minimum de 3 bouteilles</p>
        <p style="margin:0px; line-height: 15px">emballage de 3, 6 ou 12 bouteilles</p>
        <p style="margin:0px; line-height: 15px">panachage possible</p>
        <p style="margin:0px; line-height: 15px">les prix sont indiqués en CHF et TVA 8% incluse</p>
        <p style="margin:0px; line-height: 15px">frais d’emballage et de livraison ${ fraisDePort } CHF</p>
        <p style="margin:0px; line-height: 15px">les marchandises vendues ne sont ni reprises ni échangées</p>
        <p style="margin:0px; line-height: 15px">le for juridique pour toute réclamation en relation avec votre commande est Lausanne en Suisse</p>
      </div>
    </div>

    <div class="row" style="margin-top:30px;">
      <div class="row" style="margin:15px 0;">
        <div class="col-xs-12" style="border-bottom: 4px solid;"><h3>adresse de livraison</h3></div>
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
      <div class="row" style="margin:15px 0;">
        <div class="col-xs-12" style="border-bottom: 4px solid;"><h3>adresse de facturation</h3></div>
        <div class="col-xs-12" style="margin: 12px 0 4px"><p><small class="text-muted">à remplir uniquement si l’adresse de facturation différente de&nbsp;l’adresse de livraison</small></p></div>
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
      <div class="col-xs-12" style="border-bottom: 4px solid"><h3>renseignements</h3></div>
      <div class="col-xs-12" style="margin: 12px 0 0px"><p class="text-center">si vous avez des questions concernant votre commande, vous pouvez me contacter à l’adresse <a href="mailto:jisse@deuxfoiscinq.ch">jisse@deuxfoiscinq.ch</a></p></div>
    </div>

    <div class="row" style="margin-top:60px;">

      <div class="col-xs-12" style="margin: 12px 0 4px"><p><small class="text-muted">je vous enverrai un email de confirmation de réception de votre commande dans les 24 h ouvrables</small></p></div>
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

  let prixTotal = 0;
  for( let i=0; i<bouteilles.length; i++ )
  {
    let prix = bouteilles[ i ].name.split( " | " )[ 1 ];
    prixTotal += prix * bouteilles[ i ].value;
  }
  total1.innerHTML = prixTotal.toFixed( 2 );
  total2.innerHTML = (prixTotal + fraisDePort).toFixed( 2 );;
}
