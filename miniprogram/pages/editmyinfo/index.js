// pages/editmyinfo/index.js
var app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionstyle:'',
    ischangingname:false,
    editmode:[false,false,false,false],
    userinfo:{score:0,nickname:"",avatar:"",school:"",QQ:"",Weixin:"",phone:""},
  },

  feedback:function(e){
    console.log(e);
  },

  clickcgname:function(e){
    // console.log(e);
    if(this.data.ischangingname){
      this.setData({ischangingname:false})
    }else{
      this.setData({ischangingname:true})
    }
  },

 /*cgname:function(e){
    
    let info=this.data.userinfo;
    // if(e.detail.value!=NULL)
    info.nickname=e.detail.value;
    this.setData({userinfo:info});
    // console.log(this.data.userinfo);
  },
*/
  changeEditMode:function(e){
    // console.log(e.currentTarget.dataset.index);
    let idx=e.currentTarget.dataset.index;
    let list=this.data.editmode;

    if(list[idx]==false){
      for(let items in list){
        list[items]=false;
      }
      list[idx]=true; 
    }else{
      list[idx]=false;
    }
    
    this.setData({
      editmode:list,
    });
    // console.log(this.data.editmode);
  },
  newinput:function(e){
    // console.log(e.detail.value);
    let idx=e.currentTarget.dataset.index;
    let newinfo=this.data.userinfo;
    if(idx==0){
      newinfo.school=e.detail.value;
      this.setData({
       userinfo:newinfo,
     });
   }else if(idx==1){
    newinfo.QQ=e.detail.value;
    this.setData({
     userinfo:newinfo,
    });
   }else if(idx==2){
    newinfo.Weixin=e.detail.value;
    this.setData({
     userinfo:newinfo,
    });
   }else{
    newinfo.phone=e.detail.value;
    this.setData({
     userinfo:newinfo,
    });
   }
   
    // console.log(this.data.userinfo);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let picleft;
    let pictop;
    let avaheight;
    let avawidth;
    let picheight;
    let picwidth;
    let tomidtop;
    let tomidleft;
    let query=wx.createSelectorQuery(); 

    query.select('#ava').boundingClientRect();
    query.select('#pi').boundingClientRect();
    query.exec(function(res){
      // console.log(res);
      picheight=res[1].height;
      picwidth=res[1].width;
      pictop=res[1].top;
      picleft=res[1].left;
      avaheight=res[0].height;
      avawidth=res[0].width;
      // console.log(avaheight);
      // console.log(picheight);
      tomidtop=(avaheight-picheight)/2;
      tomidleft=picleft+(avawidth-picwidth)/2;
      // console.log(picleft);
      // console.log(tomidleft);
      that.setData({
        positionstyle:'top:'+tomidtop+'px;left:'+tomidleft +'px;',
      })
    })

    db.collection("UserInformation").where({
      _openid:app.openid
    }).get({
      success:res=>{
        that.setData({
          'userinfo.score':res.data[0].score,
          'userinfo.nickname':res.data[0].nickName,
          'userinfo.avatar':res.data[0].userImage,
          'userinfo.school':res.data[0].Uni,
          'userinfo.QQ':res.data[0].QQ,
          'userinfo.Weixin':res.data[0].weChat,
          'userinfo.phone':res.data[0].phoneNum
        })
      }
    })
  },
 
  updateuserinfo:function(){
    if(this.data.userinfo.school!="西南大学"&&this.data.userinfo.school!="重庆大学"){
      wx.showToast({
        title: ' 暂不支持该学校',
        icon: 'none'
       });
      return;
    }
    db.collection("UserInformation").where({
      _openid:app.openid
    }).update({
      data:{
      //nickName:this.data.userinfo.nickname,
      Uni:this.data.userinfo.school,
      QQ:this.data.userinfo.QQ,
      weChat:this.data.userinfo.Weixin,
      phoneNum:this.data.userinfo.phone,
    }
    }).then(res=>{
      wx.navigateBack({});
    })
     /*.then(res=>{ 
      app.nickName = this.data.userinfo.nickname;
      if(app.userImage!=this.data.userinfo.avatar){
        wx.cloud.deleteFile({
          fileList:[app.userImage]
        }).then(res=>{
          this.upImg(this.data.userinfo.avatar);
        })
      }
      else{
        wx.navigateBack({});
      }
    })*/
  },
/*
  changeAvatar:function(){
    var that = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'], //本地||相机
      sizeType: ['compressed'], //压缩
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var len = that.data.imgCount + tempFilePaths.length
        //len 是此时已有的张数和本次上传的张数的和，也就是本次操作完成页面应该有的张数，因为用户可能会多次选择图片，所以每一次的都要记录下来。
        if (len > 1) {
          wx.showToast({
            title: '最大数量为1',
            icon: 'loading',
            duration: 1000
          })
          //超过结束
          return false
        }
        //将此时的图片长度和存放路径的数组加到要渲染的数据中
        that.setData({
          'userinfo.avatar': tempFilePaths
        })
      }
    })
  },

  upImg: function(e) {
    wx.cloud.uploadFile({
      cloudPath: app.openid,
      filePath: e[0],
    }).then(res => { 
      app.userImage=res.fileID;
      console.log( app.userImage);
      db.collection("UserInformation").where({_openid:app.openid}).update({
        data: {
          userImage: res.fileID
        }
      })
    }).then(res=>{wx.navigateBack({});})
  },
*/
  close:function(){
    wx.navigateBack({})
  }
})