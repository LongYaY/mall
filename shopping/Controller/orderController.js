const db = require("../model/conflg");
const goodsC = require("../Controller/shopController");
const moment = require("moment");

const createOrder = async (req, res) => {
  let params = req.body;
  //   console.log(params);
  if (!params.id || !params.stock) {
    res.json({
      code: 500,
      msg: "参数错误",
    });
  }
  //1.先查询商品是否存在
  let goodsInfo = await goodsC.getGoodsById(params.id);
  if (goodsInfo.length === 0) {
    return res.json({
      code: 500,
      msg: "商品不存在",
    });
  }
  //   console.log(goodsInfo);
  //2.如果商品存在，再查询商品库存是否充足
  if (goodsInfo[0].stock < params.stock) {
    return res.json({
      code: 500,
      msg: "商品库存不足，当前库存剩余" + goodsInfo[0].stock + "件",
    });
  }
  //3.修改商品库存
  let stock = goodsInfo[0].stock - params.stock;
  let sql = "UPDATE `productlist` SET `stock` = ? WHERE `id` = ?";
  let result = await new Promise((resolve, reject) => {
    db.query(sql, [stock, params.id], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }).catch((err) => {
    return res.json({
      code: 500,
      msg: err.message,
    });
  });
  if (result.changedRows != 1) {
    return res.json({
      code: 500,
      msg: "库存修改失败",
    });
  }
  //4.获取用户信息
  let user = req.auth;
  let orderNo = createOrderNo();
  let price = user.is_vip == 1 ? goodsInfo[0].vipPrice : goodsInfo[0].price;
  let money = params.stock * price;
  console.log(money);
  let address = {
    address: params.address,
    username: params.username,
    mobile: params.mobile,
  };
  address_info = JSON.stringify(address);
  //5.生成订单
  let orderSql =
    "INSERT INTO `order`( `order_no`, `money`, `status`, `user_id`, `goods_id`, `address_info`, `goods_num`) VALUES (?, ?, ? , ? , ? ,?, ?)";
  let orderResult = await new Promise((resolve, reject) => {
    db.query(
      orderSql,
      [
        orderNo,
        money,
        1,
        user.id,
        goodsInfo[0].id,
        address_info,
        params.goods_num,
      ],
      (err, result) => {
        console.log(err);
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  }).catch((err) => {
    res.json({
      code: 500,
      msg: err.message,
    });
  });
  console.log(orderResult);
  if (orderResult.insertId) {
    res.json({
      code: 200,
      msg: "创建成功",
      orderid: orderResult.insertId,
    });
  }
};
const orderList = async (req, res) => {
  let user = req.auth;
  let sql = "SELECT * FROM `order` WHERE `user_id` = ?";
  let result = await new Promise((resolve, reject) => {
    db.query(sql, [user.id], (err, result) => {
      if (err) {
        reject(err);
      }
      result.forEach((item) => {
        item.address_info = JSON.parse(item.address_info);
      });
      resolve(result);
    });
  }).catch((err) => {
    return res.json({
      code: 500,
      msg: err.message,
    });
  });
  res.json({
    code: 200,
    msg: "success",
    data: result,
  });
};
// 支付订单;
const payOrder = async (req, res) => {
  let params = req.body;
  if (!params.order_no || !params.wx_order) {
    return res.json({
      code: 500,
      msg: "参数错误",
    });
  }
  let sql =
    "UPDATE `order` SET `status` = ?, `wx_order` = ? WHERE `order_no` = ?";
  let result = await new Promise((resolve, reject) => {
    db.query(sql, [2, params.wx_order, params.order_no], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  }).catch((err) => {
    return res.json({
      code: 500,
      msg: err.message,
    });
  });
  console.log(result);
  if (result.changedRows != 1) {
    return res.json({
      code: 500,
      msg: "订单支付失败",
    });
  }
  return res.json({
    code: 200,
    msg: "支付成功",
  });
};

//生成订单号
const createOrderNo = () => {
  let num = getRandomNum(100, 999);
  return "DD" + moment().format("YYYYMMDDHHmmSS") + num;
};
//获取指定访问随机数
const getRandomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
module.exports = {
  createOrder,
  orderList,
  payOrder,
};
