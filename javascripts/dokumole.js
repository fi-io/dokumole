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
		solve($scope.gridString);
	}
	
	function same_row(i, j){
		return (Math.floor(i/$scope.nvalue) == Math.floor(j/$scope.nvalue));
	}
	function same_col(i, j){
		return ((i - j) % $scope.nvalue == 0);
	}
	function same_block(i, j){
		return (Math.floor(i/($scope.nvalue * $scope.nsqrt)) == Math.floor(j/($scope.nvalue * $scope.nsqrt)) && Math.floor(i % $scope.nvalue / $scope.nsqrt) == Math.floor(j % $scope.nvalue / $scope.nsqrt));
	}
	function solve(input) {	
		var i = input.indexOf('0');
		
		if (i == -1) {
			// already solved
			$scope.result = input;
			throw "This is not an error. I need to fix this one. Dont worry about it. :)";
		}
		var excluded = [];
		for (var j = 0; j < $scope.nsq; j++) {
			if (same_row(i, j) || same_col(i, j) || same_block(i, j)) {
				excluded.push(input[j]);
			}
		}
		excluded = set(excluded);
		for (m in $scope.possible_vals){
			if (excluded.indexOf($scope.possible_vals[m]) == -1) {
				solve(input.substr(0, i) + $scope.possible_vals[m] + input.substr(i + 1));
			}
		}
	}

	function set (arr) {
		return arr.reduce(function (a, val) {
			if (a.indexOf(val) === -1) {
				a.push(val);
			}
			return a;
		}, []);
	}
	
};
