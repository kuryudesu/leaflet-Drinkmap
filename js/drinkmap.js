var osmAttr = ', <a href="https://openstreetmap.org/copyright">&copy;OpenStreetMap</a>';

var googleStreetsUrl = L.tileLayer('http://{s}.google.com/vt/lyrs-m&x={x}&y={y}&z={z}', {
  maxZoom: 22,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  /*attribution: osmAttr + ', <a href="https://www.google.com/intl/en-GB_ALL/permissions/geoguidelines/" target="_blank">&copy; Google</a>',*/
});

var googlesatUrl = L.tileLayer('http://{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
  maxZoom: 22,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  /*attribution: osmAttr + ', <a href="https://www.google.com/intl/en-GB_ALL/permissions/geoguidelines/" target="_blank">&copy; Google</a>',*/
});

var osmUrl= L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
});

var osm2 =  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 22
});

var baseLayersCopy = {
  OSM: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22
  }),
  衛星: L.tileLayer('http://{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),
  街道: L.tileLayer('http://{s}.google.com/vt/lyrs-m&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),
};

const drink = L.layerGroup();
const drink1 = L.layerGroup();
 // Create a map
var map = L.map('map', {

    zoomControl: false,
    attributionControl: false,
    center: [23.69781, 120.960515],
    minZoom: 2,
    zoom: 7,
    layers: [googlesatUrl, googleStreetsUrl, osmUrl, drink, drink1]
});

var Attribution = L.control.attribution({
    emblem: '<div class="emblem-wrap glyphicon glyphicon-info-sign"></div>',
    prefix: "<a href='https://leafletjs.com/' title='leafletjs'><img src='https://cdn.countryflags.com/thumbs/taiwan/flag-400.png' width='16' style='margin-right:1ex'>leaflet</a> " + osmAttr + ', <a href="https://www.google.com/intl/en-GB_ALL/permissions/geoguidelines/" target="_blank">&copy; Google</a>'
  }).addTo(map);
  
var zoom = L.control.zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '縮小',
    position: 'bottomright'
}).addTo(map);

var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

/*https://www.letswrite.tw/leaflet-plugins*/

var scale = L.control.scale({
  position: 'bottomleft',
  imperial: false
}).addTo(map);

var fullScreen = new L.control.fullscreen({
    position: 'topright', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
    title: '全螢幕模式', // change the title of the button, default Full Screen
    titleCancel: '退出全螢幕模式', // change the title of the button when fullscreen is on, default Exit Full Screen
    forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
    forcePseudoFullscreen: false // force use of pseudo full screen even if full screen API is available, default false
    // fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
}).addTo(map);

/*var measureControl = L.control.measure({
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: undefined,
}).addTo(map);*/
  
var mousePosition = L.control.mousePosition({
    /*prefix: '<span>經度/緯度</span>',*/
    position: 'bottomleft',
}).addTo(map);
  
// leaflet-locate
var locate = L.control.locate({

    follow: true,
    locateOptions: { maxZoom: 20 },
    icon: 'fa-solid fa-location-dot fa-flip',
    position: 'topright',
    strings: {
      title: "查看我的位置"
    }
}).addTo(map);

var baseLayers = {
    '衛星': googlesatUrl,
    '街道': googleStreetsUrl,
    'OSM': osmUrl,
};
  
var overlays = {
    '可不可紅茶': drink,
    '都可COCO': drink1
};


const layerControl = L.control.layers(baseLayers).addTo(map);

map.on('baselayerchange', function (e) {
    miniMap.changeLayer(baseLayersCopy[e.name]);
})
  
  // Handle overlay selection change
document.getElementById('overlay-select').addEventListener('change', function () {
    var selectedOverlay = this.value;
  
    // Toggle the overlay based on the selected option
    /*if (selectedOverlay === '0') {
        map.removeLayer(drink1);
        drink.addTo(map);
    } else if (selectedOverlay === '1') {
      map.removeLayer(drink);
      drink1.addTo(map);
    }*/
    // Add more conditions for other overlay options as needed
    switch (selectedOverlay) {
      case "0":
        break;
      case "1":
        map.removeLayer(drink1);
        drink.addTo(map);
        break;
      case "2":
        map.removeLayer(drink);
        drink1.addTo(map);
        break;
      case "3":
        option_04();
        break;
      case "4":
        option_05();
        break;
      case "5":
        option_06();
        break;
      default:
        return;
    }
});


var markersLayer = new L.layerGroup();
map.addLayer(markersLayer);

var markersLayer1 = new L.layerGroup();
map.addLayer(markersLayer1);

var controlSearch = new L.Control.Search({
    container: 'findbox',
	/*position:'topright',	*/	
	layer: L.featureGroup([markersLayer,markersLayer1]),
	initial: false,
	zoom: 18,
	marker: false,
    autoCollapse: true,
    minLength: 1,
    textPlaceholder: '搜尋…',
    textErr:'搜尋不到此店',
});


controlSearch.on('search:locationfound', function(e) {
    // Called when search results are found
    // You can do additional actions here if needed
    toggleSidebar();  // Toggle the sidebar when a location is found
    var selectedOverlay  = document.getElementById("overlay-select").value;
    switch (selectedOverlay) {
        case "0":
            break;
        case "1":
            setSidebarContent(e.layer.options.index);
            break;
        case "2":
            setSidebarContent1(e.layer.options.index);
            break;
        case "3":
            option_04();
            break;
        case "4":
            option_05();
            break;
        case "5":
            option_06();
            break;
        default:
            return;
    }
   
     
});
map.addControl( controlSearch );



// Create a sidebar
var sidebar = L.control.sidebar({
    position: 'left',
}).addTo(map);



// Function to set content for the sidebar
function setSidebarContent(index) {
    var data = jsonData[index];
    
    document.getElementById('sidebar-content').innerHTML  = '<h2>' + data.name + '</h2>' +
        '<p><strong>地址:</strong>' + data.text + '</p>'+
        '<a style="color: #71cae7;" href="' + data.phone + '">' + data.pname + '</a><p>'+
        '<a style="color:#bc955c;" href="' + data.url + '" target="_blank" rel="nofollow">' +'<strong>店家網站</strong>' + '</a><p>'+
        '<img style="width: 300px;height: 300px;" src="' + data.image + '"/>';
}

function setSidebarContent1(index) {
    var data1 = jsonData1[index];
    document.getElementById('sidebar-content').innerHTML  = '<h2>' + data1.name + '</h2>' +
        '<p><strong>地址:</strong>' + data1.text +'</p>'+
        '<a style="color: #71cae7;" href="' + data1.phone + '">' + data1.pname + '</a><p>'+
        '<a style="color:#bc955c;" href="' + data1.url + '" target="_blank" rel="nofollow">' +'<strong>店家網站</strong>' + '</a><p>'+
        '<img style="width: 300px;height: 300px;" src="' + data1.image + '"/>';
}

// Create a customs icon
var customIcon = L.icon({
    iconUrl: './pic/ms-icon-144x144.png', // Replace with the path to your custom icon
    iconSize: [30, 25],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
    
});

// Create a customs icon
var customIcon1 = L.icon({
    iconUrl: './pic/coco.png', // Replace with the path to your custom icon
    iconSize: [30, 30],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
    
});

// Loop through the drink JSON data and add markers to the map
for (var i = 0; i < jsonData.length; i++) {
    var title = jsonData[i].name;	//value searched
	var	loc = jsonData[i].coordinates;
    var marker = L.marker(loc, { 
        title: title,
        riseOnHover: true,
        icon: customIcon 
    }).addTo(drink);

    // Add a tooltip to each marker
    /*marker.bindTooltip('<span style="color: #761212;">'+jsonData[i].tip+ '<span>', {
        direction: 'right',
        offset: [25, -8],
        permanent: true
    }).openTooltip();*/
    marker.bindPopup('<span style="color: #761212;">'+jsonData[i].tip+ '<span>');

    markersLayer.addLayer(marker);

    marker.on('click', function (e) {
        toggleSidebar();
        
        setSidebarContent(e.target.options.index);
    });
    marker.options.index = i; // Attach index to the marker for later reference
}

// Loop through the drink1 JSON data and add markers to the map
for (var i = 0; i < jsonData1.length; i++) {
    var title = jsonData1[i].name;	//value searched
	var	loc = jsonData1[i].coordinates;
    var marker = L.marker(loc, { 
        title: title,
        riseOnHover: true,
        icon: customIcon1 
    }).addTo(drink1);

    /*marker.bindPopup('<span style="color: #761212;">'+jsonData1[i].tip+ '<span>');*/

    markersLayer1.addLayer(marker);

    marker.on('click', function (e) {
        toggleSidebar();
        
        /*setSidebarContent1(e.target.options.index1);*/
        setSidebarContent1(e.target.options.index);
    });
    /*marker.options.index1 = i;*/ // Attach index to the marker for later reference
    marker.options.index = i;
}


// Function to toggle the sidebar visibility
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'block' : 'block';
}

document.addEventListener('DOMContentLoaded', function () {
var sidebar = document.getElementById('sidebar');
var closeButton = document.getElementById('closeButton');

closeButton.addEventListener('click', function () {
sidebar.style.display = 'none'; // or any other way to hide your sidebar
});
});

