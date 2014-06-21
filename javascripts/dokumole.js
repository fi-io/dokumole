var dokumoleApp = angular.module('dokumoleApp', ["ngSanitize"]);
function MainController($scope) {
	$scope.nvalue = 0;
	$scope.grid = "";
	$scope.$cellMatrix = {};
	$scope.setNvalue = function(n) {
		$scope.nvalue = n;
		$scope.grid = generateGrid();
		//console.log($scope.grid);
		$('.sudoku').html($scope.grid);
	}
	function generateGrid() {
		var nsqrt = Math.sqrt($scope.nvalue);
		var $td, $tr,
			$table = $( '<table>' )
				.addClass( 'sudoku-container' );

		for ( var i = 0; i < $scope.nvalue; i++ ) {
			$tr = $( '<tr>' );
			$scope.$cellMatrix[i] = {};

			for ( var j = 0; j < $scope.nvalue; j++ ) {
				// Build the input
				$scope.$cellMatrix[i][j] = $( '<input>' )
					.attr( 'maxlength', 1 )
					.attr( 'type', 'text' )
					.data( 'row', i )
					.data( 'col', j )

				$td = $( '<td>' ).append( $scope.$cellMatrix[i][j] );
				// Calculate section ID
				sectIDi = Math.floor( i / nsqrt );
				sectIDj = Math.floor( j / nsqrt );
				// Set the design for different sections
				if ( ( sectIDi + sectIDj ) % 2 === 0 ) {
					$td.addClass( 'sudoku-section-one' );
				} else {
					$td.addClass( 'sudoku-section-two' );
				}
				// Build the row
				$tr.append( $td );
			}
			// Append to table
			$table.append( $tr );
		}
		// Return the GUI table
		//console.log($table);
		return $table;
	}
};
