let ApplicantCollection = require('../models/Applicants')
let JOB = require('../models/Job')
const applyJob = async (req, res) => {
    console.log(req.body)
    let { _id } = req.user
    try {
        let job = await JOB.findById(req.body.job)

        if (!job.applicants.includes(req.user)) {
            job.applicants.push(req.user)
            await job.save()
        }
        else {
            return res.json({ msg: "already applied to this job", success: true })
        }

        let data = await ApplicantCollection.create({ ...req.body, user: _id });
        res.json({ msg: "job applied successfully", success: true })
    } catch (error) {
        console.log(error.message)
        res.json({ msg: "error in apply job", success: false, error: error.message })
    }

}

const getAllAppliedJobs = async (req, res) => {
    // res.send("get all job running")
    const { _id } = req.user
    try {

        let data = await ApplicantCollection.find({ user: _id }).populate('job')
        res.json({ msg: "fetch all applied jobs successfully", success: true, data })
    } catch (error) {
        res.json({ msg: "error in getting applied job", success: false, error: error.message })
    }

}

const getSingleJob = async (req, res) => {
    res.send("get single job running");
}

const getApplicants = async(req,res)=>{
    let userId = req.user._id;

    try {
        let job = await ApplicantCollection.find({companyId:userId}).populate('job');
    res.json({msg:"get successfully",success:true,job})
    } catch (error) {
        res.json({msg:"error in getting applicants",success:false,error:error.message})
    }

}


module.exports = {
    applyJob,
    getAllAppliedJobs,
    getSingleJob,
    getApplicants
}
