define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/incidenciasDialog.html", "dojo/i18n!application/nls/incidenciasDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event"], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event) {
    
    var Widget = declare("esri.dijit.incidenciasDialog", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: dijitTemplate,
        options: {
            //theme: "ShareDialog",
            title: window.document.title,
            map: null
            
        },
        // lifecycle: 1
        constructor: function (options, srcRefNode) {
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            this._i18n = i18n;
            
            this.set("title", defaults.title);
            this.set("map", defaults.map);
            
            this.css = {
                
                incidenciasDialogContent: "dialog-content",
               
            };
        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);
            this._creteLayerButtons(this.map);
            //this._Popup('incidenciasForm',this.map);
            //this._drawIncidencia(this.map);
            //this._DrawResults();
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
            // set sizes for select box
            //this._setSizeOptions();

            var dialog = new Dialog({
                title: i18n.widgets.incidenciasDialog.title,
                draggable: false
            }, domConstruct.create("div"));
            this.set("dialog", dialog);

            // loaded
            this.set("loaded", true);
            this.emit("load", {});
        },
        _creteLayerButtons: function (map)
        {  
            var tb;
            var div = "";
            div += "<div class='contenedor'><button class='btn_incidencias' onclick='_Popup('incidenciasForm'," + this.options.map + ")'>Crear Prueba</button></div>";
            //this.document.getElementById("layerButton").innerHTML = div;

            function _Popup(id,map){
                $('incidenciasForm').load('index.html');
                this._drawIncidencia(map);
            }

            function _drawIncidencia(map){
                var drawmap = this.options.map;
                console.log(map);
                require(["esri/toolbars/draw"], function(){
                    tb = new esri.toolbars.Draw(drawmap);
                    tb.on("draw-end", _DrawResults);
                    tb.activate(esri.toolbars.Draw.POINT);
                });    
            }

            function _DrawResults(evt){
                require([
                "esri/Color",
                "esri/graphic",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleMarkerSymbol"
                ],
                function (Color, Graphic, SimpleLineSymbol, SimpleMarkerSymbol) {

                    //tb.deactivate();

                    if (dojo.byId('incidenciasForm').style.display == "block") {
                        dojo.byId('incidenciasForm').style.display = "none";
                    }

                    else {
                        dojo.byId('incidenciasForm').style.display = "none";
                    }

                    // add the drawn graphic to the map
                    var geometry = evt.geometry;

                    var symbol = new SimpleMarkerSymbol(
                        SimpleMarkerSymbol.STYLE_CIRCLE,
                        12,
                        new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_NULL,
                        new Color([0, 0, 255, 0.9]),
                        1
                        ),
                        new Color([0, 0, 255, 0.5])
                    );

                    graphicpoint = new Graphic(geometry, symbol);
                    this.map.graphics.add(graphicpoint);
                    console.log(map.graphics);

                });
            }
        }

//        //prueba
//        _Popup: function (id,map) {
//    
//            $('incidenciasForm').load('index.html');
//            this._drawIncidencia(this.map);
//        //    if (dojo.byId(id).style.display == "none") {
//        //        dojo.byId(id).style.display = "block";
//        //        drawIncidencia(id);
//        //    }

//        //    else {
//        //        dojo.byId(id).style.display = "none";
//        //    }     
//        },

//        _drawIncidencia: function (map) {            
//            var drawmap = this.options.map;
//            console.log(map);
//            require(["esri/toolbars/draw"], function(){
//                //tb = new esri.toolbars.Draw(drawmap);
//                //tb.on("draw-end", _DrawResults);
//                //tb.activate(esri.toolbars.Draw.POINT);
//            });    
//        },


//        _DrawResults: function (evt) {
//            require([
//            "esri/Color",
//            "esri/graphic",
//            "esri/symbols/SimpleLineSymbol",
//            "esri/symbols/SimpleMarkerSymbol"
//            ],
//            function (Color, Graphic, SimpleLineSymbol, SimpleMarkerSymbol) {

//                //tb.deactivate();

//                if (dojo.byId('incidenciasForm').style.display == "block") {
//                    dojo.byId('incidenciasForm').style.display = "none";
//                }

//                else {
//                    dojo.byId('incidenciasForm').style.display = "none";
//                }

//                //// add the drawn graphic to the map
//                //var geometry = evt.geometry;

//                var symbol = new SimpleMarkerSymbol(
//                    SimpleMarkerSymbol.STYLE_CIRCLE,
//                    12,
//                    new SimpleLineSymbol(
//                    SimpleLineSymbol.STYLE_NULL,
//                    new Color([0, 0, 255, 0.9]),
//                    1
//                    ),
//                    new Color([0, 0, 255, 0.5])
//                );

//                //graphicpoint = new Graphic(geometry, symbol);
//                //this.map.graphics.add(graphicpoint);
//                //console.log(map.graphics);

//            });

//        }

        });


    return Widget;
        
    
});

