cr.plugins_.hmmg_layoutTransition_v2 = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.hmmg_layoutTransition_v2.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var time = this.properties[0] || null;
		if(time != null)
			if(time >0)
				$("head").append("<style>.animated,animated.hinge,.animated.flipOutX,.animated.flipOutY,.animated.bounceIn,.animated.bounceOut,.animated.flipOutXX,.animated.flipInXX,.animated.flipInYY,.animated.flipOutYY{-webkit-animation-duration: "+time+"s !important;animation-duration: "+time+"s !important;}</style>");
	};
	instanceProto.onDestroy = function ()
	{
	};
	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
	};
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function (glw)
	{
	};
	function Cnds() {};
	Cnds.prototype.isTransitionReady = function ()
	{
		return true;
	};
	Cnds.prototype.didTransitionStart = function ()
	{
		return true;
	};
	Cnds.prototype.didTransitionFinish = function ()
	{
		return true;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.prepareTransition = function ()
	{
		var self = this ;
		function prepareCanvas(elem,callback1)
		{
			self.runtime.doCanvasSnapshot("image/jpeg", 100/100);
			setTimeout(function()
			{
				callback1(self.runtime.snapshotData);
			},50);
		}
		function isCanvasReady(callback)
		{
			prepareCanvas(self,function(returnedPic)
			{
				if($("#fakeCanvas")[0] == undefined)
				{
					var c2canvasdiv = $("#c2canvasdiv") ;
					var fakeCanvas  = $("<div id='fakeCanvas'><img src='"+returnedPic+"' height='"+c2canvasdiv.height()+"' width='"+c2canvasdiv.width()+"'/><div></div></div>");
					var fakeBody = $("<div id='fakeBody'></div>");
					var marginLeft = parseFloat(c2canvasdiv.css("margin-left"));
					fakeBody.css(
					{
						"top":c2canvasdiv.offset().top,
						"left":c2canvasdiv.offset().left,
						"width":c2canvasdiv.width(),
						"height":c2canvasdiv.height()
					});
					c2canvasdiv.addClass("prepared").find(" > :not(canvas)").each(function()
					{
						$(this).css("left",($(this).offset().left-marginLeft)+"px");
					});
					fakeBody.appendTo(document.body).append(c2canvasdiv).append(fakeCanvas);
					if(callback)
						callback();
				}
			});
		}
		isCanvasReady(function()
		{
			self.runtime.trigger(cr.plugins_.hmmg_layoutTransition_v2.prototype.cnds.isTransitionReady, self);
		});
	};
	Acts.prototype.startTransition = function (transID)
	{
		var fakeBody = $("#fakeBody");
		var c2canvasdiv = fakeBody.find("#c2canvasdiv") ;
		var fakeCanvas  = fakeBody.find("#fakeCanvas");
		var self = this ;
		function darkTheFakeCanvas(callback)
		{
			setTimeout(function()
			{
				fakeCanvas.find("div").addClass("darker");
				if(callback)
					callback();
			},1);
		}
		function removeChanges()
		{
			c2canvasdiv.appendTo(document.body).removeClass("prepared");
			fakeBody.remove();
			self.runtime.trigger(cr.plugins_.hmmg_layoutTransition_v2.prototype.cnds.didTransitionFinish, self)
		}
		self.runtime.trigger(cr.plugins_.hmmg_layoutTransition_v2.prototype.cnds.didTransitionStart, self)
		if(transID == 14)
		{
			c2canvasdiv.addClass("hidden");
			fakeCanvas.addClass('animated rotateOut').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
			});
			c2canvasdiv.removeClass("hidden").addClass('animated rotateIn').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				c2canvasdiv.removeClass("animated rotateIn");
				removeChanges();
			});
		}
		else if(transID == 13)
		{
			fakeCanvas.addClass('animated rollOut').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
			});
			c2canvasdiv.addClass('animated rollIn').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				c2canvasdiv.removeClass("animated rollIn");
				removeChanges();
			});
		}
		else if(transID == 12)
		{
			fakeCanvas.addClass('animated zoomOut').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
			});
			c2canvasdiv.addClass('animated zoomIn').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				c2canvasdiv.removeClass("animated zoomIn");
				removeChanges();
			});
		}
		else if(transID == 11)
		{
			c2canvasdiv.addClass("hidden");
			fakeCanvas.addClass('animated fadeOut').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
				c2canvasdiv.removeClass("hidden").addClass('animated fadeIn').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					c2canvasdiv.removeClass("animated fadeIn");
					removeChanges();
				});
			});
		}
		else if(transID == 10)
		{
			c2canvasdiv.addClass("hidden");
			fakeCanvas.addClass('animated fadeOut').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
			});
			c2canvasdiv.removeClass("hidden").addClass('animated fadeIn').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				c2canvasdiv.removeClass("animated fadeIn");
				removeChanges();
			});
		}
		else if(transID == 9)
		{
			c2canvasdiv.addClass("hidden");
			fakeCanvas.addClass('animated flipOutYY').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
				c2canvasdiv.removeClass("hidden").addClass('animated flipInYY').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					c2canvasdiv.removeClass("animated flipInYY");
					removeChanges();
				});
			});
		}
		else if(transID == 8)
		{
			c2canvasdiv.addClass("hidden");
			fakeCanvas.addClass('animated flipOutXX').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				fakeCanvas.addClass("hidden");
				c2canvasdiv.removeClass("hidden").addClass('animated flipInXX').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					c2canvasdiv.removeClass("animated flipInXX");
					removeChanges();
				});
			});
		}
		else if(transID == 7)
		{
			c2canvasdiv.addClass('animated slideInRight').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				c2canvasdiv.removeClass("animated slideInRight");
			});
		}
		else if(transID == 6)
		{
			c2canvasdiv.addClass('animated slideInLeft').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				c2canvasdiv.removeClass('animated slideInLeft');
			});
		}
		else if(transID == 5)
		{
			c2canvasdiv.addClass('animated slideInDown').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				c2canvasdiv.removeClass('animated slideInDown');
			});
		}
		else if(transID == 4)
		{
			c2canvasdiv.addClass('animated slideInUp').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				c2canvasdiv.removeClass('animated slideInUp');
			});
		}
		else if(transID == 3)
		{
			c2canvasdiv.addClass('animated slideInRight').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				c2canvasdiv.removeClass("animated slideInRight");
				fakeCanvas.removeClass('animated slideOutLeft');
			});
			fakeCanvas.addClass('animated slideOutLeft');
		}
		else if(transID == 2)
		{
			c2canvasdiv.addClass('animated slideInLeft').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				fakeCanvas.removeClass("animated slideOutRight");
				c2canvasdiv.removeClass('animated slideInLeft');
			});
			fakeCanvas.addClass('animated slideOutRight');
		}
		else if(transID == 1)
		{
			c2canvasdiv.addClass('animated slideInDown').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				fakeCanvas.removeClass("animated slideOutDown");
				c2canvasdiv.removeClass('animated slideInDown');
			});
			fakeCanvas.addClass('animated slideOutDown');
		}
		else if(transID == 0)
		{
			c2canvasdiv.addClass('animated slideInUp').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				removeChanges();
				fakeCanvas.removeClass("animated slideOutUp");
				c2canvasdiv.removeClass('animated slideInUp');
			});
			fakeCanvas.addClass('animated slideOutUp');
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	pluginProto.exps = new Exps();
}());
;
;
