const db = require("../model/conflg");

const shopList = (req, res) => {
  let sql = "SELECT * FROM productlist";
  db.query(sql, (err, result) => {
    if (err) {
      res.json({
        code: 400,
        msg: "获取商品失败",
      });
    }
    res.json({
      code: 200,
      msg: "获取商品成功",
      data: result,
    });
  });
};

//通过商品ID查询商品信息
const getGoodsById = async (id) => {
  return await new Promise((resolve, reject) => {
    let sql = "SELECT * FROM productlist WHERE `id` = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
      }
      if (result.length == 0) {
        reject("商品不存在");
      }
      resolve(result);
    });
  });
};
module.exports = {
  shopList,
  getGoodsById,
};
