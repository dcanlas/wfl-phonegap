app.factory('foodIcons', ['_',
    function foodIcons(_) {

        var foodTypes = {
            'veg': 'vegetable',
            'fruit': 'fruit',
            'meat': 'meat',
            'drink': 'drink',
            'dessert': 'dessert',
            'other': 'other'
        };

        var foodSize = 64;

        var foods = [
            {name: 'fried rice', type: foodTypes.other, x: 0, y: 0},
            {name: 'sausage', type: foodTypes.other, x: -1, y: 0},
            {name: 'corn', type: foodTypes.meat, x: -2, y: 0},
            {name: 'shrimp rice', type: foodTypes.other, x: -3, y: 0},
            {name: 'veggie pasta', type: foodTypes.dessert, x: 0, y: -1},
            {name: 'brown rice', type: foodTypes.meat, x: -1, y: -1},
            {name: 'falafel', type: foodTypes.other, x: -2, y: -1},
            {name: 'yellow stuff', type: foodTypes.other, x: -3, y: -1},
            {name: 'tomato wrap', type: foodTypes.other, x: 0, y: -2},
            {name: 'pita bread', type: foodTypes.other, x: -1, y: -2},
            {name: 'dolma', type: foodTypes.meat, x: -2, y: -2},
            {name: 'veggie curry', type: foodTypes.other, x: -3, y: -2},
            {name: 'tomato soup', type: foodTypes.other, x: 0, y: -3},
            {name: 'ham salad', type: foodTypes.other, x: -1, y: -3},
            {name: 'onion rings', type: foodTypes.meat, x: -2, y: -3},
            {name: 'tomato with topping', type: foodTypes.other, x: -3, y: -3}
        ];

        function getFoods(type) {
            if (type) {
                return _.filter(foods, function(food) {
                    return food.type === type;
                });
            }
            else {
                return foods;
            }
        }

        return {
            getFoods: getFoods,
            foodSize: foodSize
        };
    }
]);
