(function () {
    var app = angular.module('incidencias', ['ui.bootstrap']);

    app.controller('DatepickerDemoCtrl', function ($scope) {
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
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    });

    app.controller('incidenciasController', function ($scope) {
        $scope.incident = properties;
        $scope.problemas = [];
        $scope.matriculas = [];
        $scope.promselected;

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
            for (i = 0; i < results.features.length; i++) {
                console.log(results);
                $scope.matriculas.push(results.features[i].attributes.Matricula);
            };
            //Intento refrescar el div del form
            $("incidenciasForm").load("index.html");
            console.log($scope.matriculas);
        };

        $scope.OK = function () {

        }




    });

    var properties = {
        showbuttom: false
    };

})();


