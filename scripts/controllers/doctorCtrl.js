'use strict';

app.controller('DoctorController', function($scope, $location, FURL, $firebase, toaster, AuthService) {
    var ref = new Firebase(FURL);
    var currentUserId;
    do {
        currentUserId = AuthService.user.uid;
    } while (!currentUserId);

    ref.child('doctorProfiles')
        .orderByChild("doctorId")
        .startAt(currentUserId)
        .endAt(currentUserId)
        .once('value', function (snap) {
            var key = Object.keys(snap.val())[0];
            $scope.doctor = $firebase(snap.ref().child(key)).$asObject();
        });

    $scope.updateProfile = function () {
        $scope.doctor.$save().then(function (){
            toaster.pop('success', "Profile updated successfully");
            $location.path('/');
        }, function (error) {
            toaster.pop('error', "An error has occured");
            console.log(error);
        })
    }
});