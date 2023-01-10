const moment = require('moment')

module.exports = {
  dataDateFormat : function() {
      today = new Date();
      let hours = today.getHours(),
          dd = today.getDate(),
          mm = today.getMonth()+1,
          yyyy = today.getFullYear(),
          current

      if(hours < 2){
      // 자정 이전은 전날로 계산 
        today.setDate(today.getDate() - 1);
        dd = today.getDate()
        mm = today.getMonth()+1
        yyyy = today.getFullYear()
      }
      
      if(mm<10) {
        mm='0'+mm
      }
      if(dd<10) {
        dd='0'+dd
      } 
      
      current = yyyy.toString()+mm.toString()+dd.toString()
      return current 
    },
  
    dataTimeFormat : function() {
      today = new Date();
      let hours = today.getHours()
      let minutes = today.getMinutes()
      if(minutes < 10){
        // 10분보다 작으면 한시간 전 값
        hours = hours - 1;        
      }
      
      //3시간마다 예보
      if(hours>=2&&hours<5){hours=2}
      if(hours>=5&&hours<8){hours=5}
      if(hours>=8&&hours<11){hours=8}
      if(hours>=11&&hours<14){hours=11}
      if(hours>=14&&hours<17){hours=14}
      if(hours>=17&&hours<20){hours=17}
      if(hours>=20&&hours<23){hours=20}
      if(hours==23||hours==1||hours==24){hours==23}
      
      if(hours<10) {
        hours='0'+hours
      }   
      return hours+'00'
    },

    timeStampFormat : function() {
        return moment().format('YYYYMMDDHHmmss')
    }
}