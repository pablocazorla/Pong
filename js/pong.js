//Pong
;(function(){
	
	var pong = document.getElementById('pong');
	if(pong && pong.getContext('2d')){
	
	var c = pong.getContext('2d');
		
	//Configuration
		c.fillStyle = c.strokeStyle = '#FFF';
		c.textAlign ='center';
		c.textBaseline = 'middle';		
	var cfg = {
			borderWidth : 5,
			widthLines : 10,
			padHeight : 80,
			ballVelocity : 3,
			padMaxVelocity : 5,
			padAcel : 0.4,
			padRes : 0.21,
			middle : pong.width/2,
			btnFont : 18,
			btnHeight : 40,
			humanVsPC : true,
			fontSize : function(n){
				c.font = n + 'px sans-serif'
			},
			dificult : 0.3,
			ia_y : pong.height/2
		},
		limit = {
			top : cfg.borderWidth + cfg.widthLines,
			bottom : pong.height - cfg.borderWidth - 2*cfg.widthLines,
			left : cfg.borderWidth + cfg.widthLines,
			right : pong.width - cfg.borderWidth - 2*cfg.widthLines
		},
		
	//Screens
		currentScreen = 'start', //start,config,game,pause,end
		
	//Sprites
		lineTop = {
			x : cfg.borderWidth + cfg.widthLines,
			y : cfg.borderWidth,
			w : pong.width - 2*(cfg.widthLines+cfg.borderWidth),
			h : cfg.widthLines
		},
		lineBottom = {
			x : cfg.borderWidth + cfg.widthLines,
			y : pong.height - cfg.borderWidth - cfg.widthLines,
			w : pong.width - 2*(cfg.widthLines+cfg.borderWidth),
			h : cfg.widthLines
		},
		lineMiddle = {
			x : cfg.middle - 2,
			yInit : 2*cfg.borderWidth+cfg.widthLines,
			y : 2*cfg.borderWidth+cfg.widthLines,
			w : 4,
			h : cfg.widthLines,
			limitY : pong.height - 2*cfg.borderWidth-cfg.widthLines
		},
		padA = {
			score : 0,
			scoreX : cfg.middle -40,
			x : cfg.borderWidth,
			y : (pong.height - cfg.padHeight)/2,
			w : cfg.widthLines,
			h : cfg.padHeight,
			dir : 0,
			vel : 0
		},
		padB = {
			score : 0,
			scoreX : cfg.middle +40,
			x : pong.width - cfg.borderWidth - cfg.widthLines,
			y : (pong.height - cfg.padHeight)/2,
			w : cfg.widthLines,
			h : cfg.padHeight,
			dir : 0,
			vel : 0
		},
		ball = {
			x : padA.x+ padA.w + 5,
			y : (pong.height - cfg.padHeight)/2,
			w : cfg.widthLines,
			h : cfg.widthLines,
			dirX : 1,
			dirY : -1,
			dir : 0,
			vel : 0
		},
		bckMov = {
			lTop : lineTop,
			lBottom : lineBottom,
			lLeft : {
				x : cfg.borderWidth,
				y : cfg.borderWidth,
				w : cfg.widthLines,
				h : pong.height - 2*cfg.borderWidth
			},
			lRight : {
				x : limit.right + cfg.widthLines,
				y : cfg.borderWidth,
				w : cfg.widthLines,
				h : pong.height - 2*cfg.borderWidth
			},
			ball : {
				x: cfg.middle,
				y: pong.height/2,
				w : cfg.widthLines,
				h : cfg.widthLines,
				dirX : 1,
				dirY : -1
			},
			color : '#555',
			draw : function(){
				if(currentScreen != 'game'){
					if(this.ball.x <= limit.left || this.ball.x >= limit.right) this.ball.dirX *= -1;
					if(this.ball.y <= limit.top || this.ball.y >= limit.bottom)	this.ball.dirY *= -1;
					this.ball.x += cfg.ballVelocity*this.ball.dirX;
					this.ball.y += cfg.ballVelocity*this.ball.dirY;					
					
					c.save();
					c.fillStyle = this.color;
					drawLine(this.lTop);
					drawLine(this.lBottom);
					drawLine(this.lLeft);
					drawLine(this.lRight);
					drawLine(this.ball);
					c.restore();
				}
			}
		}
		
	//Buttons
		
		btnPlay = {
			x : cfg.middle - 60,
			y : 340,
			w : 120,
			h : cfg.btnHeight,
			text : 'play'
		},
		btnNewGame = {
			x : cfg.middle - 60,
			y : 250,
			w : 120,
			h : cfg.btnHeight,
			text : 'new game'
		},
		btnContinue = {
			x : cfg.middle - 60,
			y : 310,
			w : 120,
			h : cfg.btnHeight,
			text : 'continue'
		},
		radiobuttonHvPC = {
			x : cfg.middle - 70,
			y : 180,
			w : 140,
			h : cfg.btnHeight,
			text : 'human vs. pc'
		},
		radiobuttonHvH = {
			x : cfg.middle - 70,
			y : 220,
			w : 140,
			h : cfg.btnHeight,
			text : 'human vs. human'
		},
		
	//Actions
		ia = function(){
			if(cfg.humanVsPC){
				if(ball.dirX == -1 && ball.x < (pong.width*cfg.dificult)){
					cfg.ia_y = ball.y;
					var dirY = ball.dirY;
					for(var x = ball.x;x > limit.left;x -= cfg.ballVelocity){
						if(cfg.ia_y <= limit.top || cfg.ia_y >= limit.bottom){
							dirY *= -1;
						}
						cfg.ia_y += cfg.ballVelocity*dirY;
					}
				};
				var difY = cfg.ia_y - (padA.y + cfg.padHeight/2),
					absDifY = Math.abs(difY);
				if(absDifY > (cfg.padHeight/2)){
					padA.dir = difY/absDifY;
				}else{
					padA.dir = 0;
				}
			};
		},
		start = function(){
			currentScreen = 'config';
		},
		play = function(){
			padA.score = padB.score = 0;
			currentScreen = 'game';
			padA.y = padB.y = (pong.height - cfg.padHeight)/2;
			ball.y = (pong.height - cfg.widthLines)/2;
		},
		padMoving = function(pad){
			if(Math.abs(pad.vel)<=cfg.padMaxVelocity){
				pad.vel += pad.dir*cfg.padAcel;				
			}
			if(pad.vel<0){pad.vel += cfg.padRes};
			if(pad.vel>0){pad.vel -= cfg.padRes};
			
			pad.y += pad.vel;
			
			if(pad.y < cfg.borderWidth) pad.y = cfg.borderWidth;
			if(pad.y > (limit.bottom+2*cfg.widthLines-cfg.padHeight)) pad.y = limit.bottom+2*cfg.widthLines-cfg.padHeight;
		},
		moving = function(){
			if(ball.x <= limit.left){				
				ball.dirX *= -1;
				if(padA.dir!=0)ball.dirY *= (padA.dir*ball.dirY);
				if(ball.y <= padA.y || ball.y >= (padA.y+cfg.padHeight)){
					ball.x = cfg.middle;
					padB.score++;
				}
			}
			if(ball.x >= limit.right){
				ball.dirX *= -1;
				if(padB.dir!=0)ball.dirY *= (padB.dir*ball.dirY);
				if(ball.y <= padB.y || ball.y >= (padB.y+cfg.padHeight)){
					ball.x = cfg.middle;
					padA.score++;
				}
			}
			if(ball.y <= limit.top || ball.y >= limit.bottom){
				ball.dirY *= -1;
			}
			ball.x += cfg.ballVelocity*ball.dirX;
			ball.y += cfg.ballVelocity*ball.dirY;
			
			ia();
			
			//Pads
			padMoving(padA);
			padMoving(padB);
			
		},
		
	//Draw functions
		drawLine = function(obj){
			c.beginPath();
			c.moveTo(obj.x,obj.y);
			c.lineTo(obj.x+obj.w,obj.y);
			c.lineTo(obj.x+obj.w,obj.y+obj.h);
			c.lineTo(obj.x,obj.y+obj.h);
			c.fill();
			c.closePath();
		},
		drawButton = function(obj){
			c.beginPath();
			c.moveTo(obj.x,obj.y);
			c.lineTo(obj.x+obj.w,obj.y);
			c.lineTo(obj.x+obj.w,obj.y+obj.h);
			c.lineTo(obj.x,obj.y+obj.h);
			c.lineTo(obj.x,obj.y);
			c.stroke();
			c.closePath();
			cfg.fontSize(cfg.btnFont);
			c.fillText (obj.text, obj.x+obj.w/2, obj.y + obj.h/2);
		},
		drawRadio = function(obj,select){
			c.save();
			c.textAlign = 'left';
			
			c.beginPath();
			c.arc(obj.x, obj.y+cfg.btnHeight/2, 10, 0, 2*Math.PI, false);
			c.stroke();
			c.closePath();
			
			if(select){
				c.beginPath();
				c.arc(obj.x, obj.y+cfg.btnHeight/2, 6, 0, 2*Math.PI, false);
				c.fill();
				c.closePath();
			}
			
			cfg.fontSize(cfg.btnFont);
			c.fillText (obj.text, obj.x+20, obj.y + obj.h/2);
			c.restore();
		},
		drawStage = function(){
			//Clear all
			c.clearRect(0,0,pong.width,pong.height);
			bckMov.draw();
			
			//Screens
			switch(currentScreen){
				case 'start':
					cfg.fontSize(70);
					c.fillText ('Pong', cfg.middle, 150);
					
					c.save();
					c.fillStyle = '#999';
					cfg.fontSize(12);
					c.fillText ('A simple HTML5 canvas app based in the ancient Pong game.', cfg.middle, 230);
					c.fillText ('Copyright 2012 Pablo Cazorla.', cfg.middle, 450);
					c.restore();
					
					drawButton(btnNewGame);
					break;
					
				case 'config':
					cfg.fontSize(50);
					c.fillText ('New Game', cfg.middle, 130);
					drawRadio(radiobuttonHvPC,cfg.humanVsPC);
					drawRadio(radiobuttonHvH,!cfg.humanVsPC);
					
					c.save();
					c.fillStyle = '#999';
					cfg.fontSize(12);
					c.fillText ('- To pause the game, press Esc key.', cfg.middle, 280);
					c.fillText ('- Press left and right key arrows to move the Left Pad down and up.', cfg.middle, 295);
					if(!cfg.humanVsPC){
						c.fillText ('- Press Z and C key to move the Right Pad down and up.', cfg.middle, 310);
					}
					c.restore();
					
					drawButton(btnPlay);
					break;
					
				case 'game':
					drawLine(lineTop);
					drawLine(lineBottom);
					//Scores
					cfg.fontSize(50);
					c.fillText (padA.score, padA.scoreX, 80);
					c.fillText (padB.score, padB.scoreX, 80);
					
					//Middle line			
					for(lineMiddle.y = lineMiddle.yInit;lineMiddle.y<=lineMiddle.limitY;lineMiddle.y+=(2*cfg.widthLines)){
						drawLine(lineMiddle);
					}
					moving();
					//Pads
					drawLine(padA);
					drawLine(padB);			
					//Ball
					drawLine(ball);
					
					if(padA.score >= 7 || padB.score >= 7){
						currentScreen = 'end';
					}
					
					break;
					
				case 'pause':
					cfg.fontSize(50);
					c.fillText ('Pause', cfg.middle, 130);
					drawButton(btnContinue);
					drawButton(btnNewGame);
					break;
					
				case 'end':
					cfg.fontSize(50);
					c.fillText ('Game Over', cfg.middle, 130);
					var messToYou = 'You win ';
					if(padA.score > padB.score && cfg.humanVsPC){
						messToYou = 'You lose ';
					}
					cfg.fontSize(30);
					c.fillText (messToYou+padA.score+' - '+padB.score, cfg.middle, 200);
					drawButton(btnNewGame);
					break;
			};
		},
		drawTimer = setInterval(function(){
			drawStage();
		},20),
		
	//Events
		on = function(elem,eventType, eventHandler) {
			if (elem.addEventListener) {
				elem.addEventListener(eventType, eventHandler,false);
			} else if (elem.attachEvent) {
			eventType = "on" + eventType;
				elem.attachEvent(eventType, eventHandler);
			} else {
				elem["on" + eventType] = eventHandler;
			}
		},
		accButton = function(ev,obj,callback){
			var mouseX = ev.clientX-pong.offsetLeft,
				mouseY = ev.clientY-pong.offsetTop;
			if(mouseX > obj.x && mouseX < obj.x+obj.w && mouseY > obj.y && mouseY < obj.y+obj.h){
				callback();
			};
		};
	on(pong,'click',function(ev){
		//Screens
		switch(currentScreen){
			case 'start':
				accButton(ev,btnNewGame,start);
				break;
				
			case 'config':
				accButton(ev,radiobuttonHvPC,function(){
					cfg.humanVsPC = true;
				});
				accButton(ev,radiobuttonHvH,function(){
					cfg.humanVsPC = false;
				});
				accButton(ev,btnPlay,play);
				break;
				
			case 'game':
				//
				break;
				
			case 'pause':
				accButton(ev,btnNewGame,start);
				accButton(ev,btnContinue,function(){
					currentScreen = 'game';
				});
				break;
				
			case 'end':
				accButton(ev,btnNewGame,start);
				break;
		};
	});
	on(document,'keypress',function(ev){
		ev = ev ? ev : window.event;
		var key = ev.charCode ? ev.charCode : ev.keyCode;
		//Screens
		switch(currentScreen){
			case 'start':
				//
				break;
				
			case 'config':
				//
				break;
				
			case 'game':
				switch(key){
					case 39:
						//arriba
						padB.dir = -1;
						break;				
					case 37:
						//abajo
						padB.dir = 1;
						break;
					case 99:
						//arriba
						if(!cfg.humanVsPC) padA.dir = -1;
						break;				
					case 122:
						//abajo
						if(!cfg.humanVsPC) padA.dir = 1;
						break;					
					case 27:
						currentScreen = 'pause';
						break;	
				};
				break;
				
			case 'pause':
				//
				break;
				
			case 'end':
				//
				break;
		};
	});
	on(document,'keyup',function(ev){
		ev = ev ? ev : window.event;
		var key = ev.charCode ? ev.charCode : ev.keyCode;
		log(key)
		//Screens
		switch(currentScreen){
			case 'start':
				//
				break;
				
			case 'config':
				//
				break;
				
			case 'game':
				switch(key){
					case 39:
						//arriba
						padB.dir = 0;
						break;				
					case 37:
						//abajo
						padB.dir = 0;
						break;
					case 90:
						//arriba
						if(!cfg.humanVsPC) padA.dir = 0;
						
						break;				
					case 67:
						//abajo
						if(!cfg.humanVsPC) padA.dir = 0;
						break;		
				};
				break;
				
			case 'pause':
				//
				break;
				
			case 'end':
				//
				break;
		};
		
	});
	}	
})();
