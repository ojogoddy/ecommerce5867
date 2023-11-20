import express, { Application, Request, Response, NextFunction, application } from "express"
import authModel from "../model/authModel"
import profileModle from "../model/profileModle"
import catemodel from "../model/Category"
import cloudinary from "../utils/cloudinary"
import cartModel from "../model/cartModel"
import productModel from "../model/productModle"


export const addToCart  =  async(req:Request, res:Response)=>{
    try
    {
       const {productid} = req.params
        const { userId } = req.params

        const getUser = await authModel.findOne({ _id: userId })
        // console.log(getUser)
        const getProduct:any = await productModel.findOne({ _id: productid })
        // console.log(getProduct)

        const checkUserCart:any = await cartModel.findOne({ user: userId })
        // console.log(checkUserCart)
        if (checkUserCart)
        {
            const findIndexProduct = checkUserCart.cartItems.findIndex((item:any) => item?.product?.equals(productid))

            console.log("uisdui", findIndexProduct)
            if (findIndexProduct > -1)
            {
                 const userSelectPr = checkUserCart.cartItems[findIndexProduct]
            console.log(userSelectPr)
            userSelectPr.quantity += 1

            checkUserCart.bill = checkUserCart.cartItems.reduce((acc:any, cur:any) => {
                console.log(cur)
                return acc + cur.quantity * cur.price
            }, 0)
            
            checkUserCart.cartItems[findIndexProduct] = userSelectPr
            await checkUserCart.save()


             return res.status(201).json({
                 message: "you have order before",
                 result :checkUserCart 
               
             })
            } else
            {
                checkUserCart.cartItems.push({ product: getProduct?._id, quantity: 1, price: getProduct?.price })
                await checkUserCart.save()
                 checkUserCart.bill = checkUserCart.cartItems.reduce((acc:any, cur:any) => {
                console.log(cur)
                return acc + cur.quantity * cur.price
            }, 0)

                 return res.status(201).json({
                 message: "new product added",
                 result :checkUserCart 
               
             })
                
            }       
            
        } else
        {
              const dataCart = await cartModel.create({
            user: getUser?._id,
            cartItems: [{ product: getProduct?._id, quantity: 1, price: getProduct?.price }],
            bill:1 * getProduct?.price

        })

             return res.status(201).json({
                 message:"succesfuuly add to cart",
                 result:dataCart
             })
        }


      

   }catch(error:any){
        return res.status(400).json({
            message: error.message,
            error: error.message
        })
   }
}


// export const removeFromCart = async (req:Request, res:Response) => {
//     try
//     {
//         const { userId } = req.params
//         const productId = req.query.productId
//         const a = "world"
//         console.log(`hello ${a}`)
        

//         let cart:any = await cartModel.findOne({ user: userId })  
//         console.log(cart)

//         const position = cart?.cartItems.findIndex((item:any) => item.product == productId)
//         console.log(position)
//         if ( position > -1)
//         {
//             let item = cart?.cartItems[position]
//             if (item.quantity > 1)
//             {
//                   item.quantity -= 1;
//                 cart.bill -= item.price;
                
//             } else
//             {
//                  cart.bill -= item.quantity * item.price
//             if (cart.bill < 0)
//             {
//                 cart.bill = 0
//             }
//             cart?.cartItems.splice(position, 1)
//             }
           
//             cart.bill = cart.cartItems.reduce((acc:any, cur:any) => {
//                 console.log(cur)
//                 return acc + cur.quantity * cur.price
//             }, 0)
//             cart = await cart.save()

//                return res.status(201).json({
//                  message:"succesfuuly remove from cart",
//                 //  result:dataCart
//              })
         
//         } else
//         {
//              res.status(404).send("item not found");
//         }   
//     } catch (error:any)
//     {
//           return res.status(400).json({
//             message: error.message,
//             error: error.message
//         })
//    }
    
// }

export const RemovefromCart = async (req:Request, res:Response)=>{

    
    try
    {
        const {userId} = req.params
        let productId = req.query.productId

        console.log(productId)
        const checkUserCart = await cartModel.findOne({user:userId})
        
        const position:any = await checkUserCart?.cartItems?.findIndex((item:any)=>item?.product == productId)
        console.log("position", position)


        if(checkUserCart)
        {
            const item:any = checkUserCart.cartItems[position]
            console.log(item)
            

            if (item > 1)
            {
                item.quantity -= 1
                checkUserCart.bill -= item.price
            }else{
                checkUserCart.bill -= item.quantity * item.price
                if(checkUserCart.bill < 0)
                {
                    checkUserCart.bill = 0
                }
                checkUserCart.cartItems.splice(position, 1)
            }

           
            checkUserCart.bill = checkUserCart.cartItems.reduce((acc:any, cur:any)=>{
                console.log(cur);
                return acc + cur.quantity * cur.price
                
            }, 0)

            
            await checkUserCart.save()
            return res.status(201).json({
                message: "user have item in cart"
            })
        }else{
            return res.status(401).json({
                message: "no items in your cart"
            })
        }
    }catch(error:any)
    {
        return res.status(400).json({
            message: error.message,
            error: error.message
        })
    }
}
 



//  const userId = req.params.userId
//     const getUser  = await  authModel.findOne({_id:userId})
//     const {productName, quantity }  = req.body

//     const findProduct:any  = await productModel.findOne({name:productName })

//     const productId = findProduct._id;
//     const  price:any = findProduct?.price;
    

//     console.log(findProduct)
//     if (!findProduct) {
//        return res.status(404).send({ message: "product not found" });
//     }
//     const cart:any = await cartModel.findOne({user: userId})
//     console.log("get user cart",cart)

//     if(cart) {
//         const findIndexPro = cart.cartItems.findIndex((item)=> item?.product.equals(productId))
      
//         if(findIndexPro > -1){
//             const myPro = cart.cartItems[findIndexPro]
//             myPro.quantity += quantity || 1 
//             console.log("hksdg",myPro)
//             cart.bill = cart.cartItems.reduce((acc, curr)=>{
//                   console.log("chock", acc, curr)
//                   return acc + curr.quantity * curr.price
//             },0)

//             cart.cartItems[findIndexPro] = myPro
//             await cart.save()
//              return res.status(201).json({
//                  message:"succesfuuly add to cart",
//                  result:cart
//              })

//         }else{
//             cart.cartItems.push({ product: productId, quantity, price })
//               cart.bill = cart.cartItems.reduce((acc, curr)=>{
//                   console.log("chock", acc, curr)
//                   return acc + curr.quantity * curr.price
//               }, 0)
//             await cart.save()
//              return res.status(201).json({
//                  message:"succesfuuly add to cart",
//                  result:cart
//              })

//         }

//     }else{
//           const dataCrate = await cartModel.create({
//         user:userId,
//         cartItems:[{product:productId, quantity, price }],
//         bill: quantity  * price || 1 * price
//     })

//       return res.status(201).json({
//            message:"succesfuuly add to cart",
//         result:dataCrate
//         })

//     }