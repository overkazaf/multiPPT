/**
 * 
 * @authors John Nong (overkazaf@gmail.com)
 * @date    2015-05-13 10:41:58
 * @version $Id$
 */

function log(k,v){
	v ? console.log(k,v) : console.log(k);
}
;(function ($){
	$.fn.slidable = function (options, data){
		var sliderList = [];
		var opts = $.extend({}, $.fn.slidable.defaults, options || {});
		var cachedData = data || []; // This can be implemented in a lazy mode
		var context = $(opts.context);
		var sliderContainer = context.find(opts.sliderContainer);
		var sliderItem = sliderContainer.children('ul');
		var sliderItemList = sliderItem.children('li');
		var titleElem = null;
			titleElem = opts.hasTitle ? context.find(opts.titleClass) : null;
		var shortcut = null;
			shortcut = opts.shortcut;

		return this.each(function (){
			var Slider = {
				ready : 1,
				_timer_ : null,
				currentIndex : 0,
				width : 400,
				heigth : 240,
				total : 3,
				itemList : [],
				shortcutContainer : null,
				shortcutItem : null,
				shortcutItemList : [],
				smallButtonContainer : null,
				smallButtonItem : null,
				smallButtonItemList : [],
				init : function (){
					var _this_ = this;
					if (opts.autoResize) {
						_this_.reRender();
					}

					if (opts.hasShortcut){
						_this_.shortcutContainer = context.find(opts.shortcut.sliderContainer);
						_this_.shortcutItem = _this_.shortcutContainer.children('ul');
						_this_.shortcutItemList = _this_.shortcutItem.children('li');
					}

					if (opts.hasSmallButton) {
						_this_.smallButtonContainer = context.find(opts.smallButton.container);
						_this_.smallButtonItem = _this_.smallButtonContainer.children('ul');
						_this_.smallButtonItemList = _this_.smallButtonItem.children('li');
					}

					_this_.width = sliderContainer.width();
					_this_.height = sliderContainer.height();
					_this_.bindEvents();


				}, 
				reRender : function (){
					var _this_ = this;
					var oW = sliderItem.width();
					var t = 1/sliderItemList.length * 100;
					$(sliderItemList).each(function (){
						$(this).css({
							width : t +'%'
						});
					});
				},
				bindEvents : function (){
					var _this_ = this;
					opts.autoPlay && _this_.autoPlay();

					if (opts.hasShortcut){
						
						_this_.shortcutItemList.each(function (index){
							$(this).on('click', function (){
								_this_.currentIndex = index % 3;
								_this_.refresh();
							});
						});
					}

					if (opts.hasSmallButton){
						
						_this_.smallButtonItemList.each(function (index){
							$(this).on('click', function (){
								_this_.currentIndex = index % 3;
								_this_.refresh();
							});
						});
					}
				},
				next : function (){
					this.currentIndex = (this.currentIndex + 1) % this.total;
				},
				refresh : function (){
					var _this_ = this;
					if(!_this_.ready)return;
					var target = -(this.currentIndex) * this.width;
					
					_this_.ready = false;
					sliderItem.animate({
						left : target + 'px'
					}, opts.switchSpeed, 'swing', function (){
						_this_.ready = true;
					});

					if (opts.hasShortcut) {
						this.shortcutItemList.removeClass('active');
						var idx = this.currentIndex;
						var tarH = 100;
						
						this.shortcutItem.animate({
							top : -(idx%3)*tarH + 'px'
						}, 500 , 'swing');

						
						this.shortcutItemList.eq(idx%3).addClass('active');
					}

					if (opts.hasSmallButton) {
						this.smallButtonItemList.removeClass('active');
						this.smallButtonItemList.eq(this.currentIndex).addClass('active');
					}

					if (opts.hasTitle) {
						titleElem.text(titleArray[this.currentIndex]);
					}

				},
				autoPlay : function (){
					var _this_ = this;
					var fnAuto = function (){
						_this_.timer = setInterval(function(){
							_this_.next();
							_this_.refresh();
						}, opts.interval);
					};

					fnAuto();

					context.on('mouseover',function (){
						_this_.stop();
					}).on('mouseout', function (){
						fnAuto();
					});
				},
				stop : function (){
					var _this_ = this;
					if (_this_.timer) {
						clearInterval(_this_.timer);
						_this_.timer = null;
					}
				},
				destroy : function (){
					// destroy the global events and remove the sliderlist
					
					// 
					
					sliderList.length = 0;
				}
			};

			Slider.init();
			sliderList.push(Slider);
		});
	};


	$.fn.slidable.defaults = {
		context     	: '#contextId', // The whole plugin container id
		sliderContainer : '.ppt-slider', // 
		autoResize      : 1, // calculate the width / height dynamically
		direction       : 'horizental',
		hasShortcut     : 1,
		shortcut   		: {
			count               : 3,
			direction           : "vertical",
			sliderContainer		: ".ppt-shortcut"
		},
		hasSmallButton  : 1,
		smallButton     : {
			container   : '.powerpoint-footer'
		},
		autoPlay		: 1,
		switchSpeed 	: 1000,
		interval        : 3000,
		hasTitle        : 1,
		titleClass      : 'titleClass',
		titleArray      : []
	};
})(jQuery);