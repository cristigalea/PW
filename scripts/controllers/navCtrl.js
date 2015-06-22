'use strict';

app.controller('NavController', function($scope, $location, AuthService, toaster) {

    $scope.currentUser = AuthService.user;
    $scope.signedIn = AuthService.signedIn;

    if ($scope.signedIn()) {
        do {
            var userProfile = AuthService.user.profile;
        }while (!userType);

        if (userProfile.type == "pat") {
            $scope.isPatient = true;
            $scope.patientName = userProfile.name;
        } else {
            $scope.isPatient = false;
        }
    }

    $scope.logout = function () {
        AuthService.logout();
        toaster.pop('success', "Logged out succesfully");
        $timeout(function() {
            $location.path("/");    
        }, 100);
    };
});