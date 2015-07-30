/*global define,location */
/*jslint sloppy:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
    //Default configuration settings for the application. This is where you'll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings and url parameters.
    "appid": "",
	"itemInfo": {
		"item": {
				"title":"Junta Castilla la Mancha app",
				"snippet": "Gestión carreteras de Castilla La Mancha",
				"extent": [[-7.2, 37],[1.5, 42]]
			},
        "itemData": {
				"operationalLayers": [{
				    "url": "http://qvialweb.es:6080/arcgis/rest/services/JCM/Visor_WEB/MapServer",
				  "visibility": true,
				  "opacity": 0.7,
				  "title": "Junta Castilla la Mancha App",
				  "itemId": false,
				}, {
				    "url": "http://qvialweb.es:6080/arcgis/rest/services/JCM/Actua_Extraordinaria_Prog_Conservaci%C3%B3n/MapServer",
				  "visibility": true,
				  "opacity": 0.7,
				  "title": "Programa de conservación",
				  "itemId": false,
				},{
				    "url": "http://qvialweb.es:6080/arcgis/rest/services/JCM/Modernizaci%C3%B3n_Prog_Modernizaci%C3%B3n/MapServer",
				  "visibility": true,
				  "opacity": 0.7,
				  "title": "Programa de modernización",
				  "itemId": false,
				},{
				    "url": "http://qvialweb.es:6080/arcgis/rest/services/JCM/Prog_Mejora_Funcionalidad_Red/MapServer",
				  "visibility": true,
				  "opacity": 0.7,
				  "title": "Programa de mejora de funcionalidad",
				  "itemId": false,
				}],
				
				"baseMap": {
				  "baseMapLayers": [{
					"opacity": 1,
					"visibility": true,
					"url": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer"
				  },
                {
					"isReference": true,
					"opacity": 1,
					"visibility": true,
					"url": "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer"
                }
				  ],
				  "title": "World_Terrain_Base"
				},
            "version": "1.1",
            "bookmarks": [
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 3857
                    },
                    "xmin": -305841,
                    "ymin": 4583166,
                    "xmax": -102111,
                    "ymax": 4793510
                },
                "name": "Albacete"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 3857
                    },
                    "xmin": -565398,
                    "ymin":  4629732,
                    "xmax": -304650,
                    "ymax": 4809517
                },
                "name": "Ciudad Real"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 3857
                    },
                    "xmin": -359419,
                    "ymin": 4754351,
                    "xmax": -134391,
                    "ymax": 4973824
                },
                "name": "Cuenca"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 3857
                    },
                    "xmin": -393550,
                    "ymin": 4887305,
                    "xmax": -172094,
                    "ymax": 5069471
                },
                "name": "Guadalajara"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 3857
                    },
                    "xmin": -605879,
                    "ymin": 4767766,
                    "xmax": -309016,
                    "ymax": 4806660
                },
                "name": "Toledo"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 3857
                    },
                    "xmin": -601910,
                    "ymin":  4610603,
                    "xmax": -150266,
                    "ymax": 5068598
                },
                "name": "Castilla la Mancha"
            }
            ]
        }
	},
    "webmap": false,
    "oauthappid": null, //"AFTKRmv16wj14N3z",
    //Group templates must support a group url parameter. This will contain the id of the group.
    //group: "",
    //Enter the url to the proxy if needed by the application. See the 'Using the proxy page' help topic for details
    //http://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "",
    "bingKey": "", //Enter the url to your organizations bing maps key if you want to use bing basemaps
    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "sharinghost": location.protocol + "//" + "www.arcgis.com",
    //If you need localization set the localize value to true to get the localized strings
    //from the javascript/nls/resource files.
    //Note that we've included a placeholder nls folder and a resource file with one error string
    //to show how to setup the strings file.
    "localize": true,
    "units": null,
    //Theme defines the background color of the title area and tool dialog
    //Color defines the text color for the title and details. Note that
    //both these values must be specified as hex colors.
    "theme": "#005196",
    "color": "#fff",
    //Specify the tool icon color for the tools on the toolbar and the menu icon.
    // Valid values are white and black.
    "icons": "white",
    "logo": "images/logo-web-qvixote240.png",

    //Set of tools that will be added to the toolbar
    "tools": [
        { "name": "legend", "enabled": true },
        { "name": "bookmarks", "enabled": true, "editable": true },
        { "name": "layers", "enabled": true },
        { "name": "basemap", "enabled": true },
        { "name": "overview", "enabled": true },
        { "name": "measure", "enabled": true },
        { "name": "edit", "enabled": false, "toolbar": false },
        { "name": "print", "enabled": true, "legend": true, "layouts": false, "format": "pdf" },
        { "name": "details", "enabled": true },
        { "name": "share", "enabled": true },
        { "name": "wmstool", "enabled": true },
        { "name": "incidencias", "enabled": true },
        { "name": "buscador", "enabled": true }
    ],
    //Set the active tool on the toolbar. Note home and locate can't be the active tool.
    //Set to "" to display no tools at startup
    "activeTool": "legend",
    //Add the geocoding tool next to the title bar.
    "search": true,
    //When searchExtent is true the locator will prioritize results within the current map extent.
    "searchExtent": false,
    //Add the home extent button to the toolbar
    "home": true,
    //Add the geolocation button on the toolbar. Only displayed if browser supports geolocation
    "locate": true,
    //When true display a scalebar on the map
    "scalebar": false,
    //Specify a title for the application. If not provided the web map title is used.
    "title": "Junta Castilla La Mancha App",
    //This option demonstrates how to handle additional custom url parameters. For example
    //if you want users to be able to specify lat/lon coordinates that define the map's center or
    //specify an alternate basemap via a url parameter.
    "urlItems": [
        "extent,color"
    ],
    //Replace these with your own bitly key
    "bitlyLogin": "esrimarketing",
    "bitlyKey": "R_52f84981da0e75b23aea2b3b20cbafbc",
    "wmslayers":
        [
            {
                name:"Cartociudad",
                url: "http://www.cartociudad.es/wms/CARTOCIUDAD/CARTOCIUDAD?"
               
            },
            {
                name: "Catastro",
                url: "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?"
              
            },
            {
                name: "PNOA máxima atualidad",
                url: "http://www.ign.es/wms-inspire/pnoa-ma?"
            },
            {
                name: "Espacios naturales",
                url: "http://wms.magrama.es/sig/Biodiversidad/INENP/wms.aspx?"

            },
            {
                name: "Magarama Paisaje",
                url: "http://wms.magrama.es/sig/Biodiversidad/Paisaje/wms.aspx?"

            }

           
        ]
});
