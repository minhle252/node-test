const constant = require("../../config/constantStyle");

const helpers = {
    stringifyJSON: function(context) {
      return JSON.stringify(context);
    },
    parseJSON: function(jsonString) {
      if(constant.isJsonString(jsonString)){
        jsonString = JSON.parse(jsonString);
      }
      return jsonString;
    },
    calculatePercent: function(oldPrice, price) {
      return Math.ceil(((oldPrice - price) / oldPrice * 100));
    },
    equal: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    subtract: function(a, b) {
      return a - b;
    },
    seq: function (start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    formatDate: function (dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    },
    slice: function (context, start, end) {
      if(context){
        if(context.length >= 2) {
          return context.slice(start, end);
        }else{
          if(context.length > 0){
            context[1] = context[0];
          }
          return context;
        }
      }
    },
    checkImage: function (index) {
        if((this.stt - 1) == index){
            return false;
        }else{
            return true;
        }
    },
    formatPrice: function (price) {
      price = Number(price);
      return price.toLocaleString('vi-VN')+' ₫';
    },
  }


module.exports = helpers;