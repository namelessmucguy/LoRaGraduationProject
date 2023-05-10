// 引入SDK核心类，js文件根据自己业务，位置可自行放置
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var timer;
Page({
    data: {
      long: 113.324520,
      lat: 23.099994,
      Capacity_set:0,
      marker1:null,
      marker2:null,
      passpoint:'',
      markers: []
  },
  setcapacity: function (e) {
    this.setData({
      Capacity_set: e.detail.value
    })
    console.log(e.detail.value)
  },
 /*41.886461,123.937122*/
    onLoad: function () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'XPSBZ-XP4W6-4T6SP-EGOLV-VMEQO-YVB6K'
        });
         //loacation
         var mythis = this;
    wx.getLocation({
      success(res) {
        mythis.setData({
          long: res.longitude,
          lat: res.latitude,
        })
      }
    })
    },
    formSubmit(e) {
      var _this = this;
      var lat = _this.data.lat;
      var long = _this.data.long;
      var myPoints = lat+','+long;
      //var m = _this.data.passpoint.split(",");//以“,”为标记分段取数组m[0],m[1]....
      var location1 = app.globalData.location[0];
      var location2 = app.globalData.location[1];
      var capacity1 = app.globalData.capacity[0];
      var capacity2 = app.globalData.capacity[1];
      var poins = '';
      var passpoint = _this.data.passpoint;
    /*  for (var i = 0; i < 10; i++) {
          if(app.globalData.location[i] === undefined)break;
          poins += app.globalData.location[i] + ";";
      }
      poins = poins.slice(1,poins.length);
      console.log(poins);*/
     /* mypoins = poins.split(";");
      for (let p = 0; p < i; p++) {
        this.setData({
          markers: [{
            iconPath: "../../images/location.png",
            id: p,
            latitude: mypoins[p].split(",")[p],
            longitude: mypoins[p].split(",")[p+1],
            width: 30,
            height: 30,
          }
        ]
        })
      }*/
      this.setData({
        passpoint:'',
        markers: [
        {
          iconPath: "../../images/终点.png",
          id: 1,
          latitude: (e.detail.value.dest.split(","))[0],
          longitude: (e.detail.value.dest.split(","))[1],
          width: 50,
          height: 50,
        }]
      })

    if (app.globalData.location[0] != undefined) {
        if (capacity1 <= this.data.Capacity_set) {
            passpoint += app.globalData.location[0] + ";",
            this.setData({
                passpoint,
                marker1: {
                    iconPath: "../../images/location.png",
                    id: 2,
                    latitude: (location1.split(","))[0],
                    longitude: (location1.split(","))[1],
                    width: 30,
                    height: 30,
                },
                markers: this.data.markers.concat(this.data.marker1)
              })
        }
        else{
            this.setData({
                marker1: {
                    iconPath: "../../images/location_none.png",
                    id: 2,
                    latitude: (location1.split(","))[0],
                    longitude: (location1.split(","))[1],
                    width: 30,
                    height: 30,
                },
                markers: this.data.markers.concat(this.data.marker1)
              })
        }
    }
    if (app.globalData.location[1] != undefined) {
        if (capacity2 <= this.data.Capacity_set ) {
            passpoint += app.globalData.location[1] + ";",
            this.setData({
                passpoint,
                marker2: {
                    iconPath: "../../images/location.png",
                    id: 3,
                    latitude: (location2.split(","))[0],
                    longitude: (location2.split(","))[1],
                    width: 30,
                    height: 30,
                },
                markers: this.data.markers.concat(this.data.marker2)
              })
        }
        else{
            this.setData({
                marker2: {
                    iconPath: "../../images/location_none.png",
                    id: 3,
                    latitude: (location2.split(","))[0],
                    longitude: (location2.split(","))[1],
                    width: 30,
                    height: 30,
                },
                markers: this.data.markers.concat(this.data.marker2)
              })
        }
    }
        this.setData({
            passpoint : passpoint.slice(0, -1)
          })
        console.log(passpoint);
      qqmapsdk.direction({
       // waypoints:poins + _this.data.passpoint,//e.detail.value.start,
        waypoints:_this.data.passpoint,
        mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from: myPoints,
        to: e.detail.value.dest, 
        success: function (res) {
          console.log(res);
          var ret = res;
          var coors = ret.result.routes[0].polyline, pl = [];
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] })
          }
          console.log(pl)
          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          _this.setData({
            passpoint:'',
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
              points: pl,
              color: '#006effdd',
              width: 4
            }]
          })
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
})
