/*
Groups items together, deepens the array
e.g. [1,2,3,4] => filter:2 => [[1,2], [3,4]]
 */
app.filter('groupItems', ['_',
    function(_) {

        return function(input, num) {
            if (_.isArray(input)) {
                var out = [];
                var temp = [];
                var i = 0;
                _.each(input, function(item) {
                    if (i + 1 == num) {
                        temp.push(item);
                        out.push(temp);
                        temp = [];
                        i = 0;
                    }
                    else {
                        temp.push(item);
                        i++;
                    }
                });
                return out;
            }
            else {
                return input;
            }
        };

    }
]);