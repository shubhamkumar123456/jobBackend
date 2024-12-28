const express = require('express');
const { applyJob, getSingleJob, getAllAppliedJobs, getApplicants } = require('../controllers/applicants');
const checkToken = require('../middleware/checkToken');

const router = express.Router();


router.post('/create',checkToken,applyJob);
router.get('/appliedJobs',checkToken, getAllAppliedJobs);
router.get('/getjob/:_id', getSingleJob);
router.get('/getApplicants',checkToken,getApplicants);



module.exports = router