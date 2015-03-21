(function () {
    var app = angular.module('incidencias', ['ui.bootstrap', 'ngMessages']);

    var mydate;

    app.controller('DatepickerDemoCtrl', function ($scope) {
        var mydate = $scope.dt;
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
            console.log($scope.dt);
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
    });

    //Controlador para funcionalidad buscador
    app.controller('buscadorController', function ($scope) {
        $scope.provincias = ["Ciudad Real", "Cuenca", "Guadalajara", "Toledo"];
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
                query.outFields = ["Matricula_Plan", "idMatricula"];
                query.where = "OBJECTID > 0";

                queryTask.execute(query, showResults);

                function showResults(results) {

                    var count = 0;

                    for (i = 0; i < results.features.length; i++) {
                        for (j = 0; j < $scope.carreteras.length; j++) {
                            if (results.features[i].attributes.Matricula_Plan == $scope.carreteras[j]) {
                                count = 1
                            }
                        }
                        if (count == 0) {
                            //Relleno el combobox de matricula
                            $scope.carreteras.push(results.features[i].attributes.Matricula_Plan);
                            //Relleno el diccionario con los pares codigo/valor que corresponden a Matricula/idMatricula
                            $scope.dicCarreteras[results.features[i].attributes.Matricula_Plan] = results.features[i].attributes.idMatricula;
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
                    $scope.idMatricula = $scope.dicCarreteras[$scope.carretera];
                    console.log($scope.idMatricula);
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
                console.log($scope.municipios);
            };

            function showResults2(results) {

                for (i = 0; i < results.features.length; i++) {
                    $scope.poblaciones.push(results.features[i].attributes.Nucleo);
                };
                $scope.$apply();
                console.log($scope.poblaciones);
            };

            function showResults3(results) {

                for (i = 0; i < results.features.length; i++) {
                    $scope.pks.push(results.features[i].attributes.PKhito);
                };
                $scope.$apply();
                console.log($scope.pks);
            };

        };


        $scope.LanzarBuscador = function () {
            //Funcionalidad que se lanza cuando le damos al submmit
            console.log(selectorBuscador);
            //Capa a utilizar del servicio de mapa publicado
            var idcapa;
            switch (selectorBuscador) {
                case 1:
                    var whereclaus = "Matricula_Plan = '" + $scope.carretera + "'";
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
                    console.log(mygeometry);
                    TwoCartoMap.centerAndZoom(mygeometry, 11);
                }

            }

            function zoomtoResult(result) {
                console.log(result);
                //TwoCartoMap.setExtent(result.features[0].geometry.getExtent(), true);

                ///geometry service...
                //                require(["esri/SpatialReference", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters"], function (SpatialReference, GeometryService, ProjectParameters) {

                //                    var gsvc = new GeometryService("http://qvialweb.es:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                //                    var outSR = new SpatialReference(102100);
                //                    gsvc.project([result.features[0].geometry], outSR, function (projectedGeometry) {
                //                        TwoCartoMap.setExtent(projectedGeometry.getExtent(), true);
                //                    });
                //                
                //                
                //                });

                require(["esri/SpatialReference", "esri/tasks/GeometryService", "esri/tasks/ProjectParameters", "esri/geometry/Extent"],
                    function (SpatialReference, GeometryService, ProjectParameters, Extent) {
                        var gsvc = new GeometryService("http://qvialweb.es:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                        var params = new ProjectParameters();
                        var outSR = new SpatialReference(102100);
                        params.outSR = outSR;
                        params.geometries = [result.features[0].geometry];

                        gsvc.project(params, projectfeatures);

                        function projectfeatures(projectedGeometry) {
                            console.log(projectedGeometry)
                            console.log(projectedGeometry.type);
                            if (projectedGeometry.type == "point") {
                                console.log("soy punto");
                                TwoCartoMap.centerAndZoom(projectedGeometry, 11);
                            }
                            else {
                                var myextent = new Extent();
                                myextent = projectedGeometry.getExtent();
                                TwoCartoMap.setExtent(myextent, true);
                            }
                        }

                });                


            }

        }

        $scope.Cancelbusqueda = function () {
            //Cancelamos la busqueda
            $('#buscaForm').hide();
        }

    });


    //Controlador para funcionalidad incidencias
    app.controller('incidenciasController', function ($scope) {
        $scope.problemas = [];
        $scope.matriculas = [];
        $scope.promselected;
        $scope.showmessages = false;
        $scope.dicMatricula = new Object();
        $scope.dicProblema = new Object();

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
            console.log($scope.idProblema);

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
                    "fecha": "11/03/2015"
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



                //IncidenciafeatureLayer = new esri.layers.FeatureLayer("http://qvialweb.es:6080/arcgis/rest/services/JCM/Base/FeatureServer/0", {
                //    mode: FeatureLayer.MODE_ONDEMAND,
                //    outFields: ["Autor", "Problema", "Solucion", "IdMatricula", "fecha"]
                //});


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
