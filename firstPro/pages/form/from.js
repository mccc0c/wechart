const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitHidden: true,
    getData: [],
    getflagHidden: true,
    mapHideFlag: true,
    Height: 0,
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    controls: [{
        id: 1,
        iconPath: '/pages/images/error.png',
        position: {
          left: 320,
          top: 100 - 50,
          width: 20,
          height: 20
        },
        clickable: true
      },
      {
        id: 2,
        iconPath: '/pages/images/jia.png',
        position: {
          left: 340,
          top: 100 - 50,
          width: 20,
          height: 20
        },
        clickable: true
      }
    ],
    circles: [],
    currentIndex:0,
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var self = this;
    self.WxValidate = app.WxValidate({
      name: {
        required: true
        /*,
                  minlength: 2,
                  maxlength: 10,*/
      },
      mobile: {
        required: true,
        tel: true,
      }
    }, {
      name: {
        required: '请填写您的姓名姓名',
      },
      mobile: {
        required: '请填写您的手机号',
      }
    })
    
  },
  //表单提交
  formSubmit: function(e) {
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        image: '/pages/images/error.png',
        duration: 2000
      })
      return false
    }
    this.setData({ submitHidden: false })
    var that = this,
      postData = {
        Realname: e.detail.value.name,
        Gender: e.detail.value.gender,
        Mobile: e.detail.value.mobile
        /*,
                Identity: app.userState.identity*/
      };
    //提交
    console.log(postData);
    that.setData({ submitHidden: false })
    /*wx.request({
      url: '',
      data: {
        Realname: e.detail.value.name,
        Gender: e.detail.value.gender,
        Mobile: e.detail.value.mobile,
        Company: e.detail.value.company,
        client: e.detail.value.client,
        Identity: appInstance.userState.identity
      },
      method: 'POST',
      success: function (requestRes) {
        that.setData({ submitHidden: true })
        appInstance.userState.status = 0
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function () {
      },
      complete: function () {
      }
    })*/
  },
  getLocation: function() {
    var self = this;
    // console.log('getLocation');
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // app.globalData.locationInfo = res;
        self.setData({
          mapHideFlag:false,
          scale:20,
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50,
            /*iconPath: "/pages/images/error.png",*/
            title: "哪里"
          }],
          circles: [{
            latitude: res.latitude,
            longitude: res.longitude,
            color: '#FF0000DD',
            fillColor: '#7cb5ec88',
            radius: 3000,
            strokeWidth: 1
          }]
        });

        /*app.globalData.location.longitude=res.longitude;
        app.globalData.location.latitude=res.latitude;
        self.setData({
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })*/
      }
    })
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          //未获取地理位置授权
          self.openConfirm()

        }
      }
    })
  },
  openConfirm: function() {
    wx.showModal({
      content: '检测到您没打开定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function(res) {
        // console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          //openSetting可以更改已向用户请求过的权限
          wx.openSetting({
            success: (res) => {}
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  //显示弹窗
  showDialog:function(){
    // this.dialog.checkDialog();
    this.dialog.showDialog();
  },
  //取消事件
  _cancelEvent:function(){
    this.dialog.hideDialog()
  },
  //确认事件
  _confirmEvent:function(){
    var self = this;
    console.log('你点击了确定');
    wx.request({
      url: 'http://localhost:3000/123',
      // url:'../images/data.json',
      method: 'GET',
      success: function(requestRes) {
        self.dialog.hideDialog();
        self.setData({ getflagHidden: false })
        // console.log(requestRes);
        self.setData({ getData: requestRes.data })
        // console.log(self.data.getData)
        /*appInstance.userState.status = 0
        wx.navigateBack({
          delta: 1
        })*/
      },
      fail: function() {},
      complete: function() {}
    })
    
  },
  /*tab切换*/
  swichNav:function(e){
    var id = e.target.dataset.current;
    this.setData({currentIndex:id});
    this.data.count=30*this.data.currentIndex;
    this.animation.translateX(this.data.count).step()
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 1000, 
      /**
       * http://cubic-bezier.com/#0,0,.58,1  
       *  linear  动画一直较为均匀
       *  ease    从匀速到加速在到匀速
       *  ease-in 缓慢到匀速
       *  ease-in-out 从缓慢到匀速再到缓慢
       * 
       *  http://www.tuicool.com/articles/neqMVr
       *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
       *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
       */
      timingFunction: 'linear',
      // 延迟多长时间开始
      delay: 100,
      /**
       * 以什么为基点做动画  效果自己演示
       * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
       * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
       */
      transformOrigin: 'left top 0',
      success: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})