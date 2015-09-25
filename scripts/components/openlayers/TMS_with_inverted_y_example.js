<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml>"
  <head>
    <title>khorog</title>
    <meta http-equiv='imagetoolbar' content='no'/>
    <style type="text/css"> v\:* {behavior:url(#default#VML);}
      html, body { overflow: hidden; padding: 0; height: 100%; width: 100%; font-family: 'Lucida Grande',Geneva,Arial,Verdana,sans-serif; }
      body { margin: 10px; background: #fff; }
      h1 { margin: 0; padding: 6px; border:0; font-size: 20pt; }
      #header { height: 43px; padding: 0; background-color: #eee; border: 1px solid #888; }
      #subheader { height: 12px; text-align: right; font-size: 10px; color: #555;}
      #map { height: 95%; border: 1px solid #888; }
    </style>
    <script src="OpenLayers.js" type="text/javascript"></script>
    <script type="text/javascript">
      var map;
      var mapBounds = new OpenLayers.Bounds( 71.5, 37.4, 71.6, 37.5);
      var mapMinZoom = 12;
      var mapMaxZoom = 20;

      // avoid pink tiles
      OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
      OpenLayers.Util.onImageLoadErrorColor = "transparent";

      function init(){
      var options = {
      controls: [],
      projection: new OpenLayers.Projection("EPSG:900913"),
      displayProjection: new OpenLayers.Projection("EPSG:4326"),
      units: "m",
      maxResolution: 156543.0339,
      maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
    };
      map = new OpenLayers.Map('map', options);


      // create OSM/OAM layer
      var osm = new OpenLayers.Layer.TMS( "OpenStreetMap",
      "http://tile.openstreetmap.org/",
    { type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true,
      attribution: '<a href="http://www.openstreetmap.org/">OpenStreetMap</a>'} );


      // create TMS Overlay layer
      var tmsoverlay = new OpenLayers.Layer.TMS( "TMS Overlay", "http://humadat.alwaysdata.net/tms/khorog/tiles/",
    {   // url: '', serviceVersion: '.', layername: '.',
      type: 'jpg', getURL: overlay_getTileURL, alpha: true,
      isBaseLayer: false
    });
      if (OpenLayers.Util.alphaHack() == false) { tmsoverlay.setOpacity(0.7); }

      map.addLayers([osm, tmsoverlay]);

      var switcherControl = new OpenLayers.Control.LayerSwitcher();
      map.addControl(switcherControl);
      switcherControl.maximizeControl();

      map.zoomToExtent( mapBounds.transform(map.displayProjection, map.projection ) );

      map.addControl(new OpenLayers.Control.PanZoomBar());
      map.addControl(new OpenLayers.Control.MousePosition());
      map.addControl(new OpenLayers.Control.MouseDefaults());
      map.addControl(new OpenLayers.Control.KeyboardDefaults());
    }

      function osm_getTileURL(bounds) {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit) {
      return "http://www.maptiler.org/img/none.png";
    } else {
      x = ((x % limit) + limit) % limit;
      return this.url + z + "/" + x + "/" + y + "." + this.type;
    }
    }

      function overlay_getTileURL(bounds) {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      if (mapBounds.intersectsBounds( bounds ) && z >= mapMinZoom && z <= mapMaxZoom ) {
      //console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
      return this.url + z + "/" + x + "/" + y + "." + this.type;
    } else {
      return "http://www.maptiler.org/img/none.png";
    }
    }

      function getWindowHeight() {
      if (self.innerHeight) return self.innerHeight;
      if (document.documentElement && document.documentElement.clientHeight)
      return document.documentElement.clientHeight;
      if (document.body) return document.body.clientHeight;
      return 0;
    }

      function getWindowWidth() {
      if (self.innerWidth) return self.innerWidth;
      if (document.documentElement && document.documentElement.clientWidth)
      return document.documentElement.clientWidth;
      if (document.body) return document.body.clientWidth;
      return 0;
    }

      function resize() {
      var map = document.getElementById("map");
      var header = document.getElementById("header");
      var subheader = document.getElementById("subheader");
      map.style.height = (getWindowHeight()-80) + "px";
      map.style.width = (getWindowWidth()-20) + "px";
      header.style.width = (getWindowWidth()-20) + "px";
      subheader.style.width = (getWindowWidth()-20) + "px";
      if (map.updateSize) { map.updateSize(); };
    }

      onresize=function(){ resize(); };

    </script>
  </head>
  <body onload="init()">
  <div id="subheader">Generated by <a href="http://www.maptiler.org/">MapTiler</a>/<a href="http://www.klokan.cz/projects/gdal2tiles/">GDAL2Tiles</a>, Copyright &copy; 2008 <a href="http://www.klokan.cz/">Klokan Petr Pridal</a>,  <a href="http://www.gdal.org/">GDAL</a> &amp; <a href="http://www.osgeo.org/">OSGeo</a> <a href="http://code.google.com/soc/">GSoC</a>
  </div>
  <div id="map"></div>
  <script type="text/javascript" >resize()</script>
  </body>
  </html>
