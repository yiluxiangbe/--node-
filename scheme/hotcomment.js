const joi = require('joi')
// 这个文件里面写表单验证的处理规则

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 登录表单验证
// 热评的验证规则
const keyword = joi.string()
  .pattern(/[\u4e00-\u9fa5]/).required()
// 热评url的验证规则
const url = joi.string()
  .pattern( /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/)
  .required()

// 注册和登录表单的验证规则对象
module.exports.reg_hot_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    keyword,
    url,
  },
}

// 修改用户信息表单验证
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

module.exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}

// 用户重置密码的表单验证
const oldPassword = joi
.string()
.pattern(/^[\S]{6,12}$/)
.required()
// 新密码
const newPassword = joi
.string()
.pattern(/^[\S]{6,12}$/)
.required()

module.exports.update_userpwd_schema = {
  body: {
    oldPassword,
    newPassword
  }
}

// 用户修改头像表单验证
const userPic = joi.string().dataUri().required()

module.exports.update_userpic_schema = {
  body: {
    userPic
  }
}
