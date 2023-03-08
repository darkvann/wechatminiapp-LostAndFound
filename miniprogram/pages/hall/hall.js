const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    //这个schoolrange要做成一个全局变量（或者存进数据库），记录所有的用户填入的学校（重复的不记），在主页用户填写学校信息的时候采集
    schoolrange:['西南大学','重庆大学'],
    userinfo:{school:"西南大学",score:0,avatar:"",nickname:""},
    // mark 是指原点x轴坐标
    mark: 0,
    // newmark 是指移动的最新点的x轴坐标 
    newmark: 0,
    //判断手指是否向右滑动的参数
    istoright: true,
    //判断是否打开折叠框
    open:false,
    //当前sweiper位置，0为捡到页面，1位丢失页面
    currentTab:0,
    //捡到物品信息列表左侧
    found_informations_left:[],
    //捡到物品信息列表右侧
    found_informations_right:[],
    //丢失物品信息列表左侧
    lost_informations_left:[],
    //丢失物品信息列表右侧
    lost_informations_right:[],
    Lost:'',
    Find:'',
    //刷新控制
    trigger1:false,
    trigger2:false
  },

  //页面显示时
  onLoad:function(options){
  /*  if(app.openid==''){
      this.setData({
        'userinfo.score':app.score,
        'userinfo.avatar':'cloud://yjx23332-4gzt6er385ca8136.796a-yjx23332-4gzt6er385ca8136-1305849876/my.png',
        'userinfo.nickname':'请登录',
        
      })
    }
    else{*/
      this.setData({
        'userinfo.school':options.Uni,
        'userinfo.score':app.score,
        'userinfo.avatar':app.userImage,
        'userinfo.nickname':app.nickName,
      })
    //};
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    });
    this.getDataFind();
    this.getDataLost();
  },
  //触底刷新
  onScroollRefreshF: function () {
    var that = this;
    setTimeout(function(){
      that.setData({
        trigger1:false
      })
    }, 1000);
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000,
    });
    this.getDataFind();
  },
  onShow(){
    this.setData({
      'userinfo.score':app.score,
    })
  },
  //下拉刷新
  onScroollRefreshL: function () {
    var that = this;
    wx.showToast(function(){
      that.setData({
        trigger2:false
      })
    }, 1000);
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000,
    });
    this.getDataLost();  
  },  

  //触底加载
  refreshF:function(){
    var num = this.data.Find.length; //记录当前已有个数
    db.collection("fLost_things").where({
      Uni:this.data.userinfo.school
    }).orderBy('Time', 'desc').skip(num).limit(24).get().then(
      res => {
        var find = this.data.Find.concat(res.data);
        this.setData({
        Find: find
      });
      if (num == this.data.Find.length) { //若数据库已经到底
        wx.showToast({
          title: ' 已到底部',
          icon: 'none'
         });
         return;
       }
       this.sort1();
    })
  },

  refreshL:function(){
    var num = this.data.Lost.length; //记录当前已有个数
    db.collection("Lost_things").where({
      Uni:this.data.userinfo.school
    }).orderBy('Time', 'desc').skip(num).limit(24).get().then(
      res => {
        var lost = this.data.Lost.concat(res.data);
        this.setData({
        Lost: lost
      });
      if (num == this.data.Find.length) { //若数据库已经到底
        wx.showToast({
          title: ' 已到底部',
          icon: 'none'
         });
         return;
       }
       this.sort2();
    })
  },

  //侧边栏快捷更改学校
  changeschool:function(e){
    // console.log(e.detail.value);
    let newuserinfo=this.data.userinfo;
    newuserinfo.school=this.data.schoolrange[e.detail.value];
    this.setData({
      userinfo:newuserinfo,
    });
    this.onScroollRefreshL();
    this.onScroollRefreshF();
  },
  //点击切换swiper
  clickchange:function(e){
    this.setData({currentTab:e.currentTarget.dataset.current});
    // console.log(this.data.currentTab);
  },
  //滑动切换swiper
  swipetochange:function(e){
    this.setData({currentTab:e.detail.current});
  },
  //导航到发布页
  navTosubmit:function(e){
    if (app.openid == '') {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    };
    wx.navigateTo({
      url: '../submit/index?lostThing='+this.data.currentTab+'&Uni='+this.data.userinfo.school,
    })
  },
  //侧边栏导航
  navto:function(e){
    // console.log(e.currentTarget.dataset.index);
    if(app.openid==''){
      wx.showToast({
        title: ' 请先登录',
        icon: 'none'
       });
      return;
    }
    let idx=e.currentTarget.dataset.index;
    let navlist=["../scoredetail/index","../myrecording/index?lostThing=0","../myrecording/index?lostThing=1","../myrecording/index?lostThing=2","../editmyinfo/index",];
    wx:wx.navigateTo({url:navlist[idx]});
  },
  // 点击左上角小头像事件
  tap_ch: function(e) {
    if (this.data.open) {
        this.setData({
            open: false
        });
    } else {
        this.setData({
            open: true
        });
    }
  },
  tap_start: function(e) {
    // touchstart事件
    // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
    this.data.mark = this.data.newmark = e.touches[0].pageX;
  },

  tap_drag: function(e) {
    // touchmove事件
    this.data.newmark = e.touches[0].pageX;
   
    // 手指从左向右移动
    if (this.data.mark < this.data.newmark) {
        this.istoright = true;
    }
    
    // 手指从右向左移动
    if (this.data.mark > this.data.newmark) {
        this.istoright = false;
    }
    this.data.mark = this.data.newmark;
  },

  tap_end: function(e) {
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    // 通过改变 opne 的值，让主页加上滑动的样式
    if (this.istoright) {
        // this.setData({
        //     open: true
        // });
    } else {
        this.setData({
            open: false
        });
    }
  },

  //获得数据
  getDataFind:function() {
    db.collection("fLost_things").where({
      Uni:this.data.userinfo.school
    }).orderBy('Time','desc').limit(24).get({
      success: res=>{
        this.setData({
          Find:res.data
        });
        this.sort1();
      }
    })
  },

  getDataLost:function() {
    db.collection("Lost_things").where({
      Uni:this.data.userinfo.school
    }).orderBy('Time','desc').limit(24).get({
      success: res=>{
      this.setData({
        Lost:res.data
      });
        this.sort2();
      },
    })
  },

  //排序 
  sort1:function(){
    var Left=[],Right=[];
    for(var i = 0;i < this.data.Find.length;i++){
      if(i%2==1){
        Right.push(this.data.Find[i]);
      }
      else{
        Left.push(this.data.Find[i]);
      }
    } 
    this.setData({
      found_informations_left:Left,
      found_informations_right:Right
    })
  },
  sort2:function(){
    var Left=[],Right=[];
    for(var i = 0;i<this.data.Lost.length;i++){
      if(i%2==1){
        Right.push(this.data.Lost[i]);
     }
    else{
       Left.push(this.data.Lost[i]);
     }
    }
    this.setData({
      lost_informations_left:Left,
      lost_informations_right:Right
    })  
  },

  //导航到搜索页面
  nav2search:function(e){
    wx.navigateTo({
      url: '../search/index?loseThing='+this.data.currentTab+'&Uni='+this.data.userinfo.school,
    })
  },
/*
  //用户登录
  getUserProfile(){
    if(app.openid!=''){
      return;
    }
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
                'userinfo.avatar': app.userImage,
                'userinfo.nickname':app.nickName,
              })
               this.addData();
             }
             //存在则覆盖现在的数据
             else {
               app.score = res.data[0].score;
               this.setData({
               'userinfo.score':res.data[0].score,
               'userinfo.avatar':res.data[0].userImage,
               'userinfo.nickname':res.data[0].nickName
               })
              }
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
  */
})
