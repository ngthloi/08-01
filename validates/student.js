const { body } = require('express-validator');
const message = require('../helper/message');

const options = {
  name: {
    min: 7,
    max: 15
  },
  address: {
    min: 7,
    max: 200
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

      body('address')
        .trim()
        .notEmpty()
        .withMessage('Địa chỉ không được để trống')
        .isLength({ min: options.address.min, max: options.address.max })
        .withMessage(`Địa chỉ phải có độ dài từ ${options.address.min} đến ${options.address.max} ký tự`),

      body('age')
        .trim()
        .notEmpty()
        .withMessage('Tuổi không được để trống')
        .isNumeric()
        .withMessage('Tuổi phải là một số')
    ];
  }
};