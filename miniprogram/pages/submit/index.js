var app = getApp();
const db = wx.cloud.database();
let imgArr = []; //这个数组用来临时存储图片数据
let urlArr = []; //存储图片fileID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    year:'',
    month:'',
    day:'',
    rewidth:'',
    statuTab:[false,true,true,true,true,true,true,true,true,true,true,true],
    chooseImageUrl: [], //绑定到页面的数据
    isfold:'',
    imgCount: 0, //图片的张数
    address:'',
    description:'',
    target:'',
    targetlist:['卡类','饰品','电子产品','文具','伞类','包类','体育用具','玩偶','衣服','钥匙','书籍','其他'],
    contact:['','',''],
    littletitle:'',
    lostThing:'',
    avatar:'',
    Uni:''
  },

  onLoad: function (options) {
    imgArr = [];
    var that=this;
    let referheight;
    let query=wx.createSelectorQuery(); 
    query.select('#refer').boundingClientRect();
    query.exec(function(res){
      // console.log(res);
      referheight=res[0].height;
      that.setData({rewidth:'width:'+referheight+'px;'})
    })
    that.setData({
      lostThing:options.lostThing,
      Uni:options.Uni,
      avatar:app.userImage
    })
  },

  //当用户向下滑动橙色卡片时触发，影藏顶端栏，并使白色卡片向上移动
  unfoldown:function(res){
    // console.log(res);
    this.setData({isfold:"position:absolute;top:-27%;"});
  },

  foldup:function(res){
    this.setData({isfold:""});
  },

  //换标签
  changetarget:function(e){
    // console.log(e);
    this.setData({target:this.data.targetlist[e.detail.value]})
  },

  //日期选择器
  changedate:function(e){
    this.setData({
      year:e.detail.value.substring(0,4),
      month:e.detail.value.substring(5,7),
      day:e.detail.value.substring(8,10),
      date:e.detail.value
    });
  },
  changeabs:function(e){
    let idx=e.currentTarget.dataset.index;
    if(idx==1){
      this.setData({lostThing:0});
    }else{
      this.setData({lostThing:1});
    }
  },
  //小标题
  inptitle:function(e){
    this.setData({
      littletitle:e.detail.value
    });
  },

  //获取地址
  getAddress:function(e){
    this.setData({
      address:e.detail.value
    })
  },

  //获取描述
  getDescription:function(e){
    this.setData({
      description:e.detail.value
    })
  },

  //点击提交
  formsubmit() {
    if (app.openid == '') {
    wx.showToast({
      title: '请先登录',
      icon: 'none'
    })
      return;
    };
    if (!this.checkForm()) { //调用checkForm方法，查看表单是否填写完整
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
      })
      return;
    };
    if(this.data.lostThing=='1'){
    db.collection("Lost_things").add({ //建立表
      data: {
        category: this.data.target,
        communication: this.data.contact,
        description: this.data.description,
        submit_nickname: app.nickName,
        place: this.data.address,
        status: 0,//0为为承接状态，1为承接，2为完成
        Time: this.data.date,
        submit_image: app.userImage,
        receive_openid:'',
        receive_nickname:'',
        receive_image:'',
        little_title:this.data.littletitle,
        Uni:this.data.Uni
      }
    }).then(res => { //避免异步调用
      this.upImg(res);
      wx.navigateBack({});
    })
  }
  else{
    db.collection("fLost_things").add({ //建立表
      data: {
        category: this.data.target,
        communication: this.data.contact,
        description: this.data.description,
        submit_nickname: app.nickName,
        place: this.data.address,
        status: 0,//0为为承接状态，1为承接，2为完成
        Time: this.data.date,
        submit_image: app.userImage,
        receive_openid:'',
        receive_nickname:'',
        receive_image:'',
        little_title:this.data.littletitle,
        Uni:this.data.Uni
      }
      }).then(res => { //避免异步调用
        this.upImg(res);
        wx.navigateBack({});
      })
    }
    wx.showToast({
      title: '成功',
      icon: 'success'
    });
  },

  //验证表单是否填写完整
  checkForm: function () {
    let form = [this.data.littletitle,this.data.address,this.data.date,this.data.description,this.data.target]
    if(!(this.data.contact[0]||this.data.contact[1]||this.data.contact[2])){
      return false;
    }
    for (var item in form) {
      if (!form[item]) {
        return false
      }
    }
    //在这里补充一个判断联系方式是否存在
    return true;
  },


  //图片卷
  paizhao: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'], //本地||相机
      sizeType: ['compressed'], //压缩
      count: 9,
      success: function (res) {

        var tempFilePaths = res.tempFilePaths;
        var len = that.data.imgCount + tempFilePaths.length
        //len 是此时已有的张数和本次上传的张数的和，也就是本次操作完成页面应该有的张数，因为用户可能会多次选择图片，所以每一次的都要记录下来。

        if (len > 9) {

          wx.showToast({
            title: '最大数量为9',
            icon: 'loading',
            duration: 1000
          })
          //超过结束
          return false
        }
        for (var i = 0; i < tempFilePaths.length; i++) {
          //将api 返回的图片数组push进一开始的imgArr，一定要循环一个个添加，因为用户上传多张图直接push就会多个路径在imgArr的同一个元素里。报错
          imgArr.push(tempFilePaths[i]);
        }
        //将此时的图片长度和存放路径的数组加到要渲染的数据中
        that.setData({
          imgCount: len,
          chooseImageUrl: imgArr
        })


      }
    })

  },
  //点关闭按键
  Close: function (e) {
    var mylen = this.data.chooseImageUrl.length; //当前渲染的数组长度

    var myindex = e.currentTarget.dataset.index; //当前点击的是第几张图片 data-index
    imgArr.splice(myindex, 1) //将这张图充存放图片的数组中删除

    this.setData({
      imgCount: mylen - 1, //长度减一
      chooseImageUrl: imgArr //将删除图片后的数组赋给要渲染的数组
    })
  },
     //图片上传
    upImg: function(res) {
      urlArr = []; //清空
      let fileName = Date.now();
      if(this.data.lostThing=='1'){
        imgArr.forEach((item, idx) => { //将所有图片以循环上传
          fileName = fileName + '_' + idx; //命名规则
          this.cloudFile1(item, fileName, res);
        })
      }
      else{
        imgArr.forEach((item, idx) => { //将所有图片以循环上传
          fileName = fileName + '_' + idx; //命名规则
          this.cloudFile2(item, fileName, res);
        })
      }
    imgArr = []; //清空
  },

  //上传文件函数
  cloudFile1: function(path, filename, dt) {
    wx.cloud.uploadFile({
      cloudPath: filename ,
      filePath: path,
    }).then(res => { //避免异步调用，循环一次更新一次
      urlArr.push(res.fileID);
      db.collection("Lost_things").doc(dt._id).update({
        data: {
          fileID: urlArr
        }
      })
    })
  },
  cloudFile2: function(path, filename, dt) {
    wx.cloud.uploadFile({
      cloudPath: filename ,
      filePath: path,
    }).then(res => { //避免异步调用，循环一次更新一次
      urlArr.push(res.fileID);
      db.collection("fLost_things").doc(dt._id).update({
        data: {
          fileID: urlArr
        }
      })
    })
  },
  //自动填入联系方式
  autoFill:function(e){
    if (app.openid == '') {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    };
    let idx=e.currentTarget.dataset.index;
    let info = '';
    db.collection("UserInformation").where({
      _openid: app.openid,
    }).get().then(
        res => {
          switch(idx){
            case 0:info = res.data[0].QQ;break;
            case 1:info = res.data[0].weChat;break;
            case 2:info = res.data[0].phoneNum;break;
            default: break;
          }
    }).then(res=>{
      if(info == ""){
        wx.showToast({
          title: '请先于个人信息中设置',
          icon: 'none'
        })
        return;
      }
      let userContact=this.data.contact;
      userContact[idx]=info;
      this.setData({
        contact:userContact
      })
  })
  },
   
  //获取联系方式
  contactInput:function(e){
    let idx= e.currentTarget.dataset.index;
    let cont=this.data.contact;
    cont[idx]=e.detail.value;
    this.setData({
      contact:cont
    }); 
  },

  cancel:function(){
    wx.navigateBack({});
  },
})
