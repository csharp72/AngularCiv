describe("Angular Civ", function() {
	beforeEach(module('app'));

	var $controller;
	var $scope; 

	beforeEach(inject(function(_$controller_, _$rootScope_){
		$controller = _$controller_;
		$scope = _$rootScope_.$new();
	}));

	describe('GameCtrl', function() {
		var controller;

		beforeEach(function() {
			controller = $controller('GameCtrl', { $scope: $scope });
		});

		it('1 equals 1', function(){
			expect(1).toEqual(1);
		})

		it('has food start at zero', function(){
			expect($scope.resources.food.total).toEqual(0);
		})

		it('can collect food', function() {
			$scope.resources.food.collect();
			expect($scope.resources.food.total).toEqual(1);
		});

		it('can adjust collection rate', function() {
			$scope.resources.food.collectRate = 20;
			$scope.resources.food.collect();
			expect($scope.resources.food.total).toEqual(20);
		});

		it('limits collection to the maximum', function() {
			$scope.resources.food.collectRate = 9999;
			$scope.resources.food.collect();
			expect( $scope.resources.food.max ).toEqual( 200 );
			expect( $scope.resources.food.total ).toEqual( $scope.resources.food.max );
		});

		it('has a chance to produce a special resource on collect', function(){
			expect( $scope.resources.food.specialResource ).toEqual( $scope.resources.skins );

			$scope.resources.food.collectSpecialChance = 1;
			$scope.resources.food.collect();
			expect( $scope.resources.skins.total ).toEqual( 1 );

			$scope.resources.food.collectSpecialChance = 0;
			$scope.resources.food.collect();
			expect( $scope.resources.skins.total ).toEqual( 1 );
		})

	});
});