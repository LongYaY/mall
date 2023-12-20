const mysql = require("mysql"); // 1. 导入 mysql 模块

const db = mysql.createConnection({
  // 2. 建立与 MySQL 数据库的连接关系
  host: "127.0.0.1", // 数据库的 IP 地址
  user: "root", // 登录数据库的账号
  password: "123456", // 登录数据库的密码
  database: "shop", // 指定要操作哪个数据库
});

module.exports = db;
