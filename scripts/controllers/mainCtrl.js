'use strict';

app.controller('MainController', function(FURL, $firebase, $scope, AuthService, toaster) {


    $scope.signedIn = AuthService.signedIn;

    if ($scope.signedIn()) {
        var userId = $scope.currentUser = AuthService.user.auth.uid;
        var ref = new Firebase(FURL);
        var userObj = $firebase(ref.child("profile").child(userId)).$asObject();
        userObj.$loaded().then(function () {
           if (userObj.type == "pat") {
               $scope.isPatient = true;
               $scope.patientName = userObj.name;
           } else {
               $scope.isPatient = false;
               $scope.doctorName = userObj.name;
           }
        });
    }
});