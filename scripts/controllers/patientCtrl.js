'use strict';

app.controller('PatientController', function($scope, $location, FURL, $firebase, toaster, AuthService) {
    var ref = new Firebase(FURL);
    var currentUserId;
    do {
        currentUserId = AuthService.user.uid;
    } while (!currentUserId);

    ref.child('patientProfiles')
        .orderByChild("patientId")
        .startAt(currentUserId)
        .endAt(currentUserId)
        .once('value', function (snap) {
            var key = Object.keys(snap.val())[0];
            $scope.patient = $firebase(snap.ref().child(key)).$asObject();
        });

    $scope.updateProfile = function (patient) {
        $scope.patient.$save().then(function (){
            toaster.pop('success', "Profile updated successfully");
            $location.path('/');
        }, function (error) {
            toaster.pop('error', "An error has occured");
            console.log(error);
        })
    }
});