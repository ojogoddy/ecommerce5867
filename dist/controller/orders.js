"use strict";
// import flutterwave from "flutterwave-node-v3"
// import express, { Application, Request, Response, NextFunction, application } from "express"
// import authModel from "../model/authModel"
// import profileModle from "../model/profileModle"
// import catemodel from "../model/Category"
// import cloudinary from "../utils/cloudinary"
// import cartModel from "../model/cartModel"
// import productModel from "../model/productModle"
// import orderModel  from "../model/order"
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOut = void 0;
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
const flutterwave_node_v3_1 = __importDefault(require("flutterwave-node-v3"));
const uuid_1 = require("uuid");
const order_1 = __importDefault(require("../model/order"));
const cartModel_1 = __importDefault(require("../model/cartModel"));
const flw = new flutterwave_node_v3_1.default("FLWPUBK_TEST-2df8a44294ae2ea7187fe9b6d8919c72-X", "FLWSECK_TEST-2c9d0861fa98f93e7b5ce50e0923bc75-X");
const checkOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const findUserCart = yield cartModel_1.default.findOne({ user: userId });
        const { card_number, cvv, expiry_month, expiry_year, amount, fullName } = req.body;
        const payload = {
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
            "tx_ref": (0, uuid_1.v4)()
        };
        const response = yield flw.Charge.card(payload);
        console.log(response);
        if (response.meta.authorization.mode === 'pin') {
            let payload2 = payload;
            console.log(payload);
            payload2.authorization = {
                "mode": "pin",
                // "fields": ["pin"],
                "pin": 3310
            };
            const reCallCharge = yield flw.Charge.card(payload2);
            const callValidate = yield flw.Charge.validate({
                "otp": "12345",
                "flw_ref": reCallCharge.data.flw_ref
            });
            console.log(callValidate);
            if (callValidate.status === "success") {
                const orderData = yield order_1.default.create({
                    user: findUserCart === null || findUserCart === void 0 ? void 0 : findUserCart.user,
                    orderitems: findUserCart === null || findUserCart === void 0 ? void 0 : findUserCart.cartItems,
                    bill: findUserCart === null || findUserCart === void 0 ? void 0 : findUserCart.bill
                });
                const deleteCart = yield cartModel_1.default.findByIdAndDelete({
                    _id: findUserCart === null || findUserCart === void 0 ? void 0 : findUserCart._id
                });
                return res.status(201).json({
                    status: "payment successfull",
                    orderData
                });
            }
        }
        return res.status(201).json({
            message: "working now"
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
            error: error.message
        });
    }
});
exports.checkOut = checkOut;
