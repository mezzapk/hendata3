//import geojson from '/data/py.geojson';
var mapa = new L.map('map',{
    center: [-24,-57],
    zoom:6
});

// mapa.on('layeradd',function(layer){
//     addLeyenda(layer.layer);
// });

// mapa.on('layerremove',function(layer){
//     removeLeyenda(layer.layer);
// });

var layerOSM = new L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png');
var layerRelieve = new L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg');

// var mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];
// var logoContainer = document.getElementById("logoContainer");

// mapControlsContainer.appendChild(logoContainer);

// var logo = L.control({position: 'topleft'});
// logo.onAdd = function(map){
//     var div = L.DomUtil.create('div', 'myclass');
//     div.innerHTML= "<img src='img/hendata.png'/>";
//     return div;
// }
// logo.addTo(mapa);


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
        layer.on('click', function(){
            //mapa.zoomIn();
            //var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
            //mapa.setView(latlng,zoom);
            mapa.setZoom(14);
        }),
        popupOptions = {maxWidth: 200};
        //layer.bindPopup("Distritos: "+feature.properties.nom_dist,popupOptions);
        //layer.zoom;
    }
});

var bahia = L.geoJSON(bahia_negra,{
    style: function(feature){
        return {
            weight: 0.5,
            color: 'blue',
            opacity: 1.5,
            //fillColor: '#00000000',
        }
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillColor: 'red'})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({fillColor: 'blue',opacity: 1.5})
        }),
        layer.on('click', function(){
            //mapa.zoomIn();
            //var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
            //mapa.setView(latlng,zoom);
            mapa.setZoom(14);
        }),
        popupOptions = {maxWidth: 200};
        layer.bindPopup("<strong>Codigo: </strong>" + feature.properties.Codigo+"<br/>"+
                        "<strong>Nombre: </strong>" + feature.properties.Nombre+"<br/>"+
                        "<strong>Cabezas: </strong>"+ feature.properties.Cabezas);
        //layer.zoom;
    }
});

var lim_put = L.geoJSON(lim_put2,{
    style: function(feature){
        return {
            weight: 1.3,
            color: 'green',
            //opacity: .75,
            fillColor: '#00000000',
            fillOpacity: 1.5
        };
    },
});

// var lim_alter = L.geoJSON(lim_alter2,{
//     style: function(feature){
//         return {
//             weight: 1.3,
//             color: 'red',
//             //opacity: .75,
//             fillColor: '#00000000',
//             fillOpacity: 1.5
//         };
//     },
// }); ok

var agricultura = L.geoJSON(agricultura2,{
    style: function(feature){
        return {
            weight: 0.5,
            color: 'green',
            opacity: 1.5,
            //fillColor: '#00000000',
        }
    },
    onEachFeature:  function(feature,layer){
        layer.on('mouseover',function(){
            layer.setStyle({fillColor: 'yellow'})
        }),
        layer.on('mouseout',function(){
            layer.setStyle({fillColor: 'green',opacity: 1.5})
        }),
        layer.on('click', function(){
            //mapa.zoomIn();
            //var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
            //mapa.setView(latlng,zoom);
            mapa.setZoom(14);
        })
        popupOptions = {maxWidth: 200};
        layer.bindPopup("<strong>Etiqueta: </strong>" + feature.properties.Etiqueta+"<br/>"+
                        "<strong>Superficie Hectareas: </strong>" + feature.properties.sup_ha);
        layer.zoom;
    },
});

//bahia.addTo(mapa);
layerOSM.addTo(mapa);
//dist.addTo(mapa);


var capasBase = {
    "Relieve": layerRelieve,
    "OSM": layerOSM,
    
};

var overlayMaps={
    "Departamentos": dptos,
    "Distritos": dist,
    "Bahia Negra": bahia,
    "Limite PUT": lim_put,
    "Agricultura": agricultura,
    // "Limite alternativo": lim_alter,
    //"Parcelario": parce,
};



//mapa.removeLayer();

// var selectorCapas = new L.control.layers(capasBase,overlayMaps);
// selectorCapas.addTo(mapa);

var selectorCapas = L.control.layers(capasBase,overlayMaps,{
    collapsed: false
}).addTo(mapa);


var controlSearch = new L.Control.Search({
    //position:'topright',		
    layer: L.layerGroup([bahia]),
    //initial: false,
    propertyName: 'Codigo',
    //propertyName: 'Nombre',
    marker: false,
    moveToLocation: function(latlng,title,mapa){
        var zoom = mapa.getBoundsZoom(latlng.layer.getBounds());
        mapa.setView(latlng,zoom);
    },
    //collapsed: false,
});

controlSearch.on('search:locationfound',function(e) {
    e.layer.setStyle({fillColor:'red',color:'blue'});//0f0
    if(e.layer._popup)
        e.layer.openPopup();
        //layer.bindPopup("Codigo: "+feature.properties.Codigo,popupOptions),
}).on('search:collapsed',function(e){
    dist.eachLayer(function(layer){
        dist.resetStyle(layer);
    });
});

mapa.addControl(controlSearch);

var sidebar = L.control.sidebar('sidebar').addTo(mapa);
L.control.locate().addTo(mapa);

document.getElementById("control-capas").appendChild(
    selectorCapas.getContainer()
);
//parce.bringToFront();
document.getElementById("control-buscar").appendChild(
    controlSearch.getContainer()
);

// function addLeyenda(layer){
//     if( layer instanceof L.TileLayer.WMS ){
//             var container = document.getElementById("control-leyenda");
//             var divleyenda = L.DomUtil.create('div','div-image-leyenda', container);
//             divleyenda.id = '_leaflet_id_'+layer._leaflet_id;
//             var imgleyenda = L.DomUtil.create('img','image-leyenda', divleyenda);
//             imgleyenda.src = layer._url+'&VERSION=1.3.0&SERVICE=WMS&REQUEST=GetLegendGraphic&SLD_VERSION=1.1.0&LAYER='+layer.options.layers+'&FORMAT=image/png&STYLE=default';
//     }
// }

// function removeLeyenda(layer){
//     var divleyenda = L.DomUtil.get('_leaflet_id_'+layer._leaflet_id);
//     document.getElementById("control-leyenda").removeChild(divleyenda);
// }