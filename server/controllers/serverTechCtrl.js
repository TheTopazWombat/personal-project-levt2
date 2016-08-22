var app = require('../index');
var db = app.get('db');

module.exports = {
  getTechInfo: function(req, res, next) {
    if(req.user) {
      console.log('we have a user');
      db.get_tech_info([req.user._json.name.givenName, req.user._json.name.familyName], function(err, response) {
        console.log(err);
        if (response[0]) {
          // console.log('found something', response[0]);
          res.set(200).json(response);
        }
        else {
          res.sendStatus(401);
        }
    });
  }
  },
    getJobByInvoice: function(req, res, next) {
        db.get_job_by_invoice(req.params.invoice, function(err, job) {
            console.log(err);
            res.set(200).json(job);
        });
    },
    getAllCustomers: function(req, res, next) {
        db.get_all_customers(function(err, response) {
            // console.log(err);
            // console.log(req);
            // console.log(req.user._json.etag);
            res.set(200).json(response);
        });
    },
    getAllAppointments: function(req, res, next) {
        db.get_all_appointments(function(err, response) {
            console.log(err);
            res.set(200).json(response);
        });
    },
    getAllTechAppointments: function(req, res, next) {
        if (req.params.id) {
            // console.log('req id:', req.params.id);
            db.get_all_tech_appointments(req.params.id, function(err, response) {
              // console.log('this should be my appointments for', req.params.id, response);
              res.set(200).json(response);
            });
        }
    },
    updateTechAppointment: function(req, res, next) {
      console.log("req body:", req.body);
      db.update_appointment([req.body.appt_met, req.body.appt_id], function(err, response) {
        console.log(err, response);
        console.log('Update appt info:', req.body.appt_id, req.body.appt_met);
      });
      db.update_job_tech_appt([req.body.next_step, req.body.model_num, req.body.serial_num, req.body.status, req.body.job_invoice], function(err, response) {
        console.log(err, response);
        res.sendStatus(200);
      });
    }
};
