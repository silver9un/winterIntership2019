const log = require("../logger/logger.js")
const times = require("../times.js")
const request = require('request');
const configuration = require("../config/config.js")

const SUCCESS_CODE = 200
const ERROR_CODE = 503
let Devicedata

function readConfiguration() {
  log.info('configuration call')
  return new Promise(function(resolve, reject) {
    config = configuration.init()
    if(config) {
      log.info(config)
      Devicedata=config
      resolve(config)
    } else {
      reject('Error')
    }
  })
}

module.exports = {
  control: function() {
    readConfiguration()
    let recvData = {
      "responseCode" : 200,
      "items": [
      {
          "resource" : "WeatherInformation.ArpltnInforInqireSvc.CtprvnMesureLIst",
          "PM10":40,
          "PM25":12
      },
      {
          "resource" : "WeatherInformation.SecndSrtpdFrcstInfoService2.ForecastSpaceData",
          "T3H":25,
          "SKY":"partly cloudy",
          "PTY":"rain"
      }
      ]    
    }
    var url =  Devicedata.ArpltnInforInqireSvc_URL
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + Devicedata.ServiceKey; /* Service Key*/
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(Devicedata.numOfRow); /* 한 페이지 결과 수 */
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(Devicedata.pageNo); /* 페이지 번호 */
        queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent(Devicedata.sidoName); /* 시도 이름 (서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종) */
        queryParams += '&' + encodeURIComponent('searchCondition') + '=' + encodeURIComponent(Devicedata.searchCondition); /* 요청 데이터기간 (시간 : HOUR, 하루 : DAILY) */
        queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3');
       
    request({
      url: url + queryParams + '&_returnType=json',
      method: 'GET'
      }, function (err, response, body) {
        var jsonData = JSON.parse(body);
        var arr = jsonData.list;
        var wantarea;
        for(let i=0;i<arr.length;i++){
          if(arr[i].cityName=='화성시'){
            wantarea=arr[i]
          }
        }
        let pm10Value = wantarea.pm10Value
        let pm25Value = wantarea.pm25Value;
        
        recvData.items[0].PM10=pm10Value;
        recvData.items[0].PM25=pm25Value;    
        
        let _nx = Devicedata.nx,//화성시
        _ny = Devicedata.ny,//봉당구
        apikey = Devicedata.ServiceKey,
        basedate = times.dataDateFormat(),
        basetime = times.dataTimeFormat(),
        fileName = Devicedata.SecndSrtpdFrcstInfoService2_URL;
        fileName += "?ServiceKey=" + apikey;
        fileName += "&base_date=" + basedate;
        fileName += "&base_time=" + basetime;
        fileName += "&nx=" + _nx + "&ny=" + _ny;
        fileName += "&pageNo=1"+ Devicedata.pageNo
        fileName += "numOfRows=10"+Devicedata.numOfRow;
        fileName += "&_type=json"

        //api url 가져오기
        request({
          url: fileName,
          method: 'GET'
        }, function (error, response, body) {
          var jsonData_2 = JSON.parse(body)
          var arr = jsonData_2.response.body.items.item
          let sky, // (하늘상태) : 맑음(1), 구름조금(2), 구름많음(3), 흐림(4)
          pty, //(강수형태)없음(0), 비(1), 비/눈(2), 눈(3)
          t3h; //3시간단위 현재온도           
    
          for(var i=0;i<arr.length;i++){
            if(arr[i].category=='SKY'){
              sky=arr[i].fcstValue;
              if(sky==1){recvData.items[1].SKY= '맑음'}
              if(sky==2){recvData.items[1].SKY= '구름조금'}
              if(sky==3){recvData.items[1].SKY= '구름많음'}
              if(sky==4){recvData.items[1].SKY= '흐림'}
            }
            if(arr[i].category=='PTY'){
              pty=arr[i].fcstValue;
              if(pty==0){recvData.items[1].PTY= '없음'}
              if(pty==1){recvData.items[1].PTY= '비'}
              if(pty==2){recvData.items[1].PTY= '비/눈'}
              if(pty==3){recvData.items[1].PTY= '눈'}
            }
            if(arr[i].category=='T3H'){
              t3h=arr[i].fcstValue;
              recvData.items[1].T3H= t3h
            }              
          }
        })           
      })
      return recvData
    } 
  
}