'use strict';

app.controller('NavController', function($scope, $location, AuthService, toaster, $timeout) {

    $scope.currentUser = AuthService.user;
    $scope.signedIn = AuthService.signedIn;

    window.setInterval(function() {
        if ($scope.signedIn()) {
            do {
                var userProfile = AuthService.user.profile;
            }while (!userProfile);

            if (userProfile.type == "pat") {
                $scope.isPatient = true;
                $scope.patientName = userProfile.name;
            } else {
                $scope.isPatient = false;
            }
        }
    }, 1000);

    $scope.logout = function () {
        AuthService.logout();
        toaster.pop('success', "Logged out succesfully");
        $timeout(function() {
            $location.path("/");    
        }, 100);
    };
});