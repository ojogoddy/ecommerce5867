import nodemailer from "nodemailer"
import {google} from "googleapis"
import ejs from "ejs"
import path from "path"

// const oAuth = new google.auth.OAuth2()
const GOOGLE_SECRET= "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";
const GOOGLE_ID = "1027370869399-ikd9krv78l2m9u8h0q72u7lhlo1q9n08.apps.googleusercontent.com"
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground"
const GOOGLE_REFRESHTOKEN = ""
const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_REFRESHTOKEN, GOOGLE_ID  )
oAuth.setCredentials({refresh_token: GOOGLE_REFRESHTOKEN})

export const verifyUser = async (name:any)=>{
    try{
        const accessToken = await oAuth.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                type: "OAuth2",
                user: "goddy4aceu@gmail.com",
                refreshToken: GOOGLE_REFRESHTOKEN,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: accessToken
            }
        })
        const buildFile = path.join(__dirname, "../views/VerifyAccount.ejs")
        // const data = 
    }catch(error:any)
    {
        return error
    }
}