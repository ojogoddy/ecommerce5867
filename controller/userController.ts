import express, {Request, Response} from "express"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import authModel from "../model/authModel"
import profileModle from "../model/profileModle"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: "gmail",
    auth: {
        user: "goddy4aceu@gmail.com",
        pass: "mval wpud wpxn ksys"
    }
})

export const registerUser =async (req:Request, res: Response) => {
    try{
        const {userName, email, password, role} = req.body
        if(!userName || !email || !password)
        {
            return res.status(401).json({
                message: "input all required field"
            })
        }

        const checkEmail = await authModel.findOne({email:email})
        if(checkEmail)
        {
            return res.status(401).json({
                message: "email already exist"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)

        const creteData = await authModel.create({
            userName, email, password:hashed, role
        })
        const createProfile:any = await profileModle.create({
            _id: creteData._id,
            firstName: "",
            lastName: "",
            gender: "",
            avatar: "",

        })
        creteData.profile = createProfile._id
        creteData.save()

        createProfile.user = creteData._id
        createProfile.save()

        let mailOption={
            from: ' "Ojogoddy" <foo@example.com>', //sender address
            to: email, // list of receivers
            subject: "Ojogoddy Store", //subject line
            text: "hello world", //plain text body
            html: `<b>Hello world? follow this link to verify your email address <a href="https://localhost:9002/api/v1/account-verify/${creteData._id}"\>link</a> if you didn't ask to verify this address, you can ignore this email. </b> `,
        }

        await transporter.sendMail(mailOption, (error:any, info:any)=>{
            if(error){
                console.log("error")
            }else{
                console.log("message sent: ", info.messageId)
            }
        })
        return res.status(201).json({
            message: "registration successfully check email to verify account"
        })
    }catch(error:any)
    {
        return res.status(400).json({
            message: "failed to register user",
            error: error.message
        })
    }    
}

export const LoginUser = async (req:Request, res:Response) =>{
    try{
        const {email, password} = req.body
        const user:any = await authModel.findOne({email:email})
        if(user)
        {
            const checkPassword = await bcrypt.compare(password, user.password)
            if(checkPassword)
            {
                if(user.verify)
                {
                    const {password, ...info} = user._doc
                    let options:any = {
                        expiresIn: "86400"
                    }
                    const token = jwt.sign({
                        id:user._id,
                        email: user.email,
                        userName: user.userName,
                        role: user.role
                    },"mySecretKey", 
                    {expiresIn: "86400"})
                    res.cookie ("sessionId", token, options)
                    console.log("cookie", req.headers['cookie'])
                    return res.status(200).json({
                        message: "login success",
                        data: info,
                        token: token
                    })
                }else{
                    let mailOption={
                        from: ' "Ojogoddy" <foo@example.com>', //sender address
                        to: email, // list of receivers
                        subject: "Ojogoddy Store", //subject line
                        text: "hello world", //plain text body
                        html: `<b>Hello world? follow this link to verify your email address <a href="https://localhost:9002/api/v1/account-verify/${user._id}"\>link</a> if you didn't ask to verify this address, you can ignore this email. </b> `,
                    }
            
                    await transporter.sendMail(mailOption, (error:any, info:any)=>{
                        if(error){
                            console.log("error")
                        }else{
                            console.log("message sent: ", info.messageId)
                        }
                    })
                    return res.status(404).json({
                        message: "please check your email to verify account",
                    })
                }
            }else{
                return res.status(404).json({
                    message: "account not found"
                })
            }
        }
    }catch(error:any)
    {
        return error
    }
}

 export const verifyUser = async (req:Request, res: Response)=>{
    try{
        const user = await authModel.findById(req.params.id)
        console.log(user)
        const verifyData = await authModel.findByIdAndUpdate(
            req.params.id,
            {
                verify: true
            },
            {new: true}
        )
        return res.status(201).json({
            message: "account has been verified, therefore proceed to login"
        })
    }catch(error:any)
    {
        return error
    }
 }

export const logOut = async(req:Request, res:Response) => {

    try
    {
        res.clearCookie("sessionId")
        res.setHeader('Clear-Site-Data', '"cookies", "storage"');
        return res.status(200).json({
            mesaage:"Signout successfully"
        })
        
    } catch (error:any){
        return res.status(404).json({
            message: error.message,
            
        })
     }
    
    
}

export const getSingleUser = async (req:Request, res:Response)=>{
    try{
        const getSingle = await authModel.findById(req.params.id).populate({
            path: "profile",
            select: "firstName lastName gender avatar"
        })
        return res.status(201).json({
            message: "successfull",
            data: getSingle
        })
    }catch(error:any){
        return error
    }
}

export const getAllUser = async(req: Request, res:Response)=>{
    try{
        const getAll = await authModel.find().populate({
            path: "profile",
            select: "firstName, lastName, gender, avatar"
        })
        return res.status(201).json({
            message: "successfull",
            data: getAll
        })
    }catch(error:any){
        return error
    }
}