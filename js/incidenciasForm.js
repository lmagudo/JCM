(function () {
    var app = angular.module('incidencias', ['ui.bootstrap', 'ngMessages']);

    var mydate;

    app.controller('DatepickerDemoCtrl', function ($scope) {

        $scope.today = function () {
            $scope.date = new Date();
            console.log($scope);
        };
        //$scope.today();

        $scope.clear = function () {
            $scope.date = null;
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
    });

    app.controller('incidenciasController', function ($scope) {
        $scope.problemas = [];
        $scope.matriculas = [];
        $scope.promselected;
        $scope.showmessages = false;

        $scope.crearincidencia = function () {
            $scope.showmessages = true;

            //Oculto el formulario
            $('#incidenciasForm').hide();

            //Obtego los valores de la posición de ls inputs correspondientes
            $scope.X = parseFloat($("#posx").val());
            $scope.Y = parseFloat($("#posy").val());

            console.log($("#date").val());

            $scope.date = $("#date").val();

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
                    "IdMatricula": this.Matricula,
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
                IncidenciafeatureLayer = new esri.layers.FeatureLayer("http://qvialweb.es:6080/arcgis/rest/services/JCM/Base/FeatureServer/0", {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["Autor", "Problema", "Solucion", "IdMatricula", "fecha"]
                });

                var targetGraphic = new Graphic($scope.newfeature);
                IncidenciafeatureLayer.applyEdits([targetGraphic], null, null);
                console.log($scope.newfeature);
                console.log(targetGraphic);

                IncidenciafeatureLayer.on("edits-complete", function () {
                    console.log("Completada edición");
                });
            });
        };

        require(["esri/tasks/query", "esri/tasks/QueryTask"],
        function (Query, QueryTask) {
            var queryTask = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/prueba/MapServer/1");
            var query = new Query();
            query.returnGeometry = false;
            query.outFields = ["Problema"];
            query.where = "idProblema > 0";

            queryTask.execute(query, showResults);

            var queryTask2 = new QueryTask("http://qvialweb.es:6080/arcgis/rest/services/JCM/Base/MapServer/1");
            var query2 = new Query();
            query2.returnGeometry = false;
            query2.outFields = ["Matricula"];
            query2.where = "OBJECTID > 0";

            queryTask2.execute(query2, showResults2);
        });

        function showResults(results) {
            for (i = 0; i < results.features.length; i++) {
                $scope.problemas.push(results.features[i].attributes.Problema);
            };
            //Intento refrescar el div del form
            $("incidenciasForm").load("index.html");
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
                    $scope.matriculas.push(results.features[i].attributes.Matricula);
                }
                else { count = 0 }
            }
            //Intento refrescar el div del form
            $("incidenciasForm").load("index.html");
        };
    });
})();


