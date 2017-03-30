angular.module('editorial')
.controller('AllReportsCtrl', ['$scope', 'Report', function ($scope, Report) {
  $scope.reports = Report.all();
  $scope.reportTypes = Report.allTypes();
}]);


angular.module('editorial')
.controller('NewReportCtrl', ['$scope', 'Report', 'Settings', 
    function ($scope, Report, Settings) {
  $scope.generating = false;
  $scope.showNewReportForm = { show: false };

  $scope.generateReport = function () {
    $scope.error = "";

    var reportSuccess = function (response) {
      response.location = Settings.baseUrl.slice(0, Settings.baseUrl.length - 1) + response.location;
      $scope.reports.push(response);
      $scope.generating = false;
      $scope.showNewReportForm.show = false;  
    };

    var reportFailure = function (response) {
      console.log(response.data);
      $scope.error = response.data;
      $scope.generating = false;
    };

    if (!$scope.newReportType) {
      $scope.error = "Please Select a Report Type";
    } else {
      $scope.generating = true;
      Report.generate($scope.newReportType, reportSuccess, reportFailure);
    }
  };

  $scope.triggerGenerateReportForm = function () {
    $scope.showNewReportForm.show = true;  
  };
}]);


angular.module('editorial')
.controller('SingleReportCtrl', ['$scope', 'Report', 'Utils', 'Deletion',
    function ($scope, Report, Utils, Deletion) {

  $scope.destroy = function () {
    Deletion.removeItem({
      title: "Delete Report?",
      body: "Are you sure you want to delete the report " + $scope.report.time + " (" + $scope.report.topic_set + ")?  This cannot be undone.",
      actionName: "Delete",
      item: $scope.report,
      list: $scope.reports,
      deletionFunction: Report.destroy
    });
  };
}]);
