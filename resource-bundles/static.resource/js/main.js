angular
.module('angular-open-ops-dashboard', ['iso.directives'])
.filter('probCl', function() {
  return function(prob) {
    if (prob >= 75) return 'green';
    else if (prob >= 50) return 'yellow';
    else if (prob >= 25) return 'orange';
    else return 'red';
  };
})
.controller('DashboardController', ['$scope', function($scope) {
  // init
  $scope.op = new $RO.Op();
  $scope.opsList = [];
  $scope.stageNames = [];
  $scope.showAdd = false;
  $scope.addPanelClass = 'hidden';

  // define scope functions
  $scope.updateOps = function(err, ops) {
    if (err) console.log(err);
    if (ops && ops.length) {
      $scope.$apply(function() {
        $scope.opsList = $scope.opsList.concat(ops.map(function(op) {
          return op._props;
        }));
        $scope.$emit('iso-method', {name:null, params:null});
      });
    }
  };

  $scope.addOp = function() {
    var op = new $RO.Op({
      Name: $scope.name,
      Amount: $scope.amount,
      StageName: $scope.stage,
      CloseDate: new Date()
    });
    op.create(function(err) {
      if (err) console.log(err);
    });
  };

  $scope.updateNewOp = function(id) {
    $scope.op.retrieve({
      where: {
        Id: { eq: id }
      }
    }, $scope.updateOps);
  };

  $scope.showAddPanel = function() {
    $scope.showAdd = !$scope.showAdd;
    $scope.addPanelClass = $scope.showAdd ? 'animated bounceIn' : 'animated fadeOut';
  };

  // fetch op metadata
  $scope.op.describe(function(err, meta) {
    if (err) console.log(err);
    else {
      var stageNames = meta.fields.filter(function(field) {
        return field.name == 'StageName';
      })[0].picklistValues.filter(function(item) {
        return item.active;
      });

      $scope.$apply(function() {
        $scope.stage = stageNames[0].value;
        $scope.stageNames = stageNames;
      });
    }
  });

  // fetch initial set of records
  $scope.op.retrieve({
    where: {
    IsClosed: { eq: false }
  }}, $scope.updateOps);

}]);
