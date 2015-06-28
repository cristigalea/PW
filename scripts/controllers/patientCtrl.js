'use strict';

app.controller('PatientController', function($scope, $location, FURL, $firebase, toaster, AuthService) {
    var ref = new Firebase(FURL);
    var currentUserId;
    do {
        currentUserId = AuthService.user.uid;
    } while (!currentUserId);

    //////////////////
    // PATIENT PROFILE
    //////////////////
    
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
    };

    ///////////////
    // VIEW DOCTORS
    ///////////////
    
    $scope.doctorsList = $firebase(ref.child('doctorProfiles')).$asArray();

    $scope.makeAppointment = function (doctorId) {

        var curentDoctorPatients = $firebase(ref.child('doctorPatients')).$asArray();
        curentDoctorPatients.$add({
            doctorId: doctorId,
            patientId: $scope.patient.patientId,
            patientName: $scope.patient.patientName,
            patientAge: $scope.patient.patientAge,
            diagnostic: "",
            isFirstCheckup: true,
            isCronic: false,
            isTakingTreatment: false,
            isHealing: false
        });
        toaster.pop('success', "Request Sent");
    };

    ////////////////
    // MY TREATMENTS
    ////////////////

    $scope.patientTreatments = $firebase(ref.child('treatments')
     .orderByChild("patientId")
     .startAt(currentUserId)
     .endAt(currentUserId)).$asArray();

    $scope.doctorForTreatmentList = [];
    $scope.patientTreatments.$loaded(function (data) {
        var curentDate = new Date((new Date()).toLocaleDateString());
        for (var i = 0; i < data.length; i++) {
            $scope.patientTreatments[i].inProgress = new Date($scope.patientTreatments[i].treatmentEnd) > curentDate;

            if ($scope.doctorForTreatmentList.indexOf(data[i].doctorName) < 0) {
                $scope.doctorForTreatmentList.push(data[i].doctorName);
            }
        }

        $scope.selectedDoctorForTreatmentList = $scope.doctorForTreatmentList[0] || "";
    });

    $scope.markForToday = function (treatment) {
        treatment.lastTakenOn = (new Date()).toLocaleDateString();
        var treat = ref.child('treatments').child(treatment.$id);
        treat.update({lastTakenOn: treatment.lastTakenOn});
        toaster.pop('success', "Marked as taken");
    };

    $scope.requestUrgentCare = function (treatment) {
        var treat = ref.child('treatments').child(treatment.$id);
        treat.update({needUrgentCare: true});

        toaster.pop('success', "Request for urgent care sent");
    };

});