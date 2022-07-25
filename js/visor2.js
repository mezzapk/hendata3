//import geojson from '/data/py.geojson';
var mapa = new L.map('map',{
    center: [-24,-57],
    zoom:6
});

var layerOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var layerRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg');

var url = 'http://localhost:8080/geoserver/h1/wm';

var parce = L.tileLayer.betterWms(url, {
    layers: 'parcelario',
    transparent: true,
    format: 'image/png',
    crs: L.CRS.EPSG32721,
    //crs: L.CRS.EPSG4326,
  });

var layerDPTO= L.tileLayer.wms('http://localhost:8080/geoserver/h1/wms', {
                layers: 'departamentos',
                format: 'image/png',
                transparent: true,
                crs: L.CRS.EPSG32721,
                //opacity: 1.0,
                //attribution: "(c) Instituto Geografico Nacional",
            });

/*
var layerDIST= L.tileLayer.wms('http://localhost:8080/geoserver/visor/wms', {
                layers: 'distritos',
                format: 'image/png',
                transparent: true,
                //visible: false,
                //attribution: "(c) Instituto Geografico Nacional",
});
*/
/*var layerPARC= L.tileLayer.wms('http://localhost:8080/geoserver/h1/wms', {
                layers: 'parcelario',
                format: 'image/png',
                transparent: true,
                //center: [-25.3812144,-56.9675232],
                //minZoom: 10,
                //maxZoom: 20,
                
                //attribution: "(c) Instituto Geografico Nacional",
});*/

var dptos = L.geoJSON(dptos,{
    style: function(feature){
        return {
            weight: 1.3,
            color: '#000',
            //opacity: .75,
            fillColor: '#00000000',
            fillOpacity: 1.5
        };
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillOpacity: 0.3})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({fillOpacity: 0.3})
        })
    }
});

var dist = L.geoJSON(distritos,{
    style: function(feature){
        return {
            weight: 1.0,
            color: '#FFA500',
            opacity: 1.5,
            fillColor: '#00000000',
            //fillOpacity: 0.75
        }
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillColor: '#FFA500',fillOpacity: 0.3})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({color: '#FFA500',fillOpacity: 0})
        }),
        popupOptions = {maxWidth: 200};
        layer.bindPopup("Distritos: "+feature.properties.nom_dist,popupOptions);
    }
});

/*function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}*/

//layerDIST.addTo(mapa);
//layerPARC.addTo(mapa);
layerOSM.addTo(mapa);
layerRelieve.addTo(mapa);
layerDPTO.addTo(mapa);
//dptos.addTo(mapa);
//dist.addTo(mapa);
parce.addTo(mapa);

/*mapa.on('click',function(e){
    layerDPTO.getFeatureInfo({
        latlng: e.latlng,
        done: function(featureCollection){
            console.log('getFeatureInfo succeed: ',featureCollection);
        },
        fail: function(errorThrow){
            console.log('getFeatureInfo finished: '+errorThrow);
        },
        always: function(){
            console.log('getFeatureInfo finished')
        }
    });
});*/

var capasBase = {
    "Relieve": layerRelieve,
    "OSM": layerOSM,
    
};

var overlayMaps={
    "Departamentos": dptos,
    "Distritos": dist,
    "Parcelario": parce,
};

var selectorCapas = new L.control.layers(capasBase,overlayMaps);
selectorCapas.addTo(mapa);

//mapa.removeLayer(dist).removeLayer(layerPARC);
mapa.removeLayer(dist).removeLayer(parce);

var controlSearch = new L.Control.Search({
    //position:'topright',		
    layer: L.layerGroup([dptos,dist]),
    //initial: false,
    propertyName: 'nom_dist',
    marker: false,
    moveToLocation: function(latlng,title,mapa){
        var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
        mapa.setView(latlng,zoom);
    }
});

controlSearch.on('search:locationfound',function(e) {
    e.layer.setStyle({fillColor:'#0f0',color:'#0f0'});//0f0
    if(e.layer._popup)
        e.layer.openPopup();
}).on('search:collapsed',function(e){
    dist.eachLayer(function(layer){
        dist.resetStyle(layer);
    });
});

mapa.addControl(controlSearch);



