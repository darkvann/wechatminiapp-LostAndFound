// pages/scoredetail/index.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    time:"",
    getScoreDetails:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataFinished();
    this.getDataTime();
  },

 

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000,
    });
    this.getDataFinished();
    this.getDataTime();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getDataFinished:function(){
    db.collection("UserInformation").where({
      _openid:app.openid
    }).get().then(res=>{
      this.setData({
        getScoreDetails:res.data[0].Found
      });
      this.getScore();
    })
  },
  getDataTime:function(){
    //获取时间
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let n = timestamp * 1000;
    let date = new Date(n);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let mins = date.getMinutes();
    let Time = year + "." + month + "." + day+ " " + hours+ ":" + mins;
    this.setData({
      time:Time
    })
  },
  getScore:function(){
    let Length = this.data.getScoreDetails.length;
    this.setData({
      score:Length
    })
    if(this.data.score != app.score){
      db.collection("UserInformation").where({
        _openid:app.openid
      }).update({
        data:{
       score:this.data.score
      }
      })
    }
    app.score=Length;
  },
  Back:function(){
    wx.navigateBack({});
  },
})