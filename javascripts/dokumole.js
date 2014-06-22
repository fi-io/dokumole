"use strict";
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
	"use strict";
	return {
		restrict: 'E',
		templateUrl: 'templates/sudoku-grid.html',
		link: function(scope, element, attrs) {
			element.on('keyup', function(evt) {
				var str = "";
				var inp_ele = element.find('input');
				var ele_len = inp_ele.length;
				for (var i = 0; i < ele_len; i++) {
					if (!inp_ele[i].value) {
						str += '0';
					} else {
						str += inp_ele[i].value;
					}
				}
				scope.gridString = str;
				scope.$digest();
			});
			scope.$watch('result', function(newval) {
				var inp_ele = element.find('input');
				var ele_len = inp_ele.length;
				for (var i = 0; i < ele_len; i++) {
					if (newval[i] == '0') {
						inp_ele[i].value = '';
					} else {
						inp_ele[i].value = newval[i];
					}
				}
			});
			scope.$watch('nvalue', function(val) {
				var inp_ele = element.find('input');
				var ele_len = inp_ele.length;
				for (var i = 0; i < ele_len; i++) {
					inp_ele[i].value = '';
				}
			});
		}
	};
});
function MainController($scope) {
	"use strict";
	$scope.nvalue = 0;
	$scope.nsqrt = 0;
	$scope.nsq = 0;
	$scope.possible_vals = [];
	$scope.grid = "";
	$scope.gridString = "";
	$scope.solvebutton = true;
	$scope.setNvalue = function(n) {
		$scope.nvalue = n;
		$scope.nsqrt = Math.sqrt(n);
		$scope.nsq = n * n;
		$scope.rowCells = $scope.nvalue * $scope.nsqrt;
		for (var i = 1; i <= n; i++){
			$scope.possible_vals.push(i.toString());
		}
		for (var i = 0; i < $scope.nsq; i++){
			$scope.gridString += '0';
		}
		$scope.solvebutton = false;
	}
	$scope.gridCellClass = function(i, j) {
		var sectIDi = Math.floor( i / $scope.nsqrt );
		var sectIDj = Math.floor( j / $scope.nsqrt );
		if ( ( sectIDi + sectIDj ) % 2 === 0 ) {
			return 'bg-success';
		} else {
			return 'sudoku-section-two';
		}
	}
	
	$scope.solveSudoku = function() {
		//$scope.result = solve($scope.gridString);
		var worker = new Worker('javascripts/sudokusolver.js');
		worker.addEventListener('message', function(e) {
			console.log('Worker said: ', e.data);
			$scope.result = e.data;
			worker.terminate();
		}, false);
		worker.postMessage({
			nvalue:	$scope.nvalue,
			nsq:	$scope.nsq,
			nsqrt:	$scope.nsqrt,
			rowCells:	$scope.rowCells,
			gridString: $scope.gridString,
			possible_vals: $scope.possible_vals
		});
	}
	
};
