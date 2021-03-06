const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupan')
const stripe = require('stripe')(process.env.STRIPE_SECRET);


exports.createPaymentIntent = async (req,res)=> {

    // console.log(req.body)
const {couponApplied}=  req.body;
// apply coupon
// calculate price

//1. find the user
const user = await User.findOne({email: req.user.email}).exec();

// 2. get user cart total
const {cartTotal,totalAfterDiscount} = await Cart.findOne({orderdBy:user._id}).exec();

// create payment intent with order amount and currency

let finalAmount = 0;
if(couponApplied && totalAfterDiscount)
{
    finalAmount = totalAfterDiscount *100
}else{
    finalAmount = cartTotal * 100
}


console.log('Cart total charge',cartTotal,'After Discount', totalAfterDiscount)
const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "inr",
    description: "u purchased an item",
})

res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
})

}
