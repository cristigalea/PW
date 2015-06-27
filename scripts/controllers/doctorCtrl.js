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

    $scope.viewTreatmentsForPaient = function (patientId) {
        $location.path('/doctorTreatments/'+ patientId);
    };


    //////////////////
    // VIEW TREATMENTS
    //////////////////

    $scope.doctorTreatments = $firebase(ref.child('treatments')).$asArray();
    $scope.doctorTreatments.$loaded(function (data) {
        $scope.patientUnderTreatmentList = [];
        for (var i = 0; i < data.length; i++) {

            $scope.doctorTreatments[i].takenToday = $scope.doctorTreatments[i].lastTakenOn != (new Date()).toLocaleDateString() ? "NO" : "YES";

            //this is needed to populate the top dropdown selector
            if ($scope.patientUnderTreatmentList.indexOf(data[i].patientName) < 0) {
                $scope.patientUnderTreatmentList.push(data[i].patientName);
            }
        }

        if ($routeParams.patientId) {
            $scope.selectedPatientUnderTreatment = "";
            for (var j = 0; j < data.length; j++) {
                if (data[j].patientId == $routeParams.patientId) {
                    $scope.selectedPatientUnderTreatment = data[j].patientName;
                    break;
                }
            }
        } else {
            $scope.selectedPatientUnderTreatment = $scope.patientUnderTreatmentList[0] || "";
        }
    });


    ////////////////
    // ADD TREATMENT
    ////////////////

    if ($routeParams.patientId) {
        $("#treatmentStart").datepicker({
            inline: true,
            dateFormat: "m/d/yy"
        });

        $("#treatmentEnd").datepicker({
            inline: true,
            dateFormat: "m/d/yy"
        });

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
        $scope.curentTreatment.lastTakenOn = (new Date()).toLocaleDateString();
        $scope.curentTreatment.takenToday = "NO";
        $scope.doctorTreatments.$add($scope.curentTreatment);
        toaster.pop('success', "Treatment Added");
        $location.path('/doctorTreatments');
    };

});