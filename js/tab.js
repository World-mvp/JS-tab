(function($){
	
	var Tab =function(tab){

		var _this_ = this;
		//保存单个tab组件
		this.tab = tab;
		//默认配置参数，
		this.config = {
			//用户定义鼠标的促发类型，时click还是mouseover
			"triggerType":"mouseover",
			//用来定义内容切换效果，是淡入淡出，还是直接切换
			"effect":"default",
			//默认展示第几个tab
			"invoke":1,
			//用来定义tab是否自动切换，当指定了时间间隔，就表示自动切换，并且切换时间为指定时间间隔
			"auto":5000
		}
		//如果配置参数存在，就扩展掉默认的配置参数
		if (this.getConfig()){
			$.extend(this.config,this.getConfig());
		}
		
		//保存tab标签列表，对应的内容列表
		this.tabItems = this.tab.find("ul.tab-nav li");
		this.contentItems = this.tab.find("div.content-wrap div.content-item");

		//保存配置参数
		var config = this.config

		if (config.triggerType === "click") {
			this.tabItems.bind(config.triggerType,function(){
				_this_.invoke($(this));
			})
		}else if (config.triggerType === "mouseover"||config.triggerType != "click") {
			this.tabItems.mouseover(function(e){
				// 当config.triggerType为'mouseover'时，
				// 由于事件冒泡会触发tab上面的'mouseover'事件（通过hover方法绑定的），
				// 导致自动切换只执行一次。应在tabNav的'mouseover'事件中阻止冒泡
				e.stopPropagation();

				var self = $(this);
				this.timer = window.setTimeout(function(){

					_this_.invoke(self);

				},300);
				
			}).mouseout(function(){
				window.clearTimeout(this.timer);
			});
		}

		//自动切换功能，当配置了时间，就根据时间间隔进行自动切换。
		if (config.auto) {
			//定义一个全局的定时器
			this.timer = null;
			//计数器
			this.loop = 0;
			
			this.autoPlay();

			this.tab.hover(function(){
				window.clearInterval(_this_.timer);
			},function(){
				_this_.autoPlay();
			})

		};

		//设置默认显示第几个tab
		if (config.invoke > 1) {
			this.invoke(this.tabItems.eq(config.invoke-1));
		}

	};

	Tab.prototype = {

		//自动间隔时间切换
		autoPlay:function(event){
			var _this_ = this;
			tabItems = this.tabItems;//临时保存tab列表
			tablength = tabItems.length;//tab的个数
			config = this.config;

			this.timer = window.setInterval(function(){
				
				_this_.loop++;
				if (_this_.loop>=tablength) {
					_this_.loop = 0;
				};
				// console.log(3)
				tabItems.eq(_this_.loop).trigger(config.triggerType);

			},config.auto);
			

		},

		//时间驱动函数
		invoke:function(currentTab){
			var _this_ = this;
			/*
			要执行Tab的选中状态，当前选中的加上actived(标记为白底)
			切换对应的Tab内容，要根据配置参数的effect是default还是fade
			*/

			var index = currentTab.index();
			//Tab选中状态
			currentTab.addClass("actived").siblings().removeClass("actived");

			//切换对应内容区域
			var effect = this.config.effect;
			var conItems = this.contentItems;

			if (effect === "default"||effect != "fade") {

				conItems.eq(index).addClass("curret").siblings().removeClass("curret");

			}else if (effect === "fade") {

				conItems.eq(index).fadeIn().siblings().fadeOut();

			};

			//注意：如果配置了自动切换，记得把当前的loop的值设置成设置成tab的index
			if (this.config.auto) {
				this.loop = index;
			};
		},

		//获取配置参数
		getConfig:function(){

			//拿一下tab elem节点上data-config
			var config = this.tab.attr("data-config");

			//确保有配置参数
			if(config&&config!=""){
				return $.parseJSON(config);
			}else{
				return null;
			}
		}
	};

	window.Tab = Tab;

})(jQuery);

