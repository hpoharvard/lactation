require(["esri/Map","esri/views/MapView","esri/widgets/Locate","esri/layers/FeatureLayer","esri/layers/GraphicsLayer","esri/Graphic","esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleFillSymbol","esri/renderers/UniqueValueRenderer","esri/geometry/Extent","esri/widgets/Popup","esri/layers/VectorTileLayer","calcite-maps/calcitemaps-v0.8","calcite-maps/calcitemaps-arcgis-support-v0.8","bootstrap/Collapse","bootstrap/Dropdown","bootstrap/Tab","@dojo/framework/shim/array","dojo/domReady!"],function(e,t,r,o,a,l,n,s,u,d,p,m,c,g,b){var f={Allston:[-71.1237912,42.3626648],Arboretum:[-71.1333697,42.295822],Cambridge:[-71.1168498,42.3759086],Longwood:[-71.1024294,42.3389915],Forest:[-72.190308,42.5313531]},v=(new c({url:"https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json"}),{title:"{buildingroomname}"}),y=new o({url:"https://prodtmap.cadm.harvard.edu/server/rest/services/Hosted/lactationroom04132020/FeatureServer",outFields:["*"],visible:!0,renderer:new n({symbol:new u({color:[0,121,193,.5],style:"solid",outline:{width:1.2,color:"blue"}})})}),h=new a,w=new t({container:"mapViewDiv",map:new e({basemap:"topo",layers:[y,h]}),center:[-71.116076,42.358],zoom:14,padding:{top:50,bottom:0},breakpoints:{xsmall:768,small:769,medium:992,large:1200}});y.popupTemplate=v,w.constraints={rotationEnabled:!1},w.popup.dockOptions={position:"bottom-left"};var _=new r({view:w});w.ui.add(_,{position:"top-left"}),w.on("click",function(e){e.stopPropagation(),document.getElementById("infoBuildings").options[0].selected=!0;var t=e.screenPoint;w.popup.location=e.mapPoint,w.popup.visible=!1,w.hitTest(t).then(T)});var A=document.createElement("a"),R=document.createTextNode("Reserve through RoomBook");function T(e){h.popupTemplate=v,h.removeAll();var t=e.results[0].graphic.attributes,i=(t.Primary_Building_Name,document.getElementById("infoBuildings"),new l({geometry:e.results[0].graphic.geometry,symbol:new u({color:[255,0,0,.4],style:"solid",outline:{color:"red",width:2}})}));h.add(i);var r=t.image,o=document.createElement("img"),a="https://prodsmap.cadm.harvard.edu/images/root_images/"+r;o.src=a,o.alt=t.primary_building_name+" building image";var n=document.createElement("a"),s=document.createTextNode("Lactation Support");n.setAttribute("href",t.firsttime),n.target="_blank",n.appendChild(s);t.firsttime,t.alreadyregistered;var d=t.privatespaces,p=t.reservationonly,m=t.drop_in,c=t.dooraccess,g=t.pump,b=t.sink,f=t.refrigerator,y=t.notes;if("02845.jpg"==r||"02805.jpg"==r||"02121.jpg"==r||"06318.jpg"==r||"02124.jpg"==r||"01208.jpg"==r)var _="<p><ul><li>First Time Registration: "+n.outerHTML+"</li><li>Already Registered: "+A.outerHTML+"</li><li>Private Space: "+d+"</li><li>Reservation Online: "+p+"</li><li>Drop In: "+m+"</li><li>Door Access: "+c+"</li><li>Pump Medela: "+g+"</li><li>Sink: "+b+"</li><li>Refrigerator: "+f+"</li><li>Additional Notes: "+y+"</li></ul></p>";else _=o.outerHTML+"<p><ul><li>First Time Registration: "+n.outerHTML+"</li><li>Already Registered: "+A.outerHTML+"</li><li>Private Space: "+d+"</li><li>Reservation Online: "+p+"</li><li>Drop In: "+m+"</li><li>Door Access: "+c+"</li><li>Pump Medela: "+g+"</li><li>Sink: "+b+"</li><li>Refrigerator: "+f+"</li><li>Additional Notes: "+y+"</li></ul></p>";w.popup.open({title:t.primary_building_name,content:_}),w.popup.focus()}A.setAttribute("href","https://roombook.harvard.edu/"),A.target="_blank",A.appendChild(R);var E=document.getElementById("infoRegions"),L=document.getElementById("infoBuildings");function S(e){var t=document.getElementById("infoBuildings"),i=e.features;for(var r in i){var o=document.createElement("option");o.text=i[r].attributes.primary_building_name,o.value=i[r].attributes.primary_building_name,t.add(o)}}E.addEventListener("change",function(){var e=E.options[E.selectedIndex].value;for(i=1;i<L.length;i++)L.remove(i),i--;if(1==L.length){var t=document.getElementById("infoBuildings"),r=document.createElement("option");r.text="Select a buildings...",r.setAttribute("selected",!0),r.setAttribute("disabled",!0),r.setAttribute("hidden",!0),t.add(r),console.log(L.length)}const o=Object.entries(f);for(const t of o)t[0]==e&&(w.center=t[1],w.zoom=16,(a=e,l=void 0,l=y.createQuery(),l.where="region = '"+a+"'",l.orderByFields=["primary_building_name ASC"],y.queryFeatures(l)).then(S));var a,l});var M=document.getElementById("infoBuildings");function j(e){h.removeAll();var t=e.features.map(function(e){return e.symbol=new u({color:[255,0,0,.4],style:"solid",outline:{color:"red",width:2}}),e}),i=(document.createElement("ul"),e.features[0].attributes,document.createElement("img")),r="https://devsmap.cadm.harvard.edu/images/root_images/"+e.features[0].attributes.image;i.src=r,i.alt=e.features[0].attributes.primary_building_name+" building image";var o=document.createElement("a"),a=document.createTextNode("Lactation Support");o.setAttribute("href",e.features[0].attributes.firsttime),o.target="_blank",o.appendChild(a);e.features[0].attributes.alreadyregistered;var l=e.features[0].attributes.privatespaces,n=e.features[0].attributes.reservationonly,s=e.features[0].attributes.drop_in,d=e.features[0].attributes.dooraccess,p=e.features[0].attributes.pump,m=e.features[0].attributes.sink,c=e.features[0].attributes.refrigerator,g=e.features[0].attributes.notes,b=e.features[0].attributes.image;if("02845.jpg"==b||"02805.jpg"==b||"02121.jpg"==b||"06318.jpg"==b||"02124.jpg"==b||"01208.jpg"==b)var f="<p><ul><li>First Time Registration: "+o.outerHTML+"</li><li>Already Registered: "+A.outerHTML+"</li><li>Private Space: "+l+"</li><li>Reservation Online: "+n+"</li><li>Drop In: "+s+"</li><li>Door Access: "+d+"</li><li>Pump Medela: "+p+"</li><li>Sink: "+m+"</li><li>Refrigerator: "+c+"</li><li>Additional Notes: "+g+"</li></ul></p>";else f=i.outerHTML+"<p><ul><li>First Time Registration: "+o.outerHTML+"</li><li>Already Registered: "+A.outerHTML+"</li><li>Private Space: "+l+"</li><li>Reservation Online: "+n+"</li><li>Drop In: "+s+"</li><li>Door Access: "+d+"</li><li>Pump Medela: "+p+"</li><li>Sink: "+m+"</li><li>Refrigerator: "+c+"</li><li>Additional Notes: "+g+"</li></ul></p>";w.center=[e.features[0].geometry.centroid.longitude,e.features[0].geometry.centroid.latitude],console.log(w.center),w.popup.open({title:e.features[0].attributes.primary_building_name,content:f,location:w.center}),w.popup.focus(),h.addMany(t)}M.addEventListener("change",function(){var e,t,i=M.options[M.selectedIndex].value;console.log(i),(e=i,t=y.createQuery(),t.where="primary_building_name = '"+e+"'",t.outSpatialReference=4326,console.log(t),y.queryFeatures(t)).then(j)})});