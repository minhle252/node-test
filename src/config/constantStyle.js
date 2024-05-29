const urlConfig = require("./constant");

const constant = {
    EMAIL: 'suport.minhthuhandmade@gmail.com',
    EMAIL_PASS: 'Trung@2020',
    // URL_CONFIG: process.env.URL_CONFIG
    STATUS_ORDER: {
      NEW: 1,
      CONFIRM: 2,
      PROCESSING: 3,
      SUCCESS: 4,
      FAILURE: 5
    },
    REDIRECT_PAGE: '/404.html',
    formatDate: function (data){
        const d = new Date(data);
        let date = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        return `${date}-${month}-${year}`;
    },
    formatNumber: function (number){
      let numberData = String(number).split(".");
      return  Number(numberData.join(""))
    },
    formatPrice: function (number){
      number = this.formatNumber(number)
      if(number && number > 0){
        return Number(number).toLocaleString('Vie')
      }else{
        return 0;
      }
    },
    isJsonString: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    formatPermission: function (listPer){
      let newListPer = [];
      listPer = listPer.map((item,index) => {
        if(constant.isJsonString(item.icon)){
          item.icon = JSON.parse(item.icon)
        }
        item.link = item.slug;
        if(!item.parent1){
          newListPer.push(item)
        }
        return item;
      })
      // format form data to sidebar in admin
      newListPer = newListPer.map((item,index) => {
        let childrenCurrent = [];
        listPer.forEach((item1,index1) => {
          if(item1.parent1 == item.id){
            childrenCurrent.push(item1)
          }
        })
        item.checkShow = false;
        item.listChildren = childrenCurrent;
        return item;
      })
      return newListPer;
    },
    array_column: function (list, column, indice){
      var result;
      if(typeof indice != "undefined"){
          result = {};
          for(key in list)
              result[list[key][indice]] = list[key][column];
      }else{
          result = [];
  
          for(key in list)
            list[key][column] ? result.push( list[key][column] ): '';
      }
  
      return result;
  },
  consvertImg: (item, type = 'single') => {
    if(type == 'single'){
      if(item.images && item.images.indexOf('http') == -1){
        item.images = urlConfig + item.images;
      }
    }else if(type == 'multiple'){
      if(item.length > 0){
        item = item.map(val =>{
          if(val.images && val.images.indexOf('http') == -1){
            val.images = urlConfig + val.images;
          }
          return val;
        })
      }
    }
    return item;
  }
};
module.exports = constant;