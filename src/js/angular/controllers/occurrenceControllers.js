angular.module('editorial')
.controller('SingleOccurrenceCtrl', ['$scope', 'Occurrence', 'Deletion', 'Utils',
    function ($scope, Occurrence, Deletion, Utils) {
  // Construct the name of the occurrence depending on the available attributes
  var author = $scope.occurrence.location.document.author ? $scope.occurrence.location.document.author + ', ' : '';
  var localid = $scope.occurrence.location.localid ? ', ' + $scope.occurrence.location.localid.replace('_', ' ') : '';
  var name = author + $scope.occurrence.location.document.title + localid;

  $scope.removeOccurrence = function () {
    Deletion.removeItem({
      title: "Remove Occurrence?",
      body: "Are you sure you want to remove the Occurrence " + name + '?',
      actionName: "Remove",
      item: $scope.occurrence,
      list: $scope.basket.basket.occurs,
      deletionFunction: Occurrence.remove
    });
  };

  // move occurrence information
  $scope.moveOccurrence = function () {
    Deletion.removeItem({
      body: name,
      title: $scope.basket.basket.id, // reusing title property to pass basket_id into controller
      controller: 'MoveOccurrenceModalCtrl',
      templateUrl: 'templates/includes/moveOccurrenceModal.html',
      item: $scope.occurrence,
      list: $scope.basket.basket.occurs,
      deletionFunction: function (occurrence_id, success, failure, result) {
        Occurrence.move(occurrence_id, result, success, failure);
      }
    });

  };
  
}]);


angular.module('editorial')
.controller('SingleOccurrenceOnDocumentCtrl', ['$scope', 'Occurrence', 'Deletion', function ($scope, Occurrence, Deletion) {
  
  $scope.removeOccurrence = function () {
    Deletion.removeItem({
      title: "Remove Occurrence?",
      body: "Are you sure you want to remove the Occurrence from this paragraph?",
      actionName: "Remove",
      item: $scope.occurrence,
      list: $scope.location.occurrences,
      deletionFunction: Occurrence.remove
    });
  };
}]);


angular.module('editorial')
.controller('AddOccurrenceCtrl', ['$scope', 'Occurrence', 'Settings', function ($scope, Occurrence, Settings) {
  $scope.addOccurrenceForm = { show: false };
  $scope.basket = {};
  $scope.highlightedText = "";
  $scope.error = {};

  $scope.triggerAddOccurrenceForm = function () {
    $scope.addOccurrenceForm.show = true;
  };

  $scope.getSelectedText = function () {
    $scope.highlightedText = "";
    $scope.error.withHit = "";

    if (window.getSelection) {
      $scope.highlightedText = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      $scope.highlightedText = document.selection.createRange().text;
    }

  };

  $scope.hitListUrl = Settings.baseUrl + 'api/hit/hits/search/?as_object=True&name=';

  $scope.addOccurrence = function () {
    var addOccurrenceSuccess = function (response) {
      $scope.location.occurrences.push(response);
      $scope.addOccurrenceForm.show = false;
    };

    var addOccurrenceFailure = function (response) {
      console.log(response.data);
    };

    Occurrence.create(
      $scope.location.id, $scope.basket.originalObject.basket,
      addOccurrenceSuccess, addOccurrenceFailure
    );
  };

  $scope.addTopicAndOccurrence = function () {
    $scope.error.withHit = "";

    var addOccurrenceSuccess = function (response) {
      $scope.location.occurrences.push(response);
      $scope.highlightedText = ""; 
    };

    var addOccurrenceFailure = function (response) {
      $scope.highlightedText = ""; 
      if(response.data && response.data.error) {
        $scope.error.withHit = response.data.error;
      }

      console.log(response.data);
    };

    Occurrence.createWithHit(
        $scope.location.id, $scope.highlightedText,
      addOccurrenceSuccess, addOccurrenceFailure
    );
  };

}]);


angular.module('editorial')
.controller('AddOrCreateOccurrenceCtrl', ['$scope', 'Occurrence', 'Hit', 
    function ($scope, Occurrence, Hit) {
  $scope.addOccurrenceForm = { show: false };
  $scope.formData = {};
  $scope.hits = Hit.all();
  $scope.addOrSelectValue = 'name';

  $scope.triggerAddOccurrenceForm = function () {
    $scope.formData = {};
    $scope.addOccurrenceForm.show = true;
  };

  $scope.addOccurrence = function () {
    var success = function (response) {
      $scope.addOccurrenceForm.show = false;
      $scope.location.occurrences.push(response);
    };

    var failure = function (response) {
      console.log(response.data);
    };

    Occurrence.createFromUISelect($scope.location.id, $scope.formData.hit, success, failure);
  };
}]);


angular.module('editorial')
.controller('AddOccurrenceToBasketCtrl', ['$scope', 'Occurrence', 'Document',
    function ($scope, Occurrence, Document) {
  $scope.showOccurrenceForm = { show: false };

  $scope.triggerOccurrenceForm = function () {
    $scope.sources = Document.getAll();
    $scope.source = "";
    $scope.showOccurrenceForm.show = true;
    $scope.newOccurrence = {
      location: ""
    };
  };

  $scope.getLocations = function () {
    var documentSuccess = function (response) {
      $scope.selectedDocument = response;
      $scope.newOccurrence.location = response.locations[0].id;
    };

    var documentFailure = function (response) {
      console.log(response.data)
    };

    Document.detail($scope.source, documentSuccess, documentFailure);
  };

  $scope.locationDisplay = function (l) {
    var ellipses = l.content.length > 25 ? '...' : '',
        locationText = l.localid.replace('_', ' ') + ': ' + l.content.slice(0, 25) + ellipses;

    return locationText;
  };

  $scope.addOccurrence = function () {
    var addOccurrenceSuccess = function (response) {
      $scope.basket.basket.occurs.push(response);
      $scope.showOccurrenceForm.show = false;
    };

    var addOccurrenceFailure = function (response) {
      console.log(response.data);
    };

    Occurrence.createOnBasket($scope.newOccurrence.location, $scope.basket.basket.id, addOccurrenceSuccess, addOccurrenceFailure);
  };
}]);
