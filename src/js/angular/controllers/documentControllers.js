angular.module('editorial')
.controller('DocumentListCtrl', ['$scope', 'Document', function ($scope, Document) {
  $scope.documents = Document.getAll();
}]);

angular.module('editorial')
.controller('DocumentDetailWithOccurrencesCtrl', ['$scope', 'Document', '$routeParams', function ($scope, Document, $routeParams) {
  var locationGetSuccess = function (response) {
    $scope.locations = response;
    $scope.setActive(response[0].id);
    $scope.loading = false;
  };

  var locationGetFailure = function (response) {
    console.log(response.data);
  };

  $scope.loading = true;
  Document.detailWithOccurrences($routeParams.documentID, locationGetSuccess, locationGetFailure);

  $scope.setActive = function (id) {
    $scope.active = id;
  };
}]);


angular.module('editorial')
.controller('DocumentDetailCtrl', ['$scope', 'Document', '$routeParams', function ($scope, Document, $routeParams) {

  var documentGetSuccess = function (response) {
    // Sort Locations by sequence_number
    $scope.document = response;

    $scope.document.locations.sort(function (a, b) {
      if (a.sequence_number > b.sequence_number) {
        return 1;
      }
      if (a.sequence_number < b.sequence_number) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    $scope.loading = false;
  };

  var documentGetFailure = function (response) {
    $scope.loading = false;
    console.log(response.data);
  };

  $scope.loading = true;
  Document.detail($routeParams.documentID, documentGetSuccess, documentGetFailure);
}]);


angular.module('editorial')
.controller('SingleDocumentCtrl', ['$scope', 'Document', 'Deletion',
    function ($scope, Document, Deletion) {

  $scope.removeDocument = function () {
    Deletion.removeItem({
      title: "Delete Document?",
      body: 'Are you sure you want to remove the Document "' + document.title + '"?  This will remove all associated occurrences and content.  Any topics that only have occurrences from this document will also be deleted.',
      actionName: 'Delete',
      item: $scope.document,
      list: $scope.documents,
      deletionFunction: Document.remove
    });
  };
}]);


angular.module('editorial')
.controller('NewDocumentCtrl', ['$scope', 'Extraction', function ($scope, Extraction) {
  $scope.showNewDocForm = { show: false };
  $scope.newDoc = { source: "" };
  $scope.extracting = false;

  $scope.triggerNewDocForm = function () {
    $scope.newDoc.source = "";
    $scope.showNewDocForm.show = true;
  };

  $scope.addNewDoc = function () {
    $scope.extracting = true;

    var success = function (response) {
      $scope.showNewDocForm.show = false;
      $scope.documents.push(response);
      $scope.extracting = false;
    };

    var failure = function (response) {
      $scope.extracting = false;
      console.log(response.data);
    };

    Extraction.single($scope.newDoc.source, success, failure);
  };
}]);


angular.module('editorial')
.controller('ProcessDocumentsCtrl', ['$scope', 'Extraction', function ($scope, Extraction) {
  $scope.processing = false;

  $scope.reprocessAll = function () {
    $scope.processing = true;

    var success = function (response) {
      $scope.processing = false;
    };

    var failure = function (response) {
      $scope.extracting = false;
      console.log(response.data);
    };

    var sources = $scope.documents.map(function (x) { return x.id; });

    Extraction.reprocess(sources, success, failure);
  };

}]);
