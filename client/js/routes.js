myApp.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/lucky", {
            templateUrl: "../template/index.html",
            controller: "Login"
        })
    // .when("/edit-employee/:id", {
    //     templateUrl: "view/employee/emp_edit.html",
    //     resolve: {
    //         check: function  ($location) {
    //             if (rights.employee.edit) {
    //                 return true
    //             } else {
    //                 $.notify({
    //                     message: "Access Denied!!"
    //                 }, {
    //                         type: "warning"
    //                     });
    //                 $location.path("/emp")
    //             }
    //         }
    //     }
    // })
}]).run(["$rootScope", "$location", "$http", "LoopBackAuth", "User", "$window", function ($rootScope, $location, $http, LoopBackAuth, User, $window) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        $("#ui-view").html("");
        $(".page-loading").removeClass("hidden")
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        $(".page-loading").addClass("hidden")
    });
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        var restrictedPage = $.inArray($location.path(), ["/home", "/register"]) === -1;
        if (restrictedPage && !User.isAuthenticated()) {
            $window.location.href = "/";
        }
    })
}]);