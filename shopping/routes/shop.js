var express = require("express");
var router = express.Router();

//商品
const shopController = require("../Controller/shopController");
//订单
const order = require("../Controller/orderController");
//商品列表接口
router.get("/list", shopController.shopList);
//创建订单接口
router.post("/create_order", order.createOrder);
//订单列表接口
router.get("/order", order.orderList);
//支付订单接口
router.post("/pay_order", order.payOrder);

module.exports = router;
