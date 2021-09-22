const User = require('../models/userModel')

const authAdmin = async (req,res, next) => {
    try{
        // GET user information
        const  user = await User.findOne({
            _id: req.user.id

        })
        if(user.role === 0) 
            return res.status(400).json({msg: "Admin resources access denied"})
        
        next()
    }catch(error){
        return res.status(500).json({msg :error.message})
    }

}


module.exports = authAdmin