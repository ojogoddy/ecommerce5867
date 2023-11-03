import mongoose from "mongoose";

interface category {
    name: string,
    slug: string,
    parent: string
    user: {},
    products:{}[]
}

interface icategory extends category, mongoose.Document{ }

const catSchema = new mongoose.Schema({
    name: {
        type:String
    },
    slug: {
        type:String
    },
    parent: {
        type:String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"products"
    }]
},
    {timestamps:true}
)

export default mongoose.model<icategory>("categories", catSchema)