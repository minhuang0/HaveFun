var mainApp = angular.module('mainApp', ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: './html/home.html',
			controller: 'homeController'
		})
		.when('/joke', {
			templateUrl: './html/joke.html',
			controller: 'jokeController'
		})
		.when('/joke_img', {
			templateUrl: './html/joke_img.html',
			controller: 'jokeImgController'
		})
		.when('/wechat', {
			templateUrl: './html/wechat.html',
			controller: 'wechatController'
		});
});

mainApp
	.controller('homeController', function($scope, $route) {
		$scope.message = '首页暂无内容';
	})
	.controller('menuController', function($scope, $location) {
		$scope.isActive = function(viewLocation) {
			return viewLocation === '/' + $location.path().split('/')[1];
		};
		$scope.siteName = "有趣";
	})
	.controller('wechatController', function($scope, $http, $routeParams, $location) {
		var page = parseInt($routeParams.page || 1);
		var typeid = parseInt($routeParams.typeid || 1);
		var action = $location.path();
		$scope.pagination = {
			next: "#" + action + "?page=" + (page + 1) + "&typeid=" + typeid,
			pre: page <= 2 ? "#" + action : "#" + action + "?page=" + (page - 1) + "&typeid=" + typeid,
		typeid: typeid
		}
		$http({
			url: "http://apis.baidu.com/showapi_open_bus/weixin/weixin_article_list?page=" + page + "&typeId=" + typeid,
			headers: {
				apikey: "f7ab4f3ea3bf59ae3399d54b06d87c42"
			}
		}).then(function(response) {
			$scope.news = response.data.showapi_res_body.pagebean.contentlist;

		});

		$http({
			url: "http://apis.baidu.com/showapi_open_bus/weixin/weixin_article_type",
			headers: {
				apikey: "f7ab4f3ea3bf59ae3399d54b06d87c42"
			}
		}).then(function(response) {
			$scope.news_types = response.data.showapi_res_body.typeList;
		});
	})
	.controller('jokeController', function($scope, $http, $routeParams, $location) {
		var page = parseInt($routeParams.page || 1);
		$http({
			url: "http://apis.baidu.com/showapi_open_bus/showapi_joke/joke_text?page=" + page,
			headers: {
				apikey: "f7ab4f3ea3bf59ae3399d54b06d87c42"
			}
		}).then(function(response) {
			$scope.jokes = response.data.showapi_res_body.contentlist;
		});
	})
	.controller('jokeImgController', function($scope, $http, $routeParams, $location) {
		var page = parseInt($routeParams.page || 1);
		$http({
			url: "http://apis.baidu.com/showapi_open_bus/showapi_joke/joke_pic?page=" + page,
			headers: {
				apikey: "f7ab4f3ea3bf59ae3399d54b06d87c42"
			}
		}).then(function(response) {
			$scope.jokes = response.data.showapi_res_body.contentlist;
		});
	})
	.run(['$rootScope', '$location', function($rootScope, $location) {
		$rootScope.$on('$routeChangeSuccess', function(evt, next, previous) {
			var action = $location.path();
			var page = parseInt($location.search().page || 1);
			$rootScope.pagination = {
				next: "#" + action + "?page=" + (page + 1),
				pre: page <= 2 ? "#" + action : "#" + action + "?page=" + (page - 1),
			}
		})
	}]);

$(document).ready(function() {
	// fix menu when passed
	$('.masthead')
		.visibility({
			once: false,
			onBottomPassed: function() {
				$('.fixed.menu').transition('fade in');
			},
			onBottomPassedReverse: function() {
				$('.fixed.menu').transition('fade out');
			}
		});

	// 滑动策划栏后给阴影添加隐藏侧滑栏事件
	$('.ui.sidebar')
		.sidebar('attach events', '.toc.item');

	// 点击侧滑栏菜单关闭侧滑栏
	$('.ui.sidebar > a').on('click', function() {
		$('.ui.sidebar').sidebar('hide');
	});

	//手势监听策划事件,滑动整个页面
	var hammer = new Hammer(document.body);

	hammer.on("swipeleft", function(e) {
		$('.ui.sidebar').sidebar('hide');
	});
	hammer.on("swiperight", function(e) {
		$('.ui.sidebar').sidebar('show');
	});

});