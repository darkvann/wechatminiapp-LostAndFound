const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusstyle:'',
    islogined:false,
    schoollist:['西南大学','重庆大学'],
    inputfocus:'',
    userImage:'',
    nickName:'',
    Uni:'',
    changeUni:'',
  },
  login:function(){
    let userInfo;
    wx.getUserProfile({
    desc: '用于完善会员资料',
    success: (res) => {
      userInfo=res.userInfo,
      wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration: 1000,
      });
      app.openid = res.result.openid;
      app.nickName=userInfo.nickName;
      app.userImage=userInfo.avatarUrl;
      db.collection("UserInformation").where({
      _openid: app.openid,
    }).get().then(
        res => {
            let USER = true;
             if (res.data.length == 0) {
               USER = false;
             }
             if (USER == false) {
              this.setData({
                userImage: app.userImage,
                nickName:app.nickName,
              })
               this.addData();
             }
             //存在则覆盖现在的数据
             else {
               app.score = res.data[0].score;
               this.setData({
                userImage:res.data[0].userImage,
                nickName:res.data[0].nickName,
                Uni:res.data[0].Uni,
                focusstyle:"font-size:28rpx;top:-20rpx;left:-5rpx;color:white;",
                inputfocus:"color:white;"
               })
              }
                  //登录完成之后让“点击登录”字样隐藏，并使用户头像显示
                    this.setData({
                      islogined:true,
                })
            })
          })
        },
    })
  },
  //添加数据
  addData() {
    db.collection("UserInformation").add({
      data: {
        score:0,
        weChat: "",
        QQ:"",
        phoneNum:"",
        Uni:"西南大学",
        nickName:app.nickName,
        userImage:app.userImage,
        Lost:[],
        Found:[]
      }
    })
  },
  onfocus:function(e){
    this.setData({
      focusstyle:"font-size:28rpx;top:-20rpx;left:-5rpx;color:white;",
      inputfocus:"color:white;"
    })
  },
  confirm:function(){
    if(app.openid==''){
      wx.showToast({
        title: ' 请登录',
        icon: 'none'
       });
       return;
    }
    if(this.data.Uni == '' ){
      wx.showToast({
        title: ' 请确定学校',
        icon: 'none'
       });
       return;
    }
    else if(this.data.changeUni != this.data.Uni){
      if(this.data.Uni!="西南大学"&&this.data.Uni!="重庆大学"){
        wx.showToast({
          title: ' 暂不支持该学校',
          icon: 'none'
         });
        return;
      }
        db.collection("UserInformation").where({_openid : app.openid}).update({
          data:{
            Uni:this.data.Uni
          }
        })
    }
    wx.redirectTo({
      url: '../hall/hall?Uni='+this.data.Uni,
    })
  },
  cnlfocus:function(){
    if(this.data.Uni == ''){
        this.setData({
          focusstyle:"",
          inputfocus:"  color: rgb(255, 255, 255, 0.4);"
        })
      }
  },
  changeschool:function(e){
    this.data.changeUni = this.data.Uni
   let uni=this.data.schoollist[e.detail.value];
   this.setData({
      Uni:uni,
      focusstyle:"font-size:28rpx;top:-20rpx;left:-5rpx;color:white;",
      inputfocus:"color:white;"
    });
  },
  getData:function(e){
    this.data.changeUni = this.data.Uni,
    this.setData({
      Uni:e.detail.value,
    })
    // if(this.data.Uni == ''){
    //   this.setData({
    //     focusstyle:"",
    //     inputfocus:"  color: rgb(255, 255, 255, 0.4);"
    //   })
    // }
    // else{
    //   this.setData({
    //     focusstyle:"font-size:28rpx;top:-20rpx;left:-5rpx;color:white;",
    //     inputfocus:"color:white;"
    //   })
    // }
  }
})