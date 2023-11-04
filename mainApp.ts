import express, { Application } from "express"
import cors from "cors"
import userRouter from "./router/userRouter"
import profileRouter from "./router/profile"
import catRouter from "./router/categoryRouter"
import productRouter from "./router/productRouter"
import cartRouter from "./router/cartRouter"
import checkOutRouterv from "./router/orderRouter"
export const mainApp = (app:Application) => {
    
    app.use(cors()).use(express.json())
        .use("/api/v1", userRouter)
        .use("/api/v1", profileRouter)
        .use("/api/v1", catRouter)
        .use("/api/v1", productRouter)
        .use("/api/v1", cartRouter)
        .use("/api/v1", checkOutRouterv)
        .get("/api/v1", (req:any, res:any) => {
        
            res.status(200).json({
                message:"api is ready"
            })
    })
}