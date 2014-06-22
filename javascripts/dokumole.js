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
				for (var i = 0; i < inp_ele.length; i++) {
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
				for (var i = 0; i < inp_ele.length; i++) {
					if (newval[i] == '0') {
						inp_ele[i].value = '';
					} else {
						inp_ele[i].value = newval[i];
					}
				}
			});
			scope.$watch('nvalue', function(val) {
				var inp_ele = element.find('input');
				for (var i = 0; i < inp_ele.length; i++) {
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
		$scope.result = solve($scope.gridString);
	}
	
	/* Function to get all row indexes of current element */
	function getRowIndexes(i) {
		"use strict";
		var rowIndex = Math.floor(i / $scope.nvalue);
		var list = [];
		for (var i = rowIndex*$scope.nvalue; i < (rowIndex*$scope.nvalue + $scope.nvalue); i++) {
			list.push(i);
		}
		return list;
	}
	/* Function to get all col indexes of current element */
	function getColIndexes(i) {
		"use strict";
		var colIndex = i % $scope.nvalue;
		var list = [];
		for (var i = colIndex; i < $scope.nsq; i += $scope.nvalue) {
			list.push(i);
		}
		return list;
	}
	/* Function to get all col indexes of current element */
	function getBlockIndexes(i) {
		"use strict";
		var block_row = Math.floor(i / $scope.rowCells);
		var block_col = Math.floor(i % $scope.nvalue / $scope.nsqrt);
		var f_num = (block_row * $scope.rowCells) + (block_col * $scope.nsqrt);
		var list = [];
		for (var i = f_num; i < (f_num + $scope.nsqrt); i++) {
			for (var j = i, count = 0; count < $scope.nsqrt; count++, j+=$scope.nvalue) {
				list.push(j);
			}
		}
		return list;
	}
	function solve(input) {
		"use strict";
		var i = input.indexOf('0');
		
		if (i == -1) {
			// already solved
			return input;
		}
		var excluded = [];
		var excluded_indexes = getRowIndexes(i).concat(getColIndexes(i)).concat(getBlockIndexes(i));
		for (var j = 0; j < excluded_indexes.length; j++) {
			excluded.push(input[excluded_indexes[j]]);
		}
		//excluded = set(excluded);
		for (var m in $scope.possible_vals){
			if (excluded.indexOf($scope.possible_vals[m]) == -1) {
				var temp = solve(input.substr(0, i) + $scope.possible_vals[m] + input.substr(i + 1));
				if(!temp) {
					excluded.push($scope.possible_vals[m]);
				} else {
					return temp;
				}
			}
		}
	}

	function set (arr) {
		"use strict";
		return arr.reduce(function (a, val) {
			if (a.indexOf(val) === -1) {
				a.push(val);
			}
			return a;
		}, []);
	}
	
};
