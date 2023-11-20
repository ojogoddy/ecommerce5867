import mongoose from "mongoose"

const url: string ="mongodb://0.0.0.0:27017/ecommerce"
const onlineUrl = "mongodb+srv://godwin5867:9T6GfbQTE1aEQV74@cluster0.sdii8ct.mongodb.net/ecommerce"

mongoose.connect(onlineUrl).then(() => {
    console.log("database connected successfully")
}).catch((error:any) => {
    console.log("an error occurred", error)
})

export default mongoose