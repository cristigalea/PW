'use strict';

app.controller('DoctorController', function($scope, $location, FURL, $firebase, toaster, AuthService, $routeParams) {
    var ref = new Firebase(FURL);
    var currentUserId;
    do {
        currentUserId = AuthService.user.uid;
    } while (!currentUserId);


    /////////////////
    // DOCTOR PROFILE
    /////////////////
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
    };


    ////////////////
    // VIEW PATIENTS
    ////////////////
    $scope.doctorPatients = $firebase(ref.child('doctorPatients')
        .orderByChild("doctorId")
        .startAt(currentUserId)
        .endAt(currentUserId)).$asArray();

    $scope.addTreatmentForPatient = function (patientId) {
        $location.path('/addTreatment/'+ patientId);
    };

    ////////////////
    // ADD TREATMENT
    ////////////////
    if ($routeParams.patientId) {
        ref.child('patientProfiles')
            .orderByChild("patientId")
            .startAt($routeParams.patientId)
            .endAt($routeParams.patientId)
            .once('value', function (snap) {
                var key = Object.keys(snap.val())[0];
                var basePatient = $firebase(snap.ref().child(key)).$asObject();
                basePatient.$loaded(function (data) {
                    $scope.curentTreatment = {
                        patientId: data.patientId,
                        patientName: data.patientName,
                        patientAge: data.patientAge,
                        cronicList: data.cronicList,
                        alergiesList: data.alergiesList
                    }
                });
            });
    }

    $scope.addTreatment = function() {
        console.log($scope.curentTreatment);
    };
});