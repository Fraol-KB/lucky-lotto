var myApp = angular.module("myApp", ["lbServices", "ngRoute"]);

myApp.controller("homeController", function ($scope, User, $location, $window) {
    console.log(User.isAuthenticated());
    if (!User.isAuthenticated()) {
        $window.location.href = "/";
    }
});
