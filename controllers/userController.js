const User = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    register: async (req,res) => {
        try{
            const {name,email,password} = req.body
            const user = await User.findOne({email:email})
            if(user) return res.status(400).json({msg:"The email already exist"})
            
            if(password.length < 6)
                return res.status(400).json({msg:"The password is too short"})

            const PasswordHash = await bcrypt.hash(password,12)
            const newUser = new User({
                name,email,password: PasswordHash
            })

            await newUser.save()

            // Jsonwebtoke for authhentication

            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})
            
            res.cookie('refreshtoken', refreshtoken,{
                httpOnly: true,
                path:'/users/refresh_token',
                maxAge: 7*24*60*60*1000 
            })
          
             res.json({accesstoken})
        }catch(error)
        {
            return res.status(500).json({msg: error.message})
        }
    },
    login:async (req,res) => {
        try{
             const {email,password}= req.body
             const user = await User.findOne({email})
             if(!user)  return res.status(400).json({msg:"User does not exist"})
             const isMatch= await bcrypt.compare(password,user.password)
             if(!isMatch) return res.status(400).json({msg:"Incorrect password"})
            //  If success,create accesstoken and refresh token

             const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})
            
            res.cookie('refreshtoken', refreshtoken,{
                httpOnly: true,
                path:'/users/refresh_token',
                maxAge: 7*24*60*60*1000 
               
            })
          
             res.json({accesstoken})


        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    },
    logout: async(req,res) => {
        try{
            res.clearCookie('refreshtoken', {path: '/users/refresh_token'})
            return res.json({msg:"LoggedOut"})

        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    },
    refreshToken:  (req,res) => {
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({msg:"Please Login or Register"})
           jwt.verify(rf_token, process.env.REFRESH_KEY ,(err,user) => {
            if(err) return  res.status(400).json({msg:"Please Login or Register 2"})

            const accesstoken = createAccessToken({id:user.id})

            res.json({accesstoken})
        })
    },
    getUser : async (req,res) => {
        try{
            const user = await User.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg :"User does not exist"})

            res.json(user)
        }catch(error){
              return res.status(500).json({msg: error.message})
        }
    },
    addCart:  async (req,res) => {
        try{
            const user = await User.findById(req.user.id)
            
            if(!user) return res.status(400).json({msg:"User does not exist"})
            await User.findOneAndUpdate({_id: req.user.id} , {
                cart: req.body.cart
            })
            return res.json({msg:"Added to cart"})
        }catch(err){
            console.log(err)
            return res.status(400).json({msg:err})
        }
    },
    history: async(req,res) => {
        try{
            const history = await Payments.find({user_id: req.user.id})
            
            res.json(history)
        }catch(err){
            return res.status(400).json({err:err})
        }
    }
}

const createAccessToken = (user) => {
        
    return jwt.sign(user,process.env.SECRET_KEY , {expiresIn: '11m'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_KEY, {expiresIn : '7d'})
}

module.exports =  userController