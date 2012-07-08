//Pong
;(function(){
	var pong = document.getElementById('pong'),
		c = pong.getContext('2d'),
		currentScreen = 'game',
		borderWidth = 5,
		widthLines = 10,
		padHeight = 60,
		vel = 3,
		velPads = 3,
		padA = {
			score : 0,
			x : borderWidth,
			y : (pong.height - padHeight)/2,
			deadLine : borderWidth + widthLines
		},
		padB = {
			score : 0,
			x : pong.width - borderWidth - widthLines,
			y : (pong.height - padHeight)/2,
			deadLine : pong.width - borderWidth - 2*widthLines
		},
		ball = {
			x : padA.deadLine + 5,
			y : (pong.height - padHeight)/2,
			velX : 1,
			velY : -1
		};
		
		
	c.fillStyle = c.strokeStyle = '#FFF';
	var reset = function(){
		padA.y = padB.y = (pong.height - padHeight)/2;
		ball.y = (pong.height - widthLines)/2;
	},
		init = function(){
		padA.score = padB.score = 0;
		currentScreen = 'game';
		reset();
	},
		drawLine = function(x,y,w,h){
		c.beginPath();
		c.moveTo(x,y);
		c.lineTo(x+w,y);
		c.lineTo(x+w,y+h);
		c.lineTo(x,y+h);
		c.fill();
		c.closePath();
	},
		moving = function(){
			if(ball.x <= padA.deadLine||ball.x >= padB.deadLine){
				ball.velX *= -1;
			}
			if(ball.y <= (borderWidth+widthLines)||ball.y >= (pong.height-borderWidth-2*widthLines)){
				ball.velY *= -1;
			}
			ball.x += vel*ball.velX;
			ball.y += vel*ball.velY;
		}
		drawStage = function(){
		c.clearRect(0,0,pong.width,pong.height);
		
		//lines
		drawLine(borderWidth+widthLines,borderWidth,pong.width - 2*(widthLines+borderWidth),widthLines);
		drawLine(borderWidth+widthLines,pong.height-widthLines-borderWidth,pong.width - 2*(widthLines+borderWidth),widthLines);
		
		if(currentScreen == 'start'){
			
		}else if(currentScreen == 'game'){
		
			//Middle line
			var mX = pong.width/2 - 2,
				posY = 2*borderWidth+widthLines,
				limitY = pong.height - posY;
			for(posY;posY<=limitY;posY+=2*widthLines){
				drawLine(mX,posY,4,widthLines);
			}
			
			moving();
			//Pads
			drawLine(padA.x,padA.y,widthLines,padHeight);
			drawLine(padB.x,padB.y,widthLines,padHeight);
			
			//Ball
			drawLine(ball.x,ball.y,widthLines,widthLines);
		
		}
		
		
	},
	
	
		timer = setInterval(function(){
		drawStage();
	},20);
	
	
	log(c)
	
	
})();
