(function () {
    var app = angular.module('incidencias', ['ui.bootstrap', 'ngMessages']);

    //Controlador para funcionalidad buscador
    app.controller('buscadorController', function ($scope) {
        $scope.provincias = ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"];
        $scope.CoordSystems = ["WGS84", "UTM"];
        $scope.municipios = [];
        $scope.poblaciones = [];
        $scope.carreteras = [];
        $scope.pks = [];
        $scope.textoX;
        $scope.textoY;
        $scope.CoordSystemFinal;
        $scope.idMatricula;
        $scope.dicCarreteras = new Object();
        $scope.selector;

        //Relleno el combobox de carreteras
        require(["esri/tasks/query", "esri/tasks/QueryTask"],
            function (Query, QueryTask) {
                var queryTask = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Busquedas/MapServer/1");
                var query = new Query();
                query.returnGeometry = false;
                //query.outFields = ["Matricula_Plan", "idMatricula", "Titularidad"];
                query.outFields = ["Matricula", "idMatricula", "Titularidad"];
                query.where = "OBJECTID > 0";

                queryTask.execute(query, showResults);

                function showResults(results) {

                    var count = 0;
                    jsonObj = [];

                    //Función para ordenar un objeto a partir de un atributo
                    var by = function (attr) {
                        return function (o, p) {
                            var a, b;

                            if (typeof o === "object" && typeof p === "object" && o && p) {
                                a = o[attr];
                                b = p[attr];

                                if (a === b) {
                                    return 0;
                                }

                                if (typeof a === typeof b) {
                                    return a < b ? -1 : 1;
                                }

                                return typeof a < typeof b ? -1 : 1;

                            } else {

                                throw {
                                    name: "Error",
                                    message: "Esto no es un objeto, al menos no tiene la propiedad " + attr
                                };

                            }
                        };
                    };

                    for (i = 0; i < results.features.length; i++) {
                        //var Matricula_Plan = results.features[i].attributes.Matricula_Plan;
                        var Matricula_Plan = results.features[i].attributes.Matricula;
                        var idMatricula = results.features[i].attributes.idMatricula;
                        var Titularidad = results.features[i].attributes.Titularidad;

                        item = {}
                        item["Matricula_Plan"] = Matricula_Plan;
                        item["idMatricula"] = idMatricula;
                        item["Titularidad"] = Titularidad;

                        jsonObj.push(item);
                    }

                    jsonObj.sort(by("Titularidad"));

                    for (i = 0; i < jsonObj.length; i++) {
                        for (j = 0; j < $scope.carreteras.length; j++) {
                            if (jsonObj[i].Matricula_Plan == $scope.carreteras[j].Matricula_Plan) {
                                count = 1
                            }
                        }
                        if (count == 0) {
                            //Relleno el combobox de matricula
                            if (jsonObj[i].Titularidad == '999') {
                                jsonObj[i].Titularidad = 'Otras';
                            }
                            //$scope.carreteras.push(jsonObj[i].Matricula_Plan);
                            $scope.carreteras.push(jsonObj[i]);
                            
                            //Relleno el diccionario con los pares codigo/valor que corresponden a Matricula/idMatricula                            
                            $scope.dicCarreteras[jsonObj[i].Matricula_Plan] = jsonObj[i].idMatricula;
                        }
                        else { count = 0 }
                    }


                    //Refresco mi modelo de datos en el form
                    $scope.$apply();

                };

            });

        //Función para cambio en combobox
        $scope.change = function (id) {

            //Borro las consultas anteriores
            $scope.municipios.length = 0;
            $scope.poblaciones.length = 0;
            $scope.pks.length = 0;

            switch (id) {
                case 1:
                    var prov = $scope.provincia;
                    require(["esri/tasks/query", "esri/tasks/QueryTask"],
                    function (Query, QueryTask) {
                        //Query para cargar municipios
                        var queryTask = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Busquedas/MapServer/3");
                        var query = new Query();
                        query.returnGeometry = false;
                        query.outFields = ["Texto"];
                        query.where = "Provincia = '" + prov + "'";

                        queryTask.execute(query, showResults);

                        //Query para cargar poblaciones
                        var queryTask2 = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Busquedas/MapServer/2");
                        var query2 = new Query();
                        query2.returnGeometry = false;
                        query2.outFields = ["Nucleo"];
                        query2.where = "Provincia = '" + prov + "'";

                        queryTask2.execute(query2, showResults2);

                    });
                    break;
                case 2:
                    //Obtengo mediante el diccionario, el valor de la clave que corresponde a la matricula elegida por el usuario
                    //$scope.idMatricula = $scope.dicCarreteras[$scope.carretera];
                    $scope.idMatricula = $scope.carretera;
                    require(["esri/tasks/query", "esri/tasks/QueryTask"],
                    function (Query, QueryTask) {
                        //Query para cargar pks
                        var queryTask = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Busquedas/MapServer/0");
                        var query = new Query();
                        query.returnGeometry = false;
                        query.outFields = ["PKhito"];
                        query.where = "idMatricula = '" + $scope.idMatricula + "'";

                        queryTask.execute(query, showResults3);

                    });
                    break;
                case 3:
                    if ($scope.CoordSystem == "UTM") {
                        $scope.textoX = "X:";
                        $scope.textoY = "Y:";
                        $scope.CoordSystemFinal = 25830;
                    }
                    else {
                        $scope.textoX = "Longitud:";
                        $scope.textoY = "Latitud";
                        $scope.CoordSystemFinal = 4326;
                    }
                    break;
            }

            function showResults(results) {

                for (i = 0; i < results.features.length; i++) {
                    $scope.municipios.push(results.features[i].attributes.Texto);
                };
                $scope.$apply();
            };

            function showResults2(results) {

                for (i = 0; i < results.features.length; i++) {
                    $scope.poblaciones.push(results.features[i].attributes.Nucleo);
                };
                console.log($scope.poblaciones);
                $scope.$apply();
            };

            function showResults3(results) {

                for (i = 0; i < results.features.length; i++) {
                    $scope.pks.push(results.features[i].attributes.PKhito);
                };
                $scope.$apply();
            };

        };

        //Función que controla el submmit
        $scope.LanzarBuscador = function () {

            //Capa a utilizar del servicio de mapa publicado
            var idcapa;
            switch (selectorBuscador) {
                case 1:
                    var whereclaus = "idMatricula = '" + $scope.carretera + "'";
                    idcapa = 1;
                    myrequest(whereclaus, idcapa, null);
                    break;
                case 2:
                    var whereclaus = "PKhito = '" + $scope.PK + "'" + " AND " + "idMatricula = '" + $scope.idMatricula + "'";
                    idcapa = 0;
                    myrequest(whereclaus, idcapa, null);
                    break;
                case 3:
                    var whereclaus = "Texto = '" + $scope.municipio + "'";
                    idcapa = 3;
                    myrequest(whereclaus, idcapa, null);
                    break;
                case 4:
                    var whereclaus = "Nucleo = '" + $scope.poblacion + "'";
                    idcapa = 2;
                    myrequest(whereclaus, idcapa, null);
                    break;
                case 5:
                    require(["esri/geometry/Point", "esri/SpatialReference"],
                        function (Point, SpatialReference) {
                            var mypoint = new Point($scope.Longitud, $scope.Latitud, new SpatialReference({ wkid: $scope.CoordSystemFinal }));
                            myrequest(null, null, mypoint);
                        });
                    break;
            }

            function myrequest(whereclaus, idcapa, mygeometry) {

                if (mygeometry == null) {
                    require(["esri/tasks/query", "esri/tasks/QueryTask"],
                    function (Query, QueryTask) {
                        //Query para cargar pks
                        var queryTask = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Busquedas/MapServer/" + idcapa.toString());
                        var query = new Query();
                        query.returnGeometry = true;
                        query.where = whereclaus;

                        queryTask.execute(query, zoomtoResult);

                    });
                }
                else {
                    TwoCartoMap.centerAndZoom(mygeometry, 12);
                    $('#buscaForm').hide();
                }

            }

            function zoomtoResult(result) {
                console.log(result);
                require(["esri/SpatialReference", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "esri/geometry/Extent"],
                    function (SpatialReference, GeometryService, ProjectParameters, Extent) {
                        var gsvc = new GeometryService("http://qvialweb.es:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                        var params = new ProjectParameters();
                        var outSR = new SpatialReference(102100);
                        params.outSR = outSR;

                        var geoms = [];
                        for (var i = 0; i < result.features.length; i++) {
                            geoms.push(result.features[i].geometry);
                        }

                        params.geometries = geoms;

                        gsvc.project(params, projectfeatures);


                        function projectfeatures(projectedGeometry) {

                            if (projectedGeometry[0].type == "point") {
                                TwoCartoMap.centerAndZoom(projectedGeometry[0], 12);
                            }
                            else {
                                var myextent = new Extent();
                                myextent = projectedGeometry[0].getExtent();
                                TwoCartoMap.setExtent(myextent, true);
                            }
                        }

                    });

                //Oculto el formulario
                $('#buscaForm').hide();

            }

        }

        $scope.Cancelbusqueda = function () {
            //Cancelamos la busqueda
            $('#buscaForm').hide();
        }

    });


    //Controlador para funcionalidad incidencias
    app.controller('incidenciasController', function ($scope, $filter) {
        $scope.problemas = [];
        $scope.matriculas = [];
        $scope.promselected;
        $scope.showmessages = false;
        $scope.dicMatricula = new Object();
        $scope.dicProblema = new Object();


        //Funciones y variables que pertenecen al datapicker
        $scope.today = function () {
            $scope.dt = new Date();
        };
        //$scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        //Fin funcionalidad datapicker


        $scope.CancelIncidencia = function () {
            TwoCartoMap.graphics.clear();
            $('#incidenciasForm').hide();
            TwoCartoMap.enableScrollWheelZoom();
        };

        $scope.crearincidencia = function () {

            $scope.showmessages = true;

            //Oculto el formulario
            $('#incidenciasForm').hide();

            $scope.X = TwoCartoMap.graphics.graphics[0].geometry.getLongitude().toString();
            $scope.Y = TwoCartoMap.graphics.graphics[0].geometry.getLatitude().toString();

            //Obtengo mediante el diccionario, el valor de la clave que corresponde al problema elegido por el usuario
            $scope.idProblema = $scope.dicProblema[$scope.problema];

            //Obtengo mediante el diccionario, el valor de la clave que corresponde a la matricula elegida por el usuario
            $scope.idMatricula = $scope.dicMatricula[$scope.Matricula];

            //Creo el gráfico
            $scope.newfeature = {
                "geometry": {
                    "x": this.X,
                    "y": this.Y,
                    "spatialReference": {
                        "wkid": 4326
                    }
                },
                "attributes": {
                    "Autor": this.Autor,
                    "Problema": this.problema,
                    "Solucion": this.Solucion,
                    "idProblema": this.idProblema,
                    "IdMatricula": this.idMatricula,
                    "idctramo": this.Matricula,
                    "fecha": $filter('date')($scope.dt, "dd/MM/yyyy") //Aplicamos un filter a la fecha para que se ajuste al formato que se utiliza en la bbdd
                },
                "symbol": {
                    "color": [255, 0, 0, 128],
                    "size": 12,
                    "angle": 0,
                    "xoffset": 0,
                    "yoffset": 0,
                    "type": "esriSMS",
                    "style": "esriSMSSquare",
                    "outline": {
                        "color": [0, 0, 0, 255],
                        "width": 1,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    }
                }
            };

            require(["esri/layers/FeatureLayer", "esri/graphic", "dojo/domReady!"],
            function (FeatureLayer, Graphic) {


                IncidenciafeatureLayer = new esri.layers.FeatureLayer("http://qvialweb.es:6080/arcgis/rest/services/JCM_SECURE/Base_Edit/FeatureServer/0", {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["Autor", "Problema", "Solucion", "IdMatricula", "fecha"]
                });

                var targetGraphic = new Graphic($scope.newfeature);
                IncidenciafeatureLayer.applyEdits([targetGraphic], null, null);
                TwoCartoMap.enableScrollWheelZoom();

                IncidenciafeatureLayer.on("edits-complete", function () {
                    console.log("Completada edición");
                    TwoCartoMap.graphics.clear();
                    TwoCartoMap.refresh();
                });
            });
        };

        require(["esri/tasks/query", "esri/tasks/QueryTask"],
        function (Query, QueryTask) {
            var queryTask = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/prueba/MapServer/1");
            var query = new Query();
            query.returnGeometry = false;
            query.outFields = ["Problema", "idProblema"];
            query.where = "idProblema > 0";

            queryTask.execute(query, showResults);

            var queryTask2 = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Base/MapServer/1");
            var query2 = new Query();
            query2.returnGeometry = false;
            query2.outFields = ["Matricula", "idMatricula"];
            query2.where = "OBJECTID > 0";

            queryTask2.execute(query2, showResults2);
        });

        function showResults(results) {
            for (i = 0; i < results.features.length; i++) {
                $scope.problemas.push(results.features[i].attributes.Problema);
                //Relleno el diccionario de Problemas con los pares codigo/valor que corresponden a Problema/idProblema
                $scope.dicProblema[results.features[i].attributes.Problema] = results.features[i].attributes.idProblema;
            };
            //Intento refrescar el div del form
            $scope.$apply();
        };

        function showResults2(results) {

            var count = 0;

            for (i = 0; i < results.features.length; i++) {
                for (j = 0; j < $scope.matriculas.length; j++) {
                    if (results.features[i].attributes.Matricula == $scope.matriculas[j]) {
                        count = 1
                    }
                }
                if (count == 0) {
                    //Relleno el combobox de matricula
                    $scope.matriculas.push(results.features[i].attributes.Matricula);
                    //Relleno el diccionario con los pares codigo/valor que corresponden a Matricula/idMatricula
                    $scope.dicMatricula[results.features[i].attributes.Matricula] = results.features[i].attributes.idMatricula;
                }
                else { count = 0 }
            }
            //Intento refrescar el div del form
            $scope.$apply();
        };
    });
})();
