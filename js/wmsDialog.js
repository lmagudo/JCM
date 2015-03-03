define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/wmsDialog.html", "dojo/i18n!application/nls/wmsDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event", "esri/layers/WMSLayer", "esri/config", "esri/layers/WMSLayerInfo", 'esri/geometry/Extent'], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event, WMSLayer, esriConfig, WMSLayerInfo,Extent) {
    esriConfig.defaults.io.proxyUrl = "code/proxy.ashx";
    //esriConfig.defaults.io.proxyUrl = "code/php/proxy.php";
    //esriConfig.defaults.io.proxyUrl = "http://localhost/JCM/code/php/proxy.php";
    //esriConfig.defaults.io.proxyUrl = "http://jongarrido.es/JCM/code/php/proxy.php"

    esriConfig.defaults.io.alwaysUseProxy = false;

    var Widget = declare("esri.dijit.wmsDialog", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: dijitTemplate,
        options: {
            //theme: "ShareDialog",
            title: null,
            wmslayers: null,
            dialog: null,
            layerColection: [],
            map: null,
            
        },
        // lifecycle: 1
        constructor: function (options, srcRefNode) {
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            this._i18n = i18n;
            //console.log(defaults);
            this.set("title", defaults.title);
            this.set("wmslayers", defaults.wmslayers);
            this.set("map", defaults.map);
            
            this.css = {
                
                wmsDialogContent: "dialog-content",
               
            };

        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);
            

            //this._creteLayerButtons(this.wmslayers);
            this._creteLayerButtons(this.wmslayers);
            //this._cbEvents(this.layersColection);

        },
        // start widget. called by user
        startup: function () {
            this._init();

        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            this.inherited(arguments);
        },
       
        _init: function () {
            var dialog = new Dialog({
                title: i18n.widgets.wmsDialog.title,
                draggable: false
            }, domConstruct.create("div"));
            this.set("dialog", dialog);

            // loaded
            this.set("loaded", true);
            this.emit("load", {});
        }
        ,
        _creteLayerButtons: function (wmslayers)
        {
            
            var max = wmslayers.length;
            var j = 0;
            var layersObject = [];
            for (var i = 0 ; i < this.wmslayers.length ; i++) {
                
                this._getWMSLayers(this.wmslayers[i],this.map, function (response) {
                    j++;
                   
                    layersObject.push(response);
                    console.log(response);
                    if (j == max)
                    {
                        j = -1;
                        var div = "";
                        var index = -1;
                        for (var k = 0 ; k < layersObject.length; k++)
                        {
                            
                            div += "<div><div><h4 class='encabezadoWMS' id='button_" + layersObject[k].name + "'>" + layersObject[k].name + "</h4></div>";
                            for (var l = 0 ; l < layersObject[k].layers.length; l++)
                            {
                                index += 1;
                                div += "<div id='"+index+"'><span id='" + layersObject[k].layers[l].Name + "'>" + layersObject[k].layers[l].Title + "</span><input class='wmsCB' id='cb_"+layersObject[k].layers[l].Name+"' type='checkbox' name='layercheck' value='true' ></div>";
                            }
                            div += "</div>";
                        }
                        this.document.getElementById("layerButtons").innerHTML = div;

                        var cblist = this.document.getElementsByClassName("wmsCB");
                        console.log(cblist);
                        for (var i = 0 ; i < cblist.length; i++)
                        {
                            cblist[i].addEventListener("click", function (evt) {
                                console.log("checked");
                                
                                var checked = evt.target.checked;
                                var index = evt.target.parentNode.id;
                                toogleLayerto(layersObject, index, checked, response.map);
                            });
                        }

                        function toogleLayerto(layersObject, targetIndex, checked, map)
                        {
                            var layerid = 0;
                            var actualindex = -1;
                           
                            for (var i = 0; i < layersObject.length; i++)
                            {
                                for (var j = 0; j < layersObject[i].layers.length; j++)
                                {
                                    actualindex += 1;
                                    if (actualindex == targetIndex)
                                    {
                                       
                                        layerid = layersObject[i].layers[j].id;
                                        break;
                                    }
                                }
                            }
                            

                            var layer = map.getLayer(layerid);
                            console.log(layer);
                            if (layer) {
                                if (checked) layer.show();
                                else layer.hide();
                            }
                            else
                            {
                                if (checked) alert("Capa no filtrada por proxy");
                            }

                        }

                        function loadLayers(layersObject,map)
                        {
                            console.log("Añadiendo capas wms");
                            console.log(layersObject);
                            //console.log(map);
                            for (var i = 0 ; i < layersObject.length; i++)
                            {
                                var url = layersObject[i].url;
                                
                                for (var j=0; j < layersObject[i].layers.length; j++)
                                {
                                    var layer1 = new WMSLayerInfo({ name: layersObject[i].layers[j].Name, title: layersObject[i].layers[j].title }); //!!!Madre mía hasta que he dado con esto!!!

                                    var resourceInfo = {
                                        layerInfos: [layer1],
                                        extent: new Extent(-180, -90, 180, 90, { wkid: 4326 })
                                    }; //!!!Madre mía hasta que he dado con esto!!!

                                    
                                    var wmsLayer = new WMSLayer(url, {
                                        resourceInfo: resourceInfo,
                                        format: "png",
                                        visibleLayers: [layersObject[i].layers[j].Name],
                                       
                                        //spatialReference: new esri.SpatialReference(3857)
                                    });

                                   
                                    if (url == "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?")// Se fuerza una petición SRS="EPSG:3857"  en el caso de las capas de catastro...
                                    {
                                        wmsLayer.getImageUrl = function (a, b, c, f) {
                                            if (!this.visibleLayers || 0 === this.visibleLayers.length) f(this._blankImageURL);
                                            else {
                                                var g = a.spatialReference.wkid;
                                                //-1 === d.indexOf(this.spatialReferences, g) && a.spatialReference.latestWkid && (g = a.spatialReference.latestWkid);
                                                //if (d.some(this._WEB_MERCATOR, function (a) { return a == g }))
                                                //{
                                                //    var m = d.filter(this.spatialReferences, function (a) { return d.some(this._WEB_MERCATOR, function (b) { return b == a }) }, this); 0 === m.length && (m = d.filter(this.spatialReferences, function (a) { return d.some(this._WORLD_MERCATOR, function (b) { return b == a }) }, this)); g = 0 < m.length ? m[0] : this._WEB_MERCATOR[0]
                                                //}
                                                //this.spatialReferences = d.filter(this.spatialReferences, function (a) { return a !== g });
                                                //this.spatialReferences.unshift(g);
                                                var m = a.xmin, s = a.xmax, t = a.ymin, e = a.ymax;
                                                a = { SERVICE: "WMS", REQUEST: "GetMap" };
                                                a.FORMAT = this.imageFormat;
                                                a.TRANSPARENT = this.imageTransparency ? "TRUE" : "FALSE";
                                                a.STYLES = "";
                                                a.VERSION = this.version;
                                                a.LAYERS = this.visibleLayers ? this.visibleLayers.toString() : null;
                                                a.WIDTH = b;
                                                a.HEIGHT = c;
                                                this.maxWidth < b && (a.WIDTH = this.maxWidth);
                                                this.maxHeight < c && (a.HEIGHT = this.maxHeight);
                                                b = g ? g : NaN; isNaN(b) || ("1.3.0" == this.version ? a.SRS = "EPSG:" + "3857" : a.SRS = "EPSG:" + "3857");
                                                "1.3.0" == this.version && this._useLatLong(b) ? a.BBOX = t + "," + m + "," + e + "," + s : a.BBOX = m + "," + t + "," + s + "," + e;
                                                b = this.getMapURL; var h;
                                                b += -1 == b.indexOf("?") ? "?" : "";
                                                for (h in a) a.hasOwnProperty(h) && (b += "?" == b.substring(b.length - 1, b.length) ? "" : "\x26", b += h + "\x3d" + a[h]);
                                                f(b)
                                            }
                                        };


                                    }
                                    
                                    wmsLayer.spatialReferences[0] = 3857; //!!!Madre mía hasta que he dado con esto!!!
                                    wmsLayer.visible = false;
                                   
                                    map.addLayer(wmsLayer);
                                    layersObject[i].layers[j].id = wmsLayer.id;
                                }
                            }
                        }
                        loadLayers(layersObject,response.map);

                    }
                });
            }
            
           
           
            
            
        },

        _cbEvents: function (layerColection) {

            
        },

        _getWMSLayers: function (wmslayer,map, callback)
        {
            var wmsuri = wmslayer.url;
            console.log("Obteniendo capas wms: " + wmsuri);
            var url = "code/getLayers.ashx";
            url += "?wmsuri=" + wmsuri
            var layersRequest = esri.request({
                url: url,
                //content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
            });


            var div = "";
            layersRequest.then(
            function (response) {
                
                wmslayer.layers = response;
                wmslayer.map = map;
                callback(wmslayer);
                
            }, function (error) {
                console.log("Error: ", error.message);
            });
            
          
        }

    });

   

    return Widget;
        
    
});