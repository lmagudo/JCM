define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/wmsDialog.html", "dojo/i18n!application/nls/wmsDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event", "esri/layers/WMSLayer", "esri/config"], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event, WMSLayer, esriConfig) {
    esriConfig.defaults.io.proxyUrl = "code/proxy.ashx";
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
                        var div = "";
                        var index = -1;
                        for (var k = 0 ; k < layersObject.length; k++)
                        {
                            index += 1;
                            div += "<div><div><h4 id='button_" + layersObject[k].name + "'>" + layersObject[k].name + "</h4></div>";
                            for (var l = 0 ; l < layersObject[k].layers.length; l++)
                            {
                                
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
                            if (checked) layer.show();
                            else layer.hide();

                        }

                        function loadLayers(layersObject,map)
                        {
                            console.log("Añadiendo capas wms");
                            console.log(layersObject);
                            console.log(map);
                            for (var i = 0 ; i < layersObject.length; i++)
                            {
                                var url = layersObject[i].url;
                                
                                for (var j=0; j < layersObject[i].layers.length; j++)
                                {
                                    var wmsLayer = new WMSLayer(url, {
                                        format: "png",
                                        visibleLayers: [layersObject[i].layers[j].Name]
                                    });
                                    wmsLayer.visible = false;
                                    
                                    console.log(wmsLayer);
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

