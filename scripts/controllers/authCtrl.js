'use strict';

app.controller('AuthController', function ($scope, $location, AuthService, toaster) {

    if (AuthService.signedIn()) {
        $location.path("/")
    }

    $scope.register = function (user) {
        AuthService.register(user).then(function () {
            toaster.pop('success', "Register succesfully");
            $location.path('/');
        }, function (err) {
            toaster.pop('error', "Oops, something went wrong!");
        });
    };

    $scope.login = function (user) {
        AuthService.login(user).then(function () {
            toaster.pop('success', "Logged in succesfully!");
            $location.path('/');
        }, function(err) {
            toaster.pop('error', "Oops, something went wrong!");
        });
    };

    $scope.changePassword = function (user) {

        AuthService.changePassword(user).then(function () {

            $scope.user.email = '';
            $scope.user.oldPass = '';
            $scope.user.newPass = '';

            toaster.pop('success', "Password changed successfully!");
        }, function (err) {
            console.log("Error...");
            toaster.pop('error', "Oops, something went wrong!");
        })
    }

});