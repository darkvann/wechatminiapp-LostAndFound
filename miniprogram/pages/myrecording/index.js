// pages/myrecording/index.js
const app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user:{ava:"",name:''},
    currentTab:0,
    isEditMode:0,
    loselist_done:[],
    loselist_doing:[],
    foundlist_done:[],
    foundlist_doing:[],
    myreceivedf:[],
    myreceivedl:[]
  },

  clicktab:function(e){
    // console.log(e.currentTarget.dataset.index);
    let idx=e.currentTarget.dataset.index;
    this.setData({
      currentTab:idx,
    })
  },
  slidechange:function(e){
    // console.log(e.detail.current);
    this.setData({
      currentTab:e.detail.current,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentTab:options.lostThing,
      'user.ava':app.userImage,
      'user.name':app.nickName
    })
    this.getDataFind();
    this.getDataLost();
    this.getDataFinished();
    this.getDataReceived();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDataFind();
    this.getDataLost();
    this.getDataFinished();
    this.getDataReceived();
  },
//下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中',
      mask: true
    });
    this.setData({
      isEditMode:false,
      e1style:'display:inline-block;',
      e2style:'display:none;'
    });
    this.getDataFind();
    this.getDataLost();
    this.getDataFinished();
    this.getDataReceived();
    wx.hideLoading();
  },
  //获得数据
  getDataFind:function() {
    db.collection("fLost_things").where({
      _openid:app.openid
    }).orderBy('status','desc').orderBy('Time','desc').get({
      success: res=>{
        this.setData({
          foundlist_doing:res.data
        });
      }
    })
  },
  getDataLost:function() {
    db.collection("Lost_things").where({
      _openid:app.openid
    }).orderBy('status','desc').orderBy('Time','desc').get({
      success: res=>{
      this.setData({
        loselist_doing:res.data
      });
      },
    })
  },
  getDataFinished:function(){
    db.collection("UserInformation").where({
      _openid:app.openid
    }).get().then(res=>{
      this.setData({
        loselist_done: res.data[0].Lost,
        foundlist_done:res.data[0].Found
      });
    })
  },
  getDataReceived:function() {
    let  fvalue = [],lvalue = []
    db.collection("fLost_things").where({
      receive_openid:app.openid
    }).orderBy('Time','desc').get().then(res=>{
        fvalue = res.data;
        this.setData({
          myreceivedf:fvalue
        })
    })
    db.collection("Lost_things").where({
      receive_openid:app.openid
    }).orderBy('Time','desc').get().then(res=>{
      lvalue =  res.data;
      this.setData({
        myreceivedl:lvalue
      })
    })
  },
  close:function(){
    wx.navigateBack({})
  },
  
  //删除对应的失物贴
  delete:function(e){
    let that = this;
    let idx=e.currentTarget.dataset.index;
    let isdone=e.currentTarget.dataset.isdone;
    if(isdone == 1){
      if(that.data.currentTab ==0){
          that.data.loselist_done[idx].status = '3'; 
          db.collection("UserInformation").where({
            _openid:app.openid
          }).update({
            data:{
              Lost:that.data.loselist_done,
            }
          }).then(res=>{that.onPullDownRefresh()})
      }
      else{
          that.data.loselist_done[idx].status = '3';    
          db.collection("UserInformation").where({
            _openid:app.openid
          }).update({
            data:{
              Found:that.data.foundlist_done,
            }
          }).then(res=>{that.onPullDownRefresh()})
      }
    }
    else{
      if(that.data.currentTab ==0){
        wx.cloud.deleteFile({
          fileList:that.data.loselist_doing[idx].fileID
        })
        db.collection("Lost_things").where({
           _id:that.data.loselist_doing[idx]._id
        }).remove().then(that.onPullDownRefresh())
      }
      else{
        wx.cloud.deleteFile({
          fileList:that.data.foundlist_doing[idx].fileID
        })
         db.collection("fLost_things").where({
            _id:that.data.foundlist_doing[idx]._id
          }).remove().then(res=>{that.onPullDownRefresh()})
      }
    }
  },
  /*cancelundertaking:function(e){
    let that = this;
    let idx=e.currentTarget.dataset.index;
    console.log(idx)
  },*/

  clicktab:function(e){
    // console.log(e.currentTarget.dataset.index);
    let idx=e.currentTarget.dataset.index;
    this.setData({
      currentTab:idx,
    })
  },
  slidechange:function(e){
    // console.log(e.detail.current);
    this.setData({
      currentTab:e.detail.current,
    })
  },
  //点击启用编辑模式，编辑模式
  CGeditmissions:function(e){
    // let query=wx.createSelectorQuery(); 
    // query.select('#e1').boundingClientRect();
    // query.select('#e2').boundingClientRect();

    console.log(e);
    if(this.data.isEditMode==false){
      this.setData({
        isEditMode:true,
        e1style:'display:none;',
        e2style:'display:inline-block;',
      });
    }else{
      this.setData({
        isEditMode:false,
        e1style:'display:inline-block;',
        e2style:'display:none;'
      });
    }
  },
})