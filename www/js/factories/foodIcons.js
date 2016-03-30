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

        var foodSize = 32;

        var foods = [
            {name: 'bento', type: foodTypes.other, x: 0, y: 0},
            {name: 'burger', type: foodTypes.other, x: -1, y: 0},
            {name: 'hotdog', type: foodTypes.meat, x: -2, y: 0},
            {name: 'pasta', type: foodTypes.other, x: -3, y: 0},
            {name: 'ice-cream', type: foodTypes.dessert, x: 0, y: -1},
            {name: 'kabob', type: foodTypes.meat, x: -1, y: -1},
            {name: 'ramen', type: foodTypes.other, x: -2, y: -1},
            {name: 'tacos', type: foodTypes.other, x: -3, y: -1},
            {name: 'pancake', type: foodTypes.other, x: 0, y: -2},
            {name: 'pizza', type: foodTypes.other, x: -1, y: -2},
            {name: 'lamb-rack', type: foodTypes.meat, x: -2, y: -2},
            {name: 'burrito', type: foodTypes.other, x: -3, y: -2}
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