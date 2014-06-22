self.addEventListener('message', function(e) {
    var $scope = e.data;
    /* Function to get all row indexes of current element */
    function getRowIndexes(i) {
        "use strict";
        var rowIndex = Math.floor(i / $scope.nvalue);
        var list = [];
        var final = rowIndex*$scope.nvalue + $scope.nvalue;
        for (var i = rowIndex*$scope.nvalue; i < final; i++) {
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
        var final = f_num + $scope.nsqrt;
        var list = [];
        for (var i = f_num; i < final; i++) {
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
        var ex_len = excluded_indexes.length;
        for (var j = 0; j < ex_len; j++) {
            excluded.push(input[excluded_indexes[j]]);
        }
        //excluded = set(excluded);
        var poss_len = $scope.possible_vals.length;
        for (var m = 0; m < poss_len; m++){
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
    
    self.postMessage(solve($scope.gridString));
    
}, false);
