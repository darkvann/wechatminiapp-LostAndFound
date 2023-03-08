const app = getApp()

Page({
  data: {
    buttonCont:"取消",
    hiddenif:false,
    content:'',
    chosedTarget:'',
    chosed:[false,false,false,false,false,false,false,false]
  },
  onLoad() {
  },
  removeInput:function(e){
    if(this.data.hiddenif==false){
      this.setData({
        content:''
      });
    }else{
      this.setData({
        hiddenif:false,
        buttonCont:"取消"
      })
    }
  },
  newInput:function(e){
    this.setData({
      content:e.detail.value,
    });
  },

  chooseTarget:function(e){
    let idx=e.currentTarget.dataset.index;
    let temp=this.data.chosed;
    for(let i=0;i<8;i++){
      temp[i]=false;
    }
    temp[idx]=true;
    // console.log(temp);
    this.setData({
      chosed:temp
    });
    let targets=["卡包","伞","电子设备","衣服饰品","钥匙","体育用品","书籍文具","其他"]
    this.setData({
      chosedTarget:targets[idx]
    });
    console.log(this.data.chosedTarget);
    this.subData();
  },

  //上传数据函数，在点击标签或点击搜索按钮后会触发
  subData:function(){
    let searchData=[this.data.content,this.data.chosedTarget];//搜索信息和被选标签
    this.setData({
      hiddenif:true,
      buttonCont:"返回"
    })
  },

  startSearch:function(e){
    this.subData();
  },
})
