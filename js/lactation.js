// code by Giovanni Zambotti - 23 January 2020
// update to ESRI JS 4.14 - 23 January 2020
// code update - 13 April 2020

require([
      "esri/Map",
      "esri/views/MapView",      
      "esri/widgets/Locate",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",      
      "esri/renderers/SimpleRenderer",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/renderers/UniqueValueRenderer",
      "esri/geometry/Extent",
      "esri/widgets/Popup",
      "esri/layers/VectorTileLayer", 
      
      // Calcite Maps
      "calcite-maps/calcitemaps-v0.8",

      // Calcite Maps ArcGIS Support
      "calcite-maps/calcitemaps-arcgis-support-v0.8",

      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",
      "bootstrap/Tab",
      // Can use @dojo shim for Array.from for IE11
      "@dojo/framework/shim/array",

      "dojo/domReady!"
    ], //function(Map, MapView, FeatureLayer, GraphicsLayer,Graphic, MapImageLayer, TileLayer, SimpleRenderer, SimpleMarkerSymbol, 
      //SimpleFillSymbol, UniqueValueRenderer) {
      function(Map, MapView, Locate, FeatureLayer, GraphicsLayer, Graphic, SimpleRenderer, SimpleMarkerSymbol, 
      SimpleFillSymbol, UniqueValueRenderer, Extent, Popup, VectorTileLayer, CalciteMaps, CalciteMapsArcGIS) {    
      
      const regionsList = {
        Allston: [-71.1237912, 42.3626648],
        Arboretum: [-71.1333697, 42.295822],
        Cambridge: [-71.1168498, 42.3759086],
        Longwood: [-71.1024294, 42.3389915],
        Forest: [-72.190308, 42.5313531]
      } 

      //document.getElementById("foo").style.display = "none"; 
      var myzoom = 14, lon = -71.116076, lat = 42.35800;

      var xMax = -7915458.81211143;
      var xMin = -7917751.9229597915;
      var yMax = 5217414.497463334;
      var yMin = 5216847.191394078;

      var vtlLayer = new VectorTileLayer({
        // URL to the vector tile service
        url: "https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json"
      });     
     
      var lactationURL = "https://devtmap.cadm.harvard.edu/server/rest/services/Hosted/lactationroom04132020/FeatureServer"
      var lactationPopup = { // autocasts as new PopupTemplate()
        title: "{buildingroomname}"
      };
      
      var buildingRenderer = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
          color: [0, 121, 193, 0.5],
          style: "solid",
          outline: {
            width: 1.2,
            color: "blue"
          }
        })
      });
  
      var lactationLayer = new FeatureLayer({
        url: lactationURL,
        outFields: ["*"],
        visible: true,
        renderer: buildingRenderer
      });        
      // GraphicsLayer for displaying results
      var resultsLayer = new GraphicsLayer();

      var map = new Map({
        basemap: "topo",
        layers: [lactationLayer, resultsLayer],

      });

      var view = new MapView({
        container: "mapViewDiv",
        map: map,
        center: [lon, lat], /*-71.11607611178287, 42.37410778220068*/
        zoom: myzoom,        
        padding: {top: 50, bottom: 0}, 
        breakpoints: {xsmall: 768, small: 769, medium: 992, large: 1200}        
      });
      
      lactationLayer.popupTemplate = lactationPopup;

      // Disables map rotation
      view.constraints = {rotationEnabled: false};
     
      view.popup.dockOptions = {position: "bottom-left"}
                  
      /********************************
      * Create a locate widget object.
      *********************************/        
      var locateBtn = new Locate({view: view});

      // Add the locate widget to the top left corner of the view
      view.ui.add(locateBtn, {position: "top-left"});

      // add on mouse click on a map, clear popup and open it     
      view.on("click", function(evt) {        
        evt.stopPropagation()                       
        var infoBuildings = document.getElementById("infoBuildings");  
        //console.log(infoBuildings)          
        infoBuildings.options[0].selected = true;        
        var screenPoint = evt.screenPoint;        
        // set location for the popup
        view.popup.location = evt.mapPoint;
        view.popup.visible = false;
        view.hitTest(screenPoint).then(getSingleBuilding);                
      });
      
      // create the popup and select the building footprint          
      function getSingleBuilding(response) {
        resultsLayer.popupTemplate = lactationPopup;         
        resultsLayer.removeAll();
        var graphic = response.results[0].graphic;
        var attributes = graphic.attributes;        
        var name = attributes.Primary_Building_Name;
        var infoBuildings = document.getElementById("infoBuildings");
        
        var pGraphic = new Graphic({
          geometry: response.results[0].graphic.geometry,
          symbol: new SimpleFillSymbol({
            color: [ 255,0, 0, 0.4],
            style: "solid",
            outline: {  // autocasts as esri/symbols/SimpleLineSymbol
              color: "red",
              width: 2
            }
          })
        });
        
        resultsLayer.add(pGraphic);

        var image = attributes.image;

        // create content for the popup
        var popupDiv = document.createElement("img")
        var zimg = "https://devsmap.cadm.harvard.edu/images/root_images/" + image;
        popupDiv.src = zimg;
        popupDiv.alt = attributes.primary_building_name + " building image";

        var popupHref = document.createElement("a");
        var createAText = document.createTextNode('Lactation Support');
        popupHref.setAttribute('href', attributes.firsttime);
        popupHref.target = '_blank';
        popupHref.appendChild(createAText);
        
        var firsttimeregistration = attributes.firsttime;        
        var alreadyregistered = attributes.alreadyregistered;
        var privatespaces = attributes.privatespaces;
        var reservationonly = attributes.reservationonly;
        var dropin = attributes.drop_in;
        var dooraccess = attributes.dooraccess;
        var pumpmedelasymphony = attributes.pump;
        var sink = attributes.sink;
        var refrigerator = attributes.refrigerator;
        var additionalnotes = attributes.notes;

        //console.log(popupHref.outerHTML)

        if(image == '02845.jpg' || image == '02805.jpg' || image == '02121.jpg' || image == '06318.jpg' || image == '02124.jpg' || image == '01208.jpg'){
          var zcontent = "<p><ul><li>First Time Registration: " + popupHref.outerHTML + "</li><li>Already Registered: " + alreadyregistered + "</li><li>Private Space: " + privatespaces + "</li><li>Reservation Online: " + reservationonly + "</li><li>Drop In: " + dropin + "</li><li>Door Access: " + dooraccess + "</li><li>Pump Medela: " + pumpmedelasymphony + "</li><li>Sink: " + sink + "</li><li>Refrigerator: " + refrigerator + "</li><li>Additional Notes: " + additionalnotes + "</li></ul></p>"
        }
        else{
          var zcontent = popupDiv.outerHTML + "<p><ul><li>First Time Registration: " + popupHref.outerHTML + "</li><li>Already Registered: " + alreadyregistered + "</li><li>Private Space: " + privatespaces + "</li><li>Reservation Online: " + reservationonly + "</li><li>Drop In: " + dropin + "</li><li>Door Access: " + dooraccess + "</li><li>Pump Medela: " + pumpmedelasymphony + "</li><li>Sink: " + sink + "</li><li>Refrigerator: " + refrigerator + "</li><li>Additional Notes: " + additionalnotes + "</li></ul></p>"
        }        
        //var zcontent = popupDiv.outerHTML + "<p><ul><li>First Time Registration: " + firsttimeregistration + "</li><li>Already Registered: " + alreadyregistered + "</li><li>Private Space: " + privatespaces + "</li><li>Reservation Online: " + reservationonly + "</li><li>Drop In: " + dropin + "</li><li>Door Access: " + dooraccess + "</li><li>Pump Medela Symphonys: " + pumpmedelasymphony + "</li><li>Sink: " + sink + "<li>Refrigerator: " + refrigerator + "</li></ul></p>"
        view.popup.open({
          title: attributes.primary_building_name,
          content: zcontent
        });        
      } 

      /********************************
      * Process the regions selection
      *********************************/  

      function queryLactationRegion(myval) {
        var query = lactationLayer.createQuery();
        query.where = "region = '" + myval + "'"
        query.orderByFields = ['primary_building_name ASC']
        return lactationLayer.queryFeatures(query);        
      }
                 
      var regions = document.getElementById("infoRegions");
      var infoBuildings = document.getElementById("infoBuildings");  

      regions.addEventListener("change", function() {        
        var selectedRegions = regions.options[regions.selectedIndex].value;        
        // remove all the buildings from the options select
        for (i = 1; i < infoBuildings.length; i++) {             
            infoBuildings.remove(i); 
            i--;           
        }        

        if(infoBuildings.length == 1){
          var list = document.getElementById('infoBuildings');
          var option = document.createElement('option');                
          option.text = 'Select a buildings...';                        
          option.setAttribute('selected', true);
          option.setAttribute('disabled', true);
          option.setAttribute('hidden', true);
          list.add(option);
          console.log(infoBuildings.length) 
        }

        const keys = Object.entries(regionsList)
          for (const key of keys) {            
            if(key[0] == selectedRegions){
              //console.log(key[1], key[0])
              view.center = key[1]
              view.zoom = 16;
              queryLactationRegion(selectedRegions).then(resultsLactationQuery);            
            }            
        }
      });
      
      /********************************
      * Process to select a specific building
      *********************************/  
      function resultsLactationQuery(results) { 
        var list = document.getElementById('infoBuildings');
        var obj = results.features;
        //console.log(obj)
        for(var i in obj){                      
          var option = document.createElement('option');                
          option.text = obj[i].attributes.primary_building_name;
          option.value = obj[i].attributes.primary_building_name;
          list.add(option);          
        }
      }

      var buildingInfo = document.getElementById("infoBuildings");

      buildingInfo.addEventListener("change", function() {        
        var selectedBuildings = buildingInfo.options[buildingInfo.selectedIndex].value;        
        console.log(selectedBuildings)
        //queryLactationBuldings(selectedBuildings)
        queryLactationBuldings(selectedBuildings).then(displayResultsBuldings);
        //view.popup.visible = true;
      });

      function queryLactationBuldings(myval) {
        var query = lactationLayer.createQuery();
        query.where = "primary_building_name = '" + myval + "'";
        query.outSpatialReference = 4326;
        console.log(query)
        return lactationLayer.queryFeatures(query);        
      }      

      function displayResultsBuldings(results) {   
        resultsLayer.removeAll();
        var features = results.features.map(function(graphic) {
          graphic.symbol = new SimpleFillSymbol({
            color: [ 255,0, 0, 0.4],
            style: "solid",
            outline: {  // autocasts as esri/symbols/SimpleLineSymbol
              color: "red",
              width: 2
            }
          });
          return graphic;
        });
        
        
        var list = document.createElement('ul');
        var obj = results.features[0].attributes;
        
        var popupDiv = document.createElement("img")
        var zimg = "https://devsmap.cadm.harvard.edu/images/root_images/" + results.features[0].attributes.image;
        popupDiv.src = zimg;
        popupDiv.alt = results.features[0].attributes.primary_building_name + " building image"; 

        var popupHref = document.createElement("a");
        var createAText = document.createTextNode('Lactation Support');
        popupHref.setAttribute('href', results.features[0].attributes.firsttime);
        popupHref.target = '_blank';
        popupHref.appendChild(createAText);
        
        //var firsttimeregistration = results.features[0].attributes.firsttime;
        var alreadyregistered = results.features[0].attributes.alreadyregistered;
        var privatespaces = results.features[0].attributes.privatespaces;
        var reservationonly = results.features[0].attributes.reservationonly;
        var dropin = results.features[0].attributes.drop_in;
        var dooraccess = results.features[0].attributes.dooraccess;
        var pumpmedelasymphony = results.features[0].attributes.pump;
        var sink = results.features[0].attributes.sink;
        var refrigerator = results.features[0].attributes.refrigerator;
        var additionalnotes = results.features[0].attributes.notes;
        var image = results.features[0].attributes.image;   
      
        
        if(image == '02845.jpg' || image == '02805.jpg' || image == '02121.jpg' || image == '06318.jpg' || image == '02124.jpg' || image == '01208.jpg'){
          var zcontent = "<p><ul><li>First Time Registration: " + popupHref.outerHTML + "</li><li>Already Registered: " + alreadyregistered + "</li><li>Private Space: " + privatespaces + "</li><li>Reservation Online: " + reservationonly + "</li><li>Drop In: " + dropin + "</li><li>Door Access: " + dooraccess + "</li><li>Pump Medela: " + pumpmedelasymphony + "</li><li>Sink: " + sink + "</li><li>Refrigerator: " + refrigerator + "</li><li>Additional Notes: " + additionalnotes +  "</li></ul></p>"
        }
        else{
          var zcontent = popupDiv.outerHTML + "<p><ul><li>First Time Registration: " + popupHref.outerHTML + "</li><li>Already Registered: " + alreadyregistered + "</li><li>Private Space: " + privatespaces + "</li><li>Reservation Online: " + reservationonly + "</li><li>Drop In: " + dropin + "</li><li>Door Access: " + dooraccess + "</li><li>Pump Medela: " + pumpmedelasymphony + "</li><li>Sink: " + sink + "</li><li>Refrigerator: " + refrigerator + "</li><li>Additional Notes: " + additionalnotes + "</li></ul></p>"
        }
        
        view.center = [ results.features[0].geometry.centroid.longitude, results.features[0].geometry.centroid.latitude]
        console.log(view.center)
        view.popup.open({
          title: results.features[0].attributes.primary_building_name,
          content: zcontent,
          //updateLocationEnabled: false,
          location: view.center
        }); 
               
        resultsLayer.addMany(features);
      }              
    });