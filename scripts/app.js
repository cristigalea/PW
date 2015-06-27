'use strict';

var app = angular
    .module('TaskNinjaApp', [
        'ngAnimate',
        'ngResource',
        'ngRoute',
        'firebase',
        'toaster'
    ])
    .constant('FURL', 'https://patientwatch.firebaseio.com/')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'AuthController'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'AuthController'
            })



            .when('/chat', {
                templateUrl: 'views/chat.html',
                controller: 'ChatController'
            })



            .when('/patientProfile', {
                templateUrl: 'views/patientProfile.html',
                controller: 'PatientController'
            })
            .when('/viewTreatments', {
                templateUrl: 'views/viewTreatments.html',
                controller: 'PatientController'
            })
            .when('/viewDoctors', {
                templateUrl: 'views/viewDoctors.html',
                controller: 'PatientController'
            })



            .when('/doctorProfile', {
                templateUrl: 'views/doctorProfile.html',
                controller: 'DoctorController'
            })
            .when('/doctorTreatments/:patientId?', {
                templateUrl: 'views/doctorTreatments.html',
                controller: 'DoctorController'
            })
            .when('/viewPatients', {
                templateUrl: 'views/viewPatients.html',
                controller: 'DoctorController'
            })
            .when('/addTreatment/:patientId', {
                templateUrl: 'views/addTreatment.html',
                controller: 'DoctorController'
            })


            
            .otherwise({
                redirectTo: '/'
            });
    });
