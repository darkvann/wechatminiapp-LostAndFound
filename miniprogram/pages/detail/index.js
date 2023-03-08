var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    user:{avatar:'',vrtname:'',pics:[],txt:"",target:"",losetime:"",loseplace:"",losething:"",contact:{qq:"",weixin:"",phone:""}},
    Title:"",
    myOpenid:'', //我的ID
    receive_openid:'',//承接者ID
    onwer:true,      //是发布者
    receiver:true,  //是承接者
    thingId:'',
    lostThing:0,  //是丢失发布
    Uni:'',
  },
  onLoad(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    });
    this.setData({
      lostThing:options.lostThing,
      thingId:options.id
    });
    if(this.data.lostThing == 1){
      this.getDataLost();
    }
    else{
      this.getDataFind();
    };
  },
  //监视页面被展示
  onShow:function(){
    let that = this;
    that.data.realTime = setInterval(function(){
      if(that.data.lostThing == 1){
        db.collection("Lost_things").where({
          _id: that.data.thingId
        }).get().then(
          res => {
            if(res.data.length==0){
              wx.showToast({
                title: '页面已关闭',
                icon: 'none',
                duration: 1000,
              });
              wx.navigateBack({})
            }
            that.setData({ 
              receive_openid:res.data[0].receive_openid
            })
          })
      }
      else{
        db.collection("fLost_things").where({
          _id: that.data.thingId
        }).get().then(
        res => {
          if(res.data.length==0){
            wx.showToast({
              title: '页面已关闭',
              icon: 'none',
              duration: 1000,
            });
            wx.navigateBack({})
          }
          that.setData({ 
            receive_openid:res.data[0].receive_openid
          })
        })
    }},2000)//间隔时间
   },

   //监视页面关闭
    onUnload:function(){
     let that = this;
     clearInterval(that.data.realTime);
   },
   //获取页面数据
   getDataLost() {
    db.collection("Lost_things").where({
      _id: this.data.thingId
    }).get().then(
      res => {
        if(res.data.length==0){
          wx.showToast({
            title: '页面已关闭',
            icon: 'none',
            duration: 1000,
          });
          wx.navigateBack({})
        }
        this.setData({
          myOpenid: app.openid,
          'user.loseplace': res.data[0].place,
          'user.target':res.data[0].category,
          'user.losething':res.data[0].little_title,
          'user.txt':res.data[0].description,
          'user.losetime':res.data[0].Time,
          'user.pics':res.data[0].fileID,
          'user.vrtname':res.data[0].submit_nickname,
          'user.avatar':res.data[0].submit_image,
          'user.contact.qq':res.data[0].communication[0],
          'user.contact.weixin':res.data[0].communication[1],
          'user.contact.phone':res.data[0].communication[2],
          receive_openid:res.data[0].receive_openid,
          Uni:res.data[0].Uni
        })
        let txt =this.data.user.loseplace + " | " + this.data.user.losething + " | " + this.data.user.losetime;
        this.setData({
          Title:txt
        })
        if(this.data.myOpenid!=res.data[0]._openid){
          this.setData({
            onwer: false
          })
        }
      if(this.data.receive_openid!=app.openid){
        this.setData({
          receiver:false
        })
      }
    })
  },
  getDataFind() {
    db.collection("fLost_things").where({
      _id: this.data.thingId
    }).get().then(
    res => {
      if(res.data.length==0){
        wx.showToast({
          title: '页面已关闭',
          icon: 'none',
          duration: 1000,
        });
        wx.navigateBack({})
      }
      this.setData({
        myOpenid: app.openid,
        'user.loseplace': res.data[0].place,
        'user.target':res.data[0].category,
        'user.losething':res.data[0].little_title,
        'user.txt':res.data[0].description,
        'user.losetime':res.data[0].Time,
        'user.pics':res.data[0].fileID,
        'user.vrtname':res.data[0].submit_nickname,
        'user.avatar':res.data[0].submit_image,
        'user.contact.qq':res.data[0].communication[0],
        'user.contact.weixin':res.data[0].communication[1],
        'user.contact.phone':res.data[0].communication[2],
        receive_openid:res.data[0].receive_openid,
        Uni:res.data[0].Uni
      })
      let txt =this.data.user.loseplace + " | " + this.data.user.losething + " | " + this.data.user.losetime;
      this.setData({
        Title:txt
      })
      if(this.data.myOpenid!=res.data[0]._openid){
        this.setData({
          onwer: false
        })
      }
      if(this.data.receive_openid!=app.openid){
        this.setData({
          receiver:false
        })
      }
    })
  },
  //承接
  callOwner:function(){
    if(this.data.myOpenid == ''){
      wx.showToast({
        title: ' 请先登录',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if(this.data.lostThing == 1){
      db.collection("Lost_things").where({
        _id: this.data.thingId
      }).update({
        data: {
          receive_openid:app.openid,
          receive_nickname:app.nickName,
          receive_image:app.userImage,
          status:'1'
        }
        }).then(res=>{ 
          this.getDataLost();
        })
      }
      else{
        db.collection("fLost_things").where({
          _id: this.data.thingId
        }).update({
          data: {
            receive_openid:app.openid,
            receive_nickname:app.nickName,
            receive_image:app.userImage,
            status:'1'
          }
        }).then(res=>{ 
          this.getDataFind();
        })
      }
      wx.showToast({
        title: '成功',
        icon: 'success'
      });
    },
  //确认
  define:function(e) {
    let list1=[],list2=[],tList1=[],tList2=[];
    let that = this;
    if(that.data.lostThing==1){
        db.collection("Lost_things").where({
          _id: that.data.thingId
      }).get().then(
        res => {
          list1 = res.data;
          list2 = res.data;
          wx.cloud.deleteFile({
            fileList:list1.fileID
          });
          db.collection("UserInformation").where({
            _openid: app.openid
          }).get().then(
            res => {
              tList1 = res.data[0].Lost;
            if(tList1 != null){
              list1 = list1.concat(tList1);
            }
            db.collection("UserInformation").where({
              _openid: app.openid
            }).update({
              data: {
                Lost : list1
              }
            })
          })
          db.collection("UserInformation").where({
            _openid: that.data.receive_openid
          }).get().then(
              res => {
                tList2 = res.data[0].Found;
              if(tList2 != null){
                list2 = list2.concat(tList2);
             }
              db.collection("UserInformation").where({
                _openid:that.data.receive_openid
              }).update({
              data: {
                 Found: list2
              }
            })
          })
          db.collection("Lost_things").where({
            _id: that.data.thingId
         }).remove();
        })
      }
      else{
        db.collection("fLost_things").where({
          _id: that.data.thingId
      }).get().then(
        res => {
          list1 = res.data;
          list2 = res.data;
          wx.cloud.deleteFile({
            fileList:list1.fileID
          });
          db.collection("UserInformation").where({
            _openid: app.openid
          }).get().then(
            res => {
              tList1 = res.data[0].Found;
              console.log()
            if(tList1 != null){
              list1 = list1.concat(tList1);
            }
            console.log(list1)
            db.collection("UserInformation").where({
              _openid: app.openid
            }).update({
              data: {
                Found : list1
              }
            })
          })
          db.collection("UserInformation").where({
            _openid: that.data.receive_openid
          }).get().then(
              res => {
                tList2 = res.data[0].Lost;
              if(tList2 != null){
                list2 = list2.concat(tList2);
             }
              db.collection("UserInformation").where({
                _openid:that.data.receive_openid
              }).update({
              data: {
                 Lost: list2
              }
            })
          })
          db.collection("fLost_things").where({
            _id: that.data.thingId
         }).remove();
        })
      }    
  },
  //否定
  deny:function(e){
    if( this.data.receive_openid ==''){
      return;
    }
    if(this.data.lostThing == 1){
      db.collection("Lost_things").where({
        _id: this.data.thingId
      }).update({
        data: {
          receive_openid:'',
          receive_nickname:'',
          receive_image:'',
          status:0
        }
        }).then(res=>{ 
          this.getDataLost();
        })
      }
      else{
      db.collection("fLost_things").where({
        _id: this.data.thingId
      }).update({
        data: {
          receive_openid:'',
          receive_nickname:'',
          receive_image:'',
          status:0
        }
      }).then(res=>{ 
        this.getDataFind();
      })
    }
    wx.showToast({
      title: '成功',
      icon: 'success'
    });
  },
  //取消承接
  cancelHold:function(){
    if(this.data.lostThing == 1){
      db.collection("Lost_things").where({
        _id: this.data.thingId
      }).update({
        data: {
          receive_openid:'',
          receive_nickname:'',
          receive_image:'',
          status:'0'
        }
        }).then(res=>{ 
          this.getDataLost();
        })
      }
    else{
      db.collection("fLost_things").where({
        _id: this.data.thingId
      }).update({
          data: {
            receive_openid:'',
            receive_nickname:'',
            receive_image:'',
          status:'0'
        }
      }).then(res=>{ 
        this.getDataFind();
     })
    }
    wx.showToast({
      title: '成功',
      icon: 'success'
    });
  },
})
