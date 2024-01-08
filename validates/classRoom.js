const { body } = require('express-validator');
const message = require('../helper/message');

const options = {
  teacherName: {
    min: 1,
    max: 30
  },
  name: {
    min: 1,
    max: 10
  }
};

module.exports = {
  validator: function () {
    return [
      body('name')
        .trim()
        .notEmpty()
        .withMessage('Tên không được để trống')
        .isLength({ min: options.name.min, max: options.name.max })
        .withMessage(`Tên phải có độ dài từ ${options.name.min} đến ${options.name.max} ký tự`),

      body('teacherName')
        .trim()
        .notEmpty()
        .withMessage('Tên giáo viên không được để trống')
        .isLength({ min: options.teacherName.min, max: options.teacherName.max })
        .withMessage(`Tên giáo viên phải có độ dài từ ${options.teacherName.min} đến ${options.teacherName.max} ký tự`)
    ];
  }
};