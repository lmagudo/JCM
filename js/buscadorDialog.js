define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/buscadorDialog.html", "dojo/i18n!application/nls/buscadorDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event", 'esri/geometry/Extent'], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event, Extent) {

    var Widget = declare("esri.dijit.buscadorDialog", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: dijitTemplate,
        options: {
            title: null,
            map: null
            
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
            this.set("map", defaults.map);
            
            this.css = {
                
                buscadorDialogContent: "dialog-content",
               
            };

        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);

            //this._creteLayerButtons(this.wmslayers);
            this._creteLayerButtons(this.map);
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
                title: i18n.widgets.buscadorDialog.title,
                draggable: false
            }, domConstruct.create("div"));
            this.set("dialog", dialog);

            // loaded
            this.set("loaded", true);
            this.emit("load", {});
        }
        ,
        _creteLayerButtons: function (map)
        {
            
        }
        

    });

   

    return Widget;
        
    
});