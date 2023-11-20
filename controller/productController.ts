import express, { Application, Request, Response, NextFunction, application } from "express"
import authModel from "../model/authModel"
import profileModle from "../model/profileModle"
import catemodel from "../model/Category"
import cloudinary from "../utils/cloudinary"
import productModel from "../model/productModle"
import mongoose, { AnyKeys } from "mongoose"

export const createProduct = async (req:any, res:Response) =>{
    try{
        const { name, desc, qty, price, category } = req.body
        
        const {catId} = req.params
        console.log(catId)
        const getCat = await catemodel.findOne({_id:catId})
         console.log(getCat)
        
        const getUser = await authModel.findOne({ _id: req.user.id })
         console.log(getUser)
        // const {userId} = req.params
        // console.log(userId)
        if (req.user.role === "admin")
        {
        const dataProduct:any = await productModel.create({
            name, desc, qty, price, category, img:"imahe.jgp"
        })

        getCat?.products.push(new mongoose.Types.ObjectId(dataProduct._id))
        getCat?.save()

        dataProduct.createdby = getUser
        dataProduct.save()
         return res.status(201).json({
                success:1,
               message:dataProduct
           }) 
        } else
        {
              return res.status(201).json({
               message:"only admin can post"
           }) 
        }
    }catch(error:any){
        return res.status(400).json({
            message: 'failed to create product',
            error: error.message
        }) 
    }
}