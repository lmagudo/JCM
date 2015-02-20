define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/incidenciasDialog.html", "dojo/i18n!application/nls/incidenciasDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event"], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event) {
    
    var Widget = declare("esri.dijit.incidenciasDialog", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: dijitTemplate,
        options: {
            //theme: "ShareDialog",
            title: window.document.title,
            
        },
        // lifecycle: 1
        constructor: function (options, srcRefNode) {
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            this._i18n = i18n;
            
            this.set("title", defaults.title);
            
            this.css = {
                
                incidenciasDialogContent: "dialog-content",
               
            };
        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);
            this._creteLayerButtons();
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
        _creteLayerButtons: function ()
        {
            var div = "";
            div += "<div class='contenedor'><button class='btn_incidencias' onclick='Popup('incidenciasForm')'>Crear Incidencia</button></div>";
            //this.document.getElementById("layerButton").innerHTML = div;
        }

        });
    return Widget;
        
    
});

function Popup(id) {
    
    $('incidenciasForm').load('index.html');
    if (dojo.byId(id).style.display == "none") {
        dojo.byId(id).style.display = "block";
    }

    else {
        dojo.byId(id).style.display = "none";
    }     
}