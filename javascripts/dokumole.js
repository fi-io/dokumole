var dokumoleApp = angular.module('dokumoleApp', []);
dokumoleApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
dokumoleApp.directive('sudokuGrid', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/sudoku-grid.html'
	};
});
function MainController($scope) {
	$scope.nvalue = 0;
	$scope.grid = "";
	$scope.$cellMatrix = {};
	$scope.setNvalue = function(n) {
		$scope.nvalue = n;
	}
	$scope.gridCellClass = function(i, j) {
		var nsqrt = Math.sqrt($scope.nvalue);
		var sectIDi = Math.floor( i / nsqrt );
		var sectIDj = Math.floor( j / nsqrt );
		if ( ( sectIDi + sectIDj ) % 2 === 0 ) {
			return 'sudoku-section-one';
		} else {
			return 'sudoku-section-two';
		}
	}
};
