define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/buscadorDialog.html", "dojo/i18n!application/nls/buscadorDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event"], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event) {
        
    var docu = this.document;

    var Widget = declare("esri.dijit.buscadorDialog", [_WidgetBase, _TemplatedMixin, Evented], {
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
                
                buscadorDialogContent: "dialog-content",
               
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
                title: i18n.widgets.buscadorDialog.title,
                draggable: false
            }, domConstruct.create("div"));
            this.set("dialog", dialog);

            // loaded
            this.set("loaded", true);
            this.emit("load", {});
        },
        _creteLayerButtons: function (map)
        {  
            var cblist = docu.getElementsByClassName("myradiobuttons");

            for (var i = 0 ; i < cblist.length; i++)
            {
                cblist[i].addEventListener("click", function (evt) {

                    var checked = evt.target.checked;
                    var index = evt.target.parentNode.id;
                    var attributes = evt.target.attributes;                    
                    
                    toogleLayerto(index, checked, attributes);
                });
            }

            function toogleLayerto(index, checked, attributes){
                    
                dojo.byId("buscaForm").style.display = "block";
                var idradio = attributes[2].value
                switch (idradio){
                    case "radioOne":
                        //Variable globar que me dice que ha seleccionado el usuario
                        selectorBuscador = 1;
                        $('#FielsetProvincia').hide();
                        $('#FielsetMunicipio').hide();                        
                        $('#FielsetPoblacion').hide();
                        $('#FielsetCarretera').show();
                        $('#FielsetPK').hide();
                        $('#FielsetLongitud').hide();
                        $('#FielsetLatitud').hide();
                        break;
                    case "radioTwo":
                        //Variable globar que me dice que ha seleccionado el usuario
                        selectorBuscador = 2;
                        $('#FielsetProvincia').hide();
                        $('#FielsetMunicipio').hide();                        
                        $('#FielsetPoblacion').hide();
                        $('#FielsetCarretera').show();
                        $('#FielsetPK').show();
                        $('#FielsetLongitud').hide();
                        $('#FielsetLatitud').hide();
                        break;
                    case "radioThree":
                        //Variable globar que me dice que ha seleccionado el usuario
                        selectorBuscador = 3;
                        $('#FielsetProvincia').show();
                        $('#FielsetMunicipio').show();                        
                        $('#FielsetPoblacion').show();
                        $('#FielsetCarretera').hide();
                        $('#FielsetPK').hide();
                        $('#FielsetLongitud').hide();
                        $('#FielsetLatitud').hide();
                        break;
                    case "radioFour":
                        //Variable globar que me dice que ha seleccionado el usuario
                        selectorBuscador = 4;
                        $('#FielsetProvincia').hide();
                        $('#FielsetMunicipio').hide();                        
                        $('#FielsetPoblacion').hide();
                        $('#FielsetCarretera').hide();
                        $('#FielsetPK').hide();
                        $('#FielsetLongitud').show();
                        $('#FielsetLatitud').show();
                        break;
                }
            }
        }

    });


    return Widget;
        
    
});