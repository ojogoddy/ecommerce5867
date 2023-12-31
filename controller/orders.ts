// import flutterwave from "flutterwave-node-v3"
// import express, { Application, Request, Response, NextFunction, application } from "express"
// import authModel from "../model/authModel"
// import profileModle from "../model/profileModle"
// import catemodel from "../model/Category"
// import cloudinary from "../utils/cloudinary"
// import cartModel from "../model/cartModel"
// import productModel from "../model/productModle"
// import orderModel  from "../model/order"

// const flw = new flutterwave("FLWPUBK_TEST-34c329098d54e8d40537c7dc3cdfbfff-X", "FLWSECK_TEST-5e2325da9812144788e8cc38500d1cc3-X")

// export const checkOut = async (req:Request, res:Response) => {
//     try
//     {
//         const { userId } = req.params
//         const {
//             card_number,
//             cvv, expiry_month,
//             expiry_year,
//         } = req.body
//         const findUserCart = await cartModel.findOne({ user: userId })
      
//         if (findUserCart)
//         {
//               console.log("show oo",findUserCart)
        
//         const payload:any = {
//             "card_number": card_number,
//             "cvv": cvv,
//             "expiry_month": expiry_month,
//             "expiry_year": expiry_year,
//             "currency": "NGN",
//             "amount": findUserCart?.bill,
//             "redirect_url": "https://www.google.com",
//             "fullname": "kode10x",
//             "email": "anyamahedwin@gmail.com",
//             "phone_number": "090816748533",
//             "enckey": "FLWSECK_TESTbef794dafc84",
//             "tx_ref": "example01sdd"

//         }

        

//         const response = await flw.Charge.card(payload)
//         console.log(response)

//             if (response.meta.authorization.mode === 'pin')
//             {
//                 let payload2 = payload
//                 console.log(payload)
//                 payload2.authorization = {  
//                         "mode": "pin",
//                         // "fields": ["pin"],
//                         "pin": 3310
//                     }

//                 const reCallCharge = await flw.Charge.card(payload2)

//                 console.log("this is recall charger", reCallCharge)

//                  const callValidate = await flw.Charge.validate({
//                 "otp": "12347",
//                 "flw_ref": reCallCharge.data.flw_ref
//             })
//                 console.log("this is call back", callValidate)

//                 if (callValidate.status ===  "success")
//                 {

//                     const orderData = await orderModel.create({
//                         user: findUserCart.user,
//                         orderitems: findUserCart.cartItems,
//                         bill:findUserCart.bill
                        
//                     })

//                     const deleteCart = await cartModel.findByIdAndDelete({_id:findUserCart._id})
//                       return res.status(201).json({
//                         status: 'Payment successful',
//                         orderData
//                         })
                
//                 } else
//                 { 
//                        return res.status(401).json({
//                         status: 'Payment failed',
//                         // order
//                         })
//                 }
   
//             }
            
//                  if( response.meta.authorization.mode === 'redirect') {

//                 let url = response.meta.authorization.redirect
//                 open(url)
//             }

          
//         } else
//         {
//               res.status(400).send('No cart found')
//         }
        
//     } catch (error:any)
//     {
//           return res.status(400).json({
//             message: error.message,
//             error: error.message
//         })
//     }
// }

import flutterwave from "flutterwave-node-v3"
import express, {Request, Response, Application, application, NextFunction} from "express"
import {v4 as uuidv4} from "uuid"
import order from "../model/order"
import cartModel from "../model/cartModel"

const flw = new flutterwave("FLWPUBK_TEST-2df8a44294ae2ea7187fe9b6d8919c72-X", "FLWSECK_TEST-2c9d0861fa98f93e7b5ce50e0923bc75-X")

export const checkOut = async(req:Request, res: Response)=>{
    try{
        const {userId} = req.params
        const findUserCart = await cartModel.findOne({user:userId})
        const {card_number, cvv, expiry_month, expiry_year, amount, fullName} = req.body
        const payload:any ={
            "card_number": card_number,
            "cvv": cvv,
            "expiry_month": expiry_month,
            "expiry_year": expiry_year,
            "currency": "NGN",
            "amount": amount,
            "redirect_url": "www.google.com",
            "fullName": fullName,
            "email": "developers@flutterwavego.com",
            "phone_number": "09012345678",
            "enckey": "FLWSECK_TEST4e6dc8381993",
            "tx_ref": uuidv4()
        }

        const response = await flw.Charge.card(payload)
        console.log(response);

        if (response.meta.authorization.mode === 'pin')
            {
                let payload2:any = payload
                console.log(payload)
                payload2.authorization = {  
                        "mode": "pin",
                        // "fields": ["pin"],
                        "pin": 3310
                    }
                    const reCallCharge = await flw.Charge.card(payload2)
                    const callValidate = await flw.Charge.validate({
                        "otp": "12345",
                        "flw_ref": reCallCharge.data.flw_ref
                    })
                    console.log(callValidate)

                    if(callValidate.status === "success")
                    {
                        const orderData = await order.create({
                            user: findUserCart?.user,
                            orderitems: findUserCart?.cartItems,
                            bill: findUserCart?.bill
                        })
                        const deleteCart = await cartModel.findByIdAndDelete({
                            _id: findUserCart?._id
                        })
                        return res.status(201).json({
                            status: "payment successfull",
                            orderData
                        })
                    }
                }
        return res.status(201).json({
            message: "working now"
        })
        
    }catch(error:any)
    {
        return res.status(400).json({
            message: error.message,
            error: error.message
        })
    }
}