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

// 新增题库信息的表单验证
// 这个正则表达式表示输入必须包含中文
const question = joi
  .string()
  .regex(/[\u4E00-\u9FFF]/, 'containsChinese')
  .required()
const key = joi
  .string()
  .regex(/[\u4E00-\u9FFF]/, 'containsChinese')
  .required()
const score = joi.number().min(1).max(99).required()
const options = joi
  .string()
  .regex(/[\u4E00-\u9FFF]/, 'containsChinese')
  .required()

module.exports.insert_answer_schema = {
  body: {
    question,
    key,
    score,
    options
  }
}
