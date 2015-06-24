'use strict';

app.controller('AuthController', function (FURL, $firebase, $scope, $location, AuthService, toaster) {

    if (AuthService.signedIn()) {
        $location.path("/")
    }

    $scope.isPatient = true;
    $scope.userAge = 10;
    var ref = new Firebase(FURL);

    $scope.register = function (user) {
        user.type = $scope.isPatient ? "pat" : "doc";
        AuthService.register(user).then(function () {
            if ($scope.isPatient) {
                var fbPatProfiles = $firebase(ref.child('patientProfiles')).$asArray();
                fbPatProfiles.$add({
                    patientId: AuthService.user.uid,
                    patientName: $scope.user.name,
                    patientAge: parseInt($scope.userAge),
                    cronicList: "",
                    alergiesList: ""
                });
            } else {
                var fbDocProfiles = $firebase(ref.child('doctorProfiles')).$asArray();
                fbDocProfiles.$add({
                    doctorId: AuthService.user.uid,
                    doctorName: $scope.user.name,
                    availableFromValue: 10,
                    availableFromType: "AM",
                    availableToValue: 4,
                    availableToType: "PM",
                    availableOn: {
                        Mo: true,
                        Tu: true,
                        We: true,
                        Th: true,
                        Fr: true
                    },
                    specializationList: {
                        Orl: false,
                        Card: false,
                        Neur: false,
                        Gene: false,
                        Surg: false,
                        Pedi: false,
                        Trau: false
                    }
                });
            }
            toaster.pop('success', "Register successfully");
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