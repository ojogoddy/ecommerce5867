import mongoose from "mongoose";

interface products {
    name: string,
    img: string,
    desc:string,
    qty:number,
    price: string
    category: string,
    createdby: {},

}

interface iproducts extends products, mongoose.Document{ }

const proSchema = new mongoose.Schema({
    name: {
        type:String
    },
    img: {
        type:String
    },
    desc: {
        type:String
    },
    price: {
        type:Number
    },
    category: {
        type:String
    },
    qty: {
        type:Number
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
    {timestamps:true}
)

export default mongoose.model<iproducts>("products", proSchema)