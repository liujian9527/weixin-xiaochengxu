var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },

  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    })

    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }

    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })

    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processDoubanData)
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    // 下拉加载更多 如果要绑定新加载的数据， 那么需要同旧的数据合并到一起 
    var totalMovies = {}
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies : totalMovies
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
    this.data.totalCount +=20;
  },

  onScrollLower: function(event){
    var nextUrl = this.data.requestUrl +
    "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  onPullDownRefresh: function(event){
    var refreshUrl = this.data.requestUrl +
    "?start=0&count=20";
    // 清空 数据加载覆盖
    this.data.movies={};
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },

  onMovieTap: function(event){
      var movieId = event.currentTarget.dataset.movieid;
      wx.navigateTo({
        url: '../movie-detail/movie-detail?id='+ movieId
      })
  }


})