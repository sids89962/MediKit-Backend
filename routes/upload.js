const express = require('express')
const cloudinary = require('cloudinary')
const router = express.Router()

const auth = require('../middleware/auth')
const adminAuth = require('../middleware/authAdmin')
const fs =  require('fs')

// we will upload umage on clou
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//upload image
router.post('/upload',auth, adminAuth, (req,res) => {
    try{
      
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send({msg:'No files were uploaded'})
       
       const file = req.files;
       if(file.size > 1024*1024) {//1mb
            removetmp(file.tempFilePath)
            return res.status(400).json({msg:"Size too large"})
         }
        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png"){
               removetmp(file.tempFilePath)
              return res.status(400).json({msg:"File format not supported"})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err,result) => {
            if(err) throw err;

               removetmp(file.tempFilePath)
            res.json({public_id:result.public_id, url: result.secure_url})
        })
    }catch(error){
        res.status(500).json({msg: error.message})
    }
})

router.post('/destroy',auth, adminAuth, (req,res) => {
    try{
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: ''})

        cloudinary.v2.uploader.destroy(public_id), async(err, result) => {
            if(err) throw err;

            res.json({msg: "Deleted Image"})

        }
    }catch(err){
        return res.staus(500).json({msg:err.message})
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err=> {
        if(err) throw err;
    })
}
module.exports = router