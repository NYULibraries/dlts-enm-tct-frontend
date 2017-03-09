angular.module('editorial')
.factory('Deletion', ['ModalService', 'Utils', function (ModalService, Utils) {
  var services = {};

  services.removeItem = function (options) {
    var template = options.templateUrl || 'templates/includes/modal.html',
        controller = options.controller || 'DeleteModalCtrl',
        success = options.success || function () {
          Utils.removeFromList(options.item, options.list);
        },
        failure = options.failure || function (response) {
            console.log(response.data);
        },
        item = options.item || {};

    var modalContent = {
      title: options.title || "Remove Item?",
      body: options.body || "Are you sure you want to remove this item?",
      actionName: options.actionName || "Remove"
    };

    var onDelete = function (confirmation) {
      if (confirmation) {
        options.deletionFunction(item.id, success, failure, confirmation);
      }
    };

    ModalService.showModal({
        templateUrl: template,
        controller: controller,
        inputs: modalContent
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(onDelete);
    });

  };

  return services;
}]);
