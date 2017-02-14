var postsData=require('../../data/posts-data.js');
Page({
    data: {
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        //console.log(postsData)
        this.setData({ post_key: postsData.postList});
    },
    onPostTap: function (event){
        var postId=event.currentTarget.dataset.postid;
        //console.log(postId);
        wx.navigateTo({
          url: 'post-detail/post-detail?id=' + postId
        })
    },
    onSwiperItemTap:  function (event){
        // target指的是用户点击的组件，而currentTarget是事件被捕获的组件
        var postId=event.currentTarget.dataset.postid;
        console.log(postId);
        wx.navigateTo({
          url: 'post-detail/post-detail?id=' + postId
        })
    }
})


