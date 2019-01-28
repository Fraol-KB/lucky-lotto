var myApp = angular.module("myApp", ["lbServices", "ngRoute"]);

myApp.controller("Login", function ($scope, User, $location, $window) {
    // $scope.error = false;
    // User.logout();
    console.log(User.isAuthenticated());
    $scope.login = function () {
        console.log("response");
        User.login(
            {
                "username": this.username,
                "password": this.password
            }
        ).$promise.then(

            function (response) {
                console.log(response);
                $window.location.href = "/temp"
                $scope.error = false;

            },
            function (err) {
                $scope.error = true;
                console.log($scope.email)
            }
        ).catch(
            function (err) {
                $scope.error = true;
            });
    }
});
    // myApp.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){
    //     $routeProvider.when("/",{templateUrl:"../../view/login_page.html"})
    //     .otherwise({templateUrl:"../../view/login_page.html"})
    // }]);