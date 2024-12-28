
    let JobCollection = require('../models/Job')

const createJob = async(req,res)=>{
    // const {title,description,company}
    let {role,_id} = req.user
    if(role!=='company'){
        return res.json({msg:"not authorized to create a job post", success:false})
    }
   try {
    let data = await JobCollection.create({...req.body,userId:_id});
    res.json({msg:"jobPost created successfully",success:true,data});
   } catch (error) {
    res.json({msg:"error in creating job post",success:false,error:error.message});
   }
}

const updateJob = async(req,res)=>{
    let _id = req.params._id;
    let {role} = req.user
    if(role!=='company'){
        return res.json({msg:"not authorized to update a job post", success:false})
    }
   try {
     // let {title,description,company,}
     let data = await JobCollection.findByIdAndUpdate( _id ,{$set:req.body} ,{new:true} );
     res.json({msg:"job updated successfully", success:true, job:data})
   } catch (error) {
    res.json({msg:"error in updating job post",success:false,error:error.message}) 
   }
}

const deleteJob = async(req,res)=>{
    let _id = req.params._id;
    let {role} = req.user
    if(role!=='company'){
        return res.json({msg:"not authorized to delete a job post", success:false})
    }
  try {
    let data = await JobCollection.findByIdAndDelete(_id);
    res.json({msg:"job deleted successfully",success:true})
  } catch (error) {
    res.json({msg:"error in deleting job post",success:false,error:error.message})
  }
}
const getAllJob = async(req,res)=>{
    
    try {
      let jobs = await JobCollection.find();
    res.json({msg:"all jobs fetched successfully", success:true,jobs})
  } catch (error) {
    res.json({msg:"error in getting jobs",success:false})
  }
}


const singleCompanyJobs = async(req,res)=>{
      let _id = req.user._id;
     try {
      let jobs =await JobCollection.find({userId:_id});
      res.json({msg:'get successfully', success:true,jobs});
     } catch (error) {
      res.json({msg:"error in getting jobs", success:false,error:error.message})
     }
}

const countNumbers = async(req,res)=>{
    let userId = req.user;
    try {
      let findJob = await JobCollection.find({userId});
    console.log(findJob)

      let appliedUserCounts = 0;
   
      findJob.forEach((jobObj)=>{
        appliedUserCounts = appliedUserCounts+ jobObj.applicants.length
      })
      console.log(appliedUserCounts)
  let totalJobPost = findJob.length;

  res.json({msg:"get successfully",success:true,jobCount:totalJobPost, appliedCount:appliedUserCounts})
    } catch (error) {
      res.json({msg:"error in getting counts",success:false,error:error.message})
    }



    // console.log(totalJobPost) 
}


const searchJob = async(req,res)=>{
  const {title,location} = req.query;

  let obj = {};
  if(title){
    obj.title = { $regex: title, $options: 'i' }
  }
  if(location){
    obj.location = { $regex: location, $options: 'i' };
  }

  let jobs = await JobCollection.find(obj);
  res.json(jobs)


}

module.exports = {
    createJob,
    updateJob,
    deleteJob,
    getAllJob,
    singleCompanyJobs,
    countNumbers,
    searchJob
}