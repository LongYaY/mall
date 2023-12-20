//链接数据库
const db = require("../model/conflg");
//加密密码或验证码
const md5 = require("md5");
//生成token
var jwt = require("jsonwebtoken");
//获取.env文件的秘钥
let secretKey = process.env.SECRETKEY;
//注册接口
const register = (req, res) => {
  let data = req.body;
  console.log(data);
  let sql =
    "INSERT INTO shop(`username`, `password`, `is_vip`) VALUES (?, ?, ?)";
  db.query(
    sql,
    [data.username, md5(md5(data.password)), data.is_vip],
    (err, result) => {
      if (err) {
        res.json({
          code: 500,
          msg: "注册失败",
        });
      } else {
        res.json({
          code: 200,
          msg: "注册成功",
        });
      }
    }
  );
};
//登录接口
const login = (req, res) => {
  let sql = "SELECT * FROM shop WHERE `username` = ? AND `password` = ?";
  db.query(
    sql,
    [req.body.username, md5(md5(req.body.password))], //双层加密防止逆向解密
    (err, result) => {
      if (err) {
        res.json({
          code: 500,
          msg: "登录失败",
        });
      }
      if (result.length == 0) {
        res.json({
          code: 500,
          msg: "登录失败未查询到此用户",
        });
      }

      let user = {
        ...result[0],
      };

      const tokenStr = jwt.sign(user, secretKey, {
        expiresIn: "1y",
      });
      res.json({
        code: 200,
        msg: "登录成功",
        token: tokenStr,
      });
    }
  );
};

module.exports = {
  login,
  register,
};
