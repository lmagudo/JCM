define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/incidenciasDialog.html", "dojo/i18n!application/nls/incidenciasDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event"], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event) {
        
    var docu = this.document;

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
           
            var div = "";
            var id = 'incidenciasForm';
            div += "<div class='contenedor'><button id='btnIncidencias' class='btn_incidencias'>Crear Incidencia</button></div>";
            
            document.getElementById("layerButton").innerHTML = div;
            var boton = document.getElementsByClassName("btn_incidencias")[0];

            boton.addEventListener("click", function (evt) {
                console.log("click");
                showFormIncidencias();
            });

            var map = map;
            var tb;
            function showFormIncidencias()
            {
                console.log("¿Está el mapa....?");
                console.log(map);                
                
                map.graphics.clear();

                require(["esri/toolbars/draw"], function(){
                    tb = new esri.toolbars.Draw(map);
                    tb.on("draw-end", _DrawResults);
                    tb.activate(esri.toolbars.Draw.POINT);
                });

                function _DrawResults(evt) {
                    require([
                    "esri/Color",
                    "esri/graphic",
                    "esri/symbols/SimpleLineSymbol",
                    "esri/symbols/SimpleMarkerSymbol"
                    ],
                    function (Color, Graphic, SimpleLineSymbol, SimpleMarkerSymbol) {

                        tb.deactivate();

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

                        var graphicpoint = new Graphic(geometry, symbol);
                        map.graphics.add(graphicpoint);

                        _Popup("incidenciasForm", geometry);

                    });

                }

                function _Popup(id, geometry) {
                    
                    if (dojo.byId(id).style.display == "none") {
                        dojo.byId(id).style.display = "block";

                        //Cierro el panel de la derecha
                        closePage(0);
                        // Obtengo la latitud y la longitud de la geometría del punto
                        var x = geometry.getLongitude().toString();
                        var y = geometry.getLatitude().toString();
                        //relleno los inputs del form para la x y la y
                        $("#posx").val(x);
                        $("#posy").val(y);

                    }

                    else {
                        dojo.byId(id).style.display = "none";
                    }
                }


                function closePage (num) {

                    require([
                        "dojo/_base/html", "dojo/dom"
                    ],
                    function(html, dom){
                        var box = html.getContentBox(dom.byId("panelContent"));

                        var startPos = this.curTool * box.h;
                        var endPos = num * box.h;
                        var diff = Math.abs(num - this.curTool);
                        this.snap = false;
                        if (diff == 1) {
                            this._animateScroll(startPos, endPos);
                        } else {
                            document.body.scrollTop = endPos;
                            document.documentElement.scrollTop = endPos;
                            this.snap = true;
                        }
                        this.curTool = num;
                    });
                }


            }
        }

        });


    return Widget;
        
    
});

