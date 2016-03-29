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
            {name: 'bento', type: foodTypes.other},
            {name: 'burger', type: foodTypes.other},
            {name: 'hotdog', type: foodTypes.meat},
            {name: 'pasta', type: foodTypes.other},
            {name: 'ice-cream', type: foodTypes.dessert},
            {name: 'kabob', type: foodTypes.meat},
            {name: 'ramen', type: foodTypes.other},
            {name: 'tacos', type: foodTypes.other},
            {name: 'pancake', type: foodTypes.other},
            {name: 'pizza', type: foodTypes.other},
            {name: 'lamb-rack', type: foodTypes.meat},
            {name: 'burrito', type: foodTypes.other}
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