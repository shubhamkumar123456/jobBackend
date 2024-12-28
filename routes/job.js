const express = require('express');
const { createJob, updateJob, deleteJob, getAllJob, singleCompanyJobs, countNumbers, searchJob } = require('../controllers/job');
const checkToken = require('../middleware/checkToken');
const router = express.Router();


router.post('/create',checkToken,createJob)
router.put('/update/:_id',checkToken,updateJob)
router.delete('/delete/:_id',checkToken,deleteJob)
router.get('/getalljob',getAllJob)
router.get('/singlecompanyalljob',checkToken,singleCompanyJobs)
router.get('/countJob',checkToken,countNumbers)
router.get('/searchJob',searchJob);


module.exports = router