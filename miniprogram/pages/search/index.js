var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    listGreen:[],
    listOrange:[],
    search_data:'',
    list:[],
    listL:[],
    listR:[],
    buttonCont:"清除",
    hiddenif:false,
    chosedTarget:'',
    lostThing:'',
    Uni:'',
    chosed:[false,false,false,false,false,false,false,false,false,false,false,false]
  },
  onLoad(options) {
    this.setData({
      lostThing:options.loseThing,
      Uni:options.Uni
    })
  },
  //标签
  chooseTarget:function(e){
    let idx=e.currentTarget.dataset.index;
    let temp=this.data.chosed;
    for(let i=0;i<12;i++){
      temp[i]=false;
    }
    temp[idx]=true;
    // console.log(temp);
    this.setData({
      chosed:temp
    });
    let targets=["卡类","饰品","电子产品","文具","伞类","包类","体育用具","玩偶","衣服","钥匙","书籍","其他"]
    this.setData({
      chosedTarget:targets[idx]
    });
    this.find_tab();
  },

  //查询按钮
  find_tab:function(e){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000,
    });
    if(this.data.lostThing=='1'){
      db.collection("Lost_things").where({
        category:this.data.chosedTarget,
        Uni:this.data.Uni
      }).orderBy('Time','desc').limit(12).get({
        success: res=>{
          this.setData({
            list:res.data
          })
          this.sort();
        }
      })
     }
     else{
      db.collection("fLost_things").where({
        category:this.data.chosedTarget,
        Uni:this.data.Uni
      }).orderBy('Time','desc').limit(12).get({
        success: res=>{
          this.setData({
            list:res.data
          })
          this.sort();
        }
      })
     }
     this.setData({
      hiddenif:true,
      buttonCont:"返回"
    })
  },
  find_data: function(e){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000,
    });
     //模糊搜索
     if(this.data.lostThing=='1'){
      db.collection("Lost_things").where((_.or([
      {
          little_title:db.RegExp({
          regexp:'.*'+this.data.search_data,
          options:'i',
        })
      },
      {
       description:db.RegExp({
         regexp:'.*'+this.data.search_data,
         options:'i',
       })
      },
      {
      lostInfo:db.RegExp({
        regexp:'.*'+this.data.search_data,
        options:'i',
      })
      },
     {
       place:db.RegExp({
       regexp:'.*'+this.data.search_data,
       options:'i',
      })
     }]).and([
         {
          Uni:this.data.Uni
        },
      ]))).orderBy('Time','desc').limit(12).get({
       success: res=>{
        this.setData({
          list:res.data
        })
        this.sort();
       }
     })
    }
    else{
    db.collection("fLost_things").where((_.or([
      {
          little_title:db.RegExp({
          regexp:'.*'+this.data.search_data,
          options:'i',
        })
      },
      {
       description:db.RegExp({
         regexp:'.*'+this.data.search_data,
         options:'i',
       })
      },
      {
      lostInfo:db.RegExp({
        regexp:'.*'+this.data.search_data,
        options:'i',
      })
      },
     {
       place:db.RegExp({
       regexp:'.*'+this.data.search_data,
       options:'i',
      })
     }]).and([
         {
          Uni:this.data.Uni
        },
      ]))).orderBy('Time','desc').limit(12).get({
      success: res=>{
        this.setData({
          list:res.data
        })
        this.sort();
      }
    })
   }
   this.setData({
    hiddenif:true,
    buttonCont:"返回"
  })
  },
  find_Tag_and_data: function(e){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000,
    });
     //模糊搜索
     if(this.data.lostThing=='1'){
     db.collection("Lost_things").where(( _.or([
      {
          little_title:db.RegExp({
          regexp:'.*'+this.data.search_data,
          options:'i',
        })
      },
      {
       description:db.RegExp({
         regexp:'.*'+this.data.search_data,
         options:'i',
       })
     },
     {
      lostInfo:db.RegExp({
        regexp:'.*'+this.data.search_data,
        options:'i',
      })
    },
     {
       place:db.RegExp({
       regexp:'.*'+this.data.search_data,
       options:'i',
      })
     }]).and([
      {
       Uni:this.data.Uni
     },
     {
       category:this.data.chosedTarget,
     }
   ]))).orderBy('Time','desc').limit(12).get({
       success: res=>{
        this.setData({
          list:res.data
        })
        this.sort();
       }
     })
    }
    else{
    db.collection("fLost_things").where(( _.or([
      {
          little_title:db.RegExp({
          regexp:'.*'+this.data.search_data,
          options:'i',
        })

      },
      {
       description:db.RegExp({
         regexp:'.*'+this.data.search_data,
         options:'i',
       })
     },
     {
      lostInfo:db.RegExp({
        regexp:'.*'+this.data.search_data,
        options:'i',
      })
    },
     {
       place:db.RegExp({
       regexp:'.*'+this.data.search_data,
       options:'i',
      })
     }]).and([
      {
       Uni:this.data.Uni
      },
     {
       category:this.data.chosedTarget,
     }
   ]))).orderBy('Time','desc').limit(12).get({
      success: res=>{
        this.setData({
          list:res.data
        })
        this.sort();
      }
    })
   }
   this.setData({
    hiddenif:true,
    buttonCont:"返回"
  })
  },
  //排序 
  sort:function(){
    var Left=[],Right=[];
    for(var i = 0;i < this.data.list.length;i++){
      if(i%2==1){
        Right.push(this.data.list[i]);
      }
      else{
        Left.push(this.data.list[i]);
      }
    } 
    this.setData({
      listL:Left,
      listR:Right
    })
  },
  //获取文字
  get_data:function(e){
    this.setData({
      search_data:e.detail.value
    });
  },
  //取消按钮
  cancel: function(){
    if(this.data.hiddenif==false){
      this.setData({
        search_data:'',
        list:'',
        listR:'',
        listL:''
      });
    }else{
      this.setData({
        hiddenif:false,
        buttonCont:"清除",
        chosedTarget:"",
        search_data:"",
        list:'',
        listR:'',
        listL:''
      })
    }
  }
})



