self.addEventListener('message', function(e) {
    "use strict";
    var $scope = e.data;
    var poss_len = $scope.possible_vals.length;
    console.log("Recieved : ", $scope);
    /* Function to get all row indexes of current element */
    function getRowIndexes(i) {
        "use strict";
        var rowIndex = Math.floor(i / $scope.nvalue);
        var list = [];
        var final = rowIndex*$scope.nvalue + $scope.nvalue;
        for (var k = rowIndex*$scope.nvalue; k < final; k++) {
            list.push(k);
        }
        return list;
    }
    /* Function to get all col indexes of current element */
    function getColIndexes(i) {
        "use strict";
        var colIndex = i % $scope.nvalue;
        var list = [];
        for (var k = colIndex; k < $scope.nsq; k += $scope.nvalue) {
            list.push(k);
        }
        return list;
    }
    /* Function to get all block indexes of current element */
    function getBlockIndexes(i) {
        "use strict";
        var block_row = Math.floor(i / $scope.rowCells);
        var block_col = Math.floor(i % $scope.nvalue / $scope.nsqrt);
        var f_num = (block_row * $scope.rowCells) + (block_col * $scope.nsqrt);
        var final = f_num + $scope.nsqrt;
        var list = [];
        for (var k = f_num; k < final; k++) {
            for (var j = k, count = 0; count < $scope.nsqrt; count++, j+=$scope.nvalue) {
                list.push(j);
            }
        }
        return list;
    }
    function solve(input) {
        "use strict";
	    //console.log(input);
        var i = input.indexOf('0');

        if (i == -1) {
            // already solved
            return input;
        }
        var excluded = [];
        var excluded_indexes = getRowIndexes(i).concat(getColIndexes(i)).concat(getBlockIndexes(i));
        var ex_len = excluded_indexes.length;
        for (var j = 0; j < ex_len; j++) {
            excluded.push(input[excluded_indexes[j]]);
        }
        excluded = set(excluded);
        for (var m = 0; m < poss_len; m++){
            if (excluded.indexOf($scope.possible_vals[m]) == -1) {
                input[i] = $scope.possible_vals[m];
                var temp = solve(input);
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

	var res = solve($scope.gridString);
	console.log("Result : ", res);
    self.postMessage(res);
    
}, false);
