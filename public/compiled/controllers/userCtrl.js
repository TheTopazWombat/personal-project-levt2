'use strict';

angular.module('app').controller('userCtrl', userCtrl);

function userCtrl($scope, userService, $rootScope, mainServ, ngDialog, loginService) {
    $scope.getMyCmInfo = function () {
        loginService.getMyCmInfo().then(function (response) {
            $rootScope.testUser = response[0];
            console.log("test user:", $rootScope.testUser);
            $scope.getCmJobs($rootScope.testUser.id);
        });
    };

    // $scope.

    $scope.getMyCmInfo();

    $scope.getUser = function (userId) {
        userService.getUser(userId).then(function (response) {
            $scope.user = response;
        });
    };
    $scope.apptInfo = [];
    $scope.getApptInfo = function () {};
    $scope.apptsTest = [];
    // console.log($rootScope.testUser);

    $scope.getCmJobs = function (id) {
        userService.getCmJobs(id).then(function (response) {
            $scope.myJobs = response;
            console.log('Customer jobs', $scope.myJobs);
            $scope.getAllCmAppointments();
        });
    };

    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var index = Math.floor(Math.random() * $dates.length);
        $dates[index].selectable = false;
        // console.log($dates);
        for (var i in $dates) {
            for (var k in $scope.apptsTest) {
                if (moment($dates[i].utcDateValue)._d === $scope.apptsTest[k]) {
                    $dates[i].selectable = false;
                }
            }
        }
        // console.log(moment($dates[1].utcDateValue)._d);
    };

    $scope.newApptObj = { appt_met: false };

    $scope.onTimeSet = function (newDate, oldDate, callThisNum) {

        $scope.newApptObj.appt_time = newDate;
        $scope.newApptObj.appt_phone = callThisNum;
        $scope.newApptObj.cm_id = $rootScope.testUser.id;
        console.log($scope.newApptObj);
        $scope.callThisNum = '';
        $scope.apptsTest.push(newDate);
        // console.log($scope.apptsTest);
    };
    $scope.toggle = function () {
        $scope.hidden = !$scope.hidden;
    };

    $scope.openCalander = function (jobInvoice, techId) {
        $scope.newApptObj.job_invoice = jobInvoice;
        $scope.newApptObj.tech_id = techId;
        console.log($scope.newApptObj);
        // console.log($scope.tempInvoice, $scope.tempTechId);
        ngDialog.open({
            template: './assets/templates/modals/cm-calander.html',
            scope: $scope
        });
    };

    $scope.requestNewAppt = function () {
        console.log($scope.newApptObj);

        userService.requestNewAppt($scope.newApptObj);
        // .then((response) => {
        //   console.log(response);
        // });
    };
    $scope.unmetCmAppts = [];
    $scope.getAllCmAppointments = function () {
        userService.getAllCmAppointments($rootScope.testUser.id).then(function (response) {
            var appts = response.data;
            for (var i = 0; i < appts.length; i++) {
                if (!appts[i].appt_met) {
                    $scope.unmetCmAppts.push(appts[i]);
                }
            }
            console.log($scope.cmAppointments);
        });
    };

    $scope.openUpdateInfo = function (job) {
        console.log(job);
        $scope.updateJob = job;
        ngDialog.open({
            template: './assets/templates/modals/cm-update-job-info.html',
            scope: $scope
        });
    };

    $scope.updateJobInfoCm = function (modelNum, serialNum, phoneNum1, invoice) {
        console.log('input data:', modelNum, serialNum, phoneNum1);
        var updateObj = {
            model_num: modelNum,
            serial_num: serialNum,
            phone_num1: phoneNum1,
            invoice: invoice
        };
        userService.updateJobInfoCm(updateObj);
    };
}