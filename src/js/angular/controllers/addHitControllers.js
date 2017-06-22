angular.module('editorial')
  .controller('AddHitCtrl', ['$scope', 'Basket', 'Hit', 'Scope', 'Settings', 'Merge',
      function($scope, Basket, Hit, Scope, Settings, Merge){

    $scope.hitListUrl =  Settings.baseUrl + 'api/hit/hits/search/?name=';
    $scope.clarification = {};
    $scope.newHit = { name: "" };
    $scope.showAddHitForm = { show: false };
    $scope.error = { msg: ""};

    $scope.addNewHit = function() {
      $scope.error = { msg: ""};

      if (Hit.nameInHits($scope.newHit.name, $scope.basket.basket.topic_hits)) {
        $scope.error.msg = "The submitted name is already on this topic.  Please add a different name.";
      } else {
        Basket.addNewHit($scope.basket.basket.id, $scope.newHit.name, addHitSuccess, addHitFailure);
      }
    };

    // Adding a hit can trigger many responses.  This function is a kind of
    // router, directing the proper angular action depending on the database response
    var addHitSuccess = function (response) {
      switch (response.editorialAction) {
        case 'nothing':
          $scope.showAddHitForm.show = false;
          break;
        case 'conflictExists':
          conflictExists(response.hits);
          break;
        case 'addHit':
          addHit(response.hit);
          break;
        default:
          break;
      }
    };

    var addHitFailure = function (response) {
      $scope.error.msg = response.data.error;
    };

    // Function called if submitted name shares slug with existing names
    function conflictExists (hit_list) {
      $scope.addHitForm = "templates/includes/clarification_radio.html";
      $scope.clarification.title = "Similar names found.";
      $scope.clarification.message = "";
      $scope.clarification.list = hit_list;
      $scope.clarification.secondary_action_text = "Disambiguate";

      // Function called when existing slug is chosen
      $scope.clarification.radio_submit = function () {

        var mergeSuccess = function (response) {
          $scope.set_basket(response);

          $scope.showAddHitForm.show = false;
        };

        Merge.merge($scope.clarification.value, $scope.basket.basket.id, mergeSuccess);

      };

      // Function called when new name is created
      $scope.clarification.secondary_action = function ($event) {
        $event.stopPropagation();
        $event.preventDefault();
        $scope.scopes = Scope.getAll();
        $scope.addOrSelectValue = 'scope';

        $scope.newHit.scope = '';
        $scope.newHit.basket = {display_name:  "Current Topic"};

        $scope.disambiguationHits = [$scope.newHit].concat(hit_list);

        $scope.addHitForm = "templates/includes/hitDisambiguationForm.html";

        $scope.scopeSubmit = function () {
          var disambiguationSuccess = function (response) {
            $scope.addHitToNamesList(response);

            $scope.showAddHitForm.show = false;
          };

          $scope.disambiguationHits[0].basket.id = $scope.basket.basket.id;
          // SEND: { hits: all the hits, basket_id: this baskets id }
          Basket.addNewHitDisambiguation($scope.disambiguationHits, disambiguationSuccess);
        };
      };
    }

    // generalized fucntion to add hit to topic_hits list and then hide add form
    function addHit (hit) {
      $scope.basket.basket.topic_hits.push(hit);

      $scope.showAddHitForm.show = false;
    }


    // Function called to initailized add hit form
    $scope.triggerAddHitForm = function () {
      $scope.newHit.name = "";
      $scope.addHitForm = "templates/includes/baseAddHitForm.html";

      $scope.showAddHitForm.show = true;
    };


}]);
