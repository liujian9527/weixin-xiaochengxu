var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  getMovieListData: function (url, settedKey, categoryTitle) { //向服务器发送请求，获取数据 wx.request({})
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application'
      },
      success: function (res) {
        //console.log(res.data)
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function () {
        console.log(error);
      }
    })
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle) { //获取具体电影信息 图片 片名 评分   
    var movies=[];
    for (var idx in moviesDouban.subjects) { //数组
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    // 
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  },
  
  onMoreTap:function(event){  //跳转更多 wx:navigateTo({})
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },
  
  onBindFocus: function(event){ //search
      this.setData({
        containerShow: false,
        searchPanelShow: true,
      })
  },
  
  onBindChange: function(event){  //search
    var text=event.detail.value;
    var searchUrl=app.globalData.doubanBase +
    "/v2/movie/search?q="+ text
    this.getMovieListData(searchUrl, "searchResult", "");
  },

  onCancelImgTap: function(event){  //search
      this.setData({
        containerShow: true,
        searchPanelShow: false,
      })
  },

  onMovieTap: function(event){
      var movieId = event.currentTarget.dataset.movieid;
      wx.navigateTo({
        url: 'movie-detail/movie-detail?id='+ movieId
      })
  }

})






/*
 发送请求 获取数据 wx.request({}) getMovieListData
 得到数据 success  res.data 分解 processDoubanData


 wx.request({
   url: 'https://xxxx',
   data: {},
   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   // header: {}, // 设置请求的 header
   success: function(res){
     // res.data

   },
   fail: function() {
     // fail
   },
   complete: function() {
     // complete
   }
 })
*/ 