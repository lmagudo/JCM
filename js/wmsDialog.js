define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel", "dijit/_WidgetBase", "dijit/a11yclick", "dijit/_TemplatedMixin", "dojo/on",
// load template
"dojo/text!application/dijit/templates/wmsDialog.html", "dojo/i18n!application/nls/wmsDialog", "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "esri/request", "esri/urlUtils", "dijit/Dialog", "dojo/number", "dojo/_base/event"], function (
Evented, declare, lang, has, esriNS, _WidgetBase, a11yclick, _TemplatedMixin, on, dijitTemplate, i18n, domClass, domStyle, domAttr, domConstruct, esriRequest, urlUtils, Dialog, number, event) {
    var Widget = declare("esri.dijit.wmsDialog", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: dijitTemplate,
        options: {
            //theme: "ShareDialog",
            title: null,
            wmslayers: null
            
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

            this.css = {
                
                wmsDialogContent: "dialog-content",
               
            };
        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);
            //this._setExtentChecked();
            //this._shareLink();
            //this.own(on(this._extentInput, a11yclick, lang.hitch(this, this._useExtentUpdate)));

            this._creteLayerButtons(this.wmslayers);


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
            console.log("Creting layer buttons. Numero: " + wmslayers.length);
            if (wmslayers && wmslayers.length )
            {
                this._layersNode.innerHTML = "";
                var innerDiv = "";
                for (var i = 0 ; i < wmslayers.length ; i++)
                {
                    innerDiv += "<div id = 'title_" + wmslayers[i].name + "'>";
                    innerDiv += "<button>" + wmslayers[i].name + "</button>";
                    this._getWMSLayers(wmslayers[i], function (response) {
                        
                        innerDiv += response;
                        innerDiv += "</div>";
                        console.log(innerDiv);
                        this._layersNode
                    });
                   
                }
                
                this._layersNode.innerHTML = innerDiv;
            }
        },
        _getWMSLayers: function (wmslayer, callback)
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
                //console.log("Success: ", response);
                for (var i = 0 ; i < response.length; i++)
                {
                    div += "<span>" + response[i].Title + "</span>";
                }
                callback(div);
                
            }, function (error) {
                console.log("Error: ", error.message);
            });
            
          
        }

    });

    return Widget;
        
    
});