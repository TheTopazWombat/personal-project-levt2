'use strict';

angular.module('app').controller('techCtrl', techCtrl);

function techCtrl($scope, techService, $rootScope, mainServ, loginService, ngDialog) {
  console.log($rootScope.testUser);
  $scope.getJobByInvoice = function (invoice, apptTime, apptMet, apptPhone, apptId) {
    techService.getJobByInvoice(invoice).then(function (response) {
      // console.log("More info:", response, apptTime, apptMet, apptPhone);
      $scope.customer = response;
      ngDialog.open({
        template: './assets/templates/modals/more-info-job.html',
        scope: $scope
      });
      $scope.customer.appt_time = moment(apptTime).format('MMMM Do YYYY, h:mm a');
      $scope.customer.appt_met = apptMet;
      if (apptPhone) {
        $scope.customer.appt_phone = apptPhone;
      }
      $scope.customer.appt_id = apptId;
      console.log("customer:", $scope.customer);
    });
  };
  $scope.getMyTechInfo = function () {
    loginService.getMyTechInfo().then(function (response) {
      // $rootScope.testUser = response[0];
      // console.log('my tech info:', response);
      // response.data = $rootScope.currentTech;
      // console.log(response.data[0]);
      $rootScope.currentTech = response.data[0];
      // $scope.getCmJobs($rootScope.testUser.id);
      // console.log($rootScope.currentTech.tech_assigned);
      $scope.getAllTechAppointments($rootScope.currentTech.tech_assigned);
    });
  };
  $scope.getMyTechInfo();
  $scope.testCm = {
    first_name: "Takeshi",
    last_name: "Kovacs",
    invoice: 84611,
    phone_num1: "208-251-6641",
    phone_num2: "309-516-6634",
    next_step: "Get resleeved in Kamala Neurochem tech ninja sleeve, proceed to mess everyone up.",
    appt_time: moment("Mon Aug 15 2016 13:45:00 GMT-0600 (Mountain Daylight Time)").fromNow()
    // moment().subtract(1, 'days').calendar()
  };
  console.log($scope.testCm);
  // console.log(moment());
  $scope.getAllCustomers = function () {
    techService.getAllCustomers().then(function (response) {
      // console.log(response);
      $scope.customers = response.data;
    });
  };
  // $scope.getAllCustomers();
  // $scope.storeTime = moment().tz('America/Boise');
  // $scope.pastAppts = [];
  $scope.currentAppts = [];
  $scope.getAllAppointments = function () {
    techService.getAllAppointments().then(function (response) {
      $scope.appointments = response;
      // console.log($scope.appointments);
      $scope.numOfAppts = $scope.appointments.length;
    });
  };
  $scope.pastAppts = [];
  $scope.todayAppts = [];
  $scope.futureAppts = [];
  $scope.getAllTechAppointments = function (id) {
    techService.getAllTechAppointments(id).then(function (response) {
      // console.log('we got a hit, biiiitch', response);
      var unmetAppts = [];
      var techAppointments = response;
      console.log(techAppointments);
      for (var i = 0; i < techAppointments.length; i++) {
        if (!techAppointments[i].isMet) {
          unmetAppts.push(techAppointments[i]);
        }
      }
      for (var _i = 0; _i < unmetAppts.length; _i++) {
        if (moment(unmetAppts[_i].appt_time).isBefore(moment())) {
          $scope.pastAppts.push(unmetAppts[_i]);
        } else if (moment(unmetAppts[_i].appt_time).isAfter(moment().endOf('day'))) {
          $scope.futureAppts.push(unmetAppts[_i]);
        } else {
          $scope.todayAppts.push(unmetAppts[_i]);
        }
      }
      if ($scope.pastAppts.length === 0) {
        $scope.missedApptsMessage = "No missed appointments! Yay!";
      } else {
        $scope.missedApptsMessage = "Oh no! You missed these appointments!";
      }
    });
    // console.log($scope.pastAppts, $scope.todayAppts, $scope.futureAppts);
  };
  // $scope.getAllTechAppointments();
  $scope.updateJobAppt = function (apptMet, nextStep, modelNum, serialNum, status, cmId, apptId, jobInvoice) {
    var updateData = {
      appt_met: apptMet,
      next_step: nextStep,
      model_num: modelNum,
      serial_num: serialNum,
      status: status,
      cm_id: cmId,
      appt_id: apptId,
      job_invoice: jobInvoice
    };
    console.log(updateData);
    techService.updateJobAppt(updateData).then(function (response) {
      console.log(response);
      // $scope.getAllTechAppointments($rootScope.currentTech.tech_assigned);
    });
  };
}