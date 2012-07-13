//Pong
;(function(){
	
	var pong = document.getElementById('pong');
	var c = pong.getContext('2d');
	
	//Classes
	var Spr = function(){};
	Spr.prototype = {
		x : 0,
		y : 0,
		w : 0,
		h : 0,
		init : function(arg){
			for(a in arg){
				this[a] = arg[a];
			}
			return this;
		}
	};
	var Line = new Spr();
	Line.draw = function(){
			c.beginPath();
			c.moveTo(this.x,this.y);
			c.lineTo(this.x+this.w,this.y);
			c.lineTo(this.x+this.w,this.y+this.h);
			c.lineTo(this.x,this.y+this.h);
			c.fill();
			c.closePath();
	};
	
	var LineTop = new Line;
	LineTop.init({
		x : 10,
		y : 129,
		w : 320,
		h : 10,
		}).draw();
	
	
	
})();
