var Sprite = {
    x: 0,
    y: 0,
    xVel: 5,
    yVel: 5,
    weight: .02,
    shape: 'circle',
    radius: 15,
    color: 'green',
	restrain: true,
	lost: false,
	bulletCount: 100,
	id: 0,
	/**
	 * Initialize a sprite
	 * @param x Starting X Coordinate
	 * @param y Starting Y Coordinate
	 * @param xVel Starting X Velocity
	 * @param yVel Starting Y Velocity
	 * @param id Unique ID
	 */
    begin: function(x,y,xVel,yVel) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
    },
	/**
	 * Update the sprite's position based on velocity and gravity
	 * @param frame 
	 */
    move: function(frame) {
        // Decceleration
        this.yVel -= this.weight * 9.8;

        // Apply velocity
        this.x += this.xVel;
        this.y += this.yVel;

        if (this.x > frame.width || this.x < 0 || this.y < 0 || this.y > frame.height) {
			if (this.restrain) {
	            this.xVel = 0 - this.xVel;
	            this.x += this.xVel;
			}
			else {
				// Drop the sprite
				this.lost = true;
				this.score --;
			}
        }

        if (this.y < 0) {
            this.yVel = 0 - this.yVel;
            this.y += this.yVel;
        }
		else if (this.y > frame.height) {
			if (this.restrain) {
	            this.yVel = 0;
	            this.y += frame.height;
			}
			else {
				// Drop the sprite
				this.lost = true;
			}
		}
    }
}

var Cannon = {
	x: 0,
	y: 0,
	angle: 5,
	power: 5,
	length: 40,
	color: 'black',
	xComp: function() {
		const angleInRadians = this.angle * (Math.PI / 180);
		//console.log("Angle in radians: " + angleInRadians);
		const Cos = parseFloat(Math.cos(parseFloat(angleInRadians)));
		return this.length * Cos;
	},
	yComp: function() {
		const angleInRadians = this.angle * (Math.PI / 180);
		//console.log("Angle in radians: " + angleInRadians);
		const Sin = parseFloat(Math.sin(angleInRadians));
		return this.length * Sin;
	},
	tipX: function() {
		return this.x + this.xComp();
	},
	tipY: function() {
		return this.y + this.yComp();
	},
	draw: function(frame) {
		const angleInRadians = this.angle * (Math.PI / 180);
		//console.log("Angle in radians: " + angleInRadians);
		const Cos = parseFloat(Math.cos(parseFloat(angleInRadians)));
		const Sin = parseFloat(Math.sin(angleInRadians));
		//console.log("Cosine of " + this.angle + " is " + Cos +", Sine is " + Sin);
		const xComp = this.length * Cos;
		const yComp = this.length * Sin;
		//console.log("X component: " + xComp + ", Y component: " + yComp);
		const tipX = this.x + xComp;
		const tipY = this.y + yComp;
		//console.log("Drawing cannon from (" + this.x + "," + this.y + ") to (" + tipX + "," + tipY + ")");
		frame.context.beginPath();
		frame.context.moveTo(this.x,this.y);
		frame.context.lineTo(tipX,tipY);
		frame.context.stroke();
	}
}
var Bullet = { ...Sprite };

var Frame = {
    width: 0,
    height: 0,
    sprites: new Array(),
    canvas: '',
    context: '',
    _this: '',
	cannon: Cannon,
	bannerText: '',
	bannerExpires: 0,
	bannerX: 0,
	bannerY: 0,
	bulletCount: 100,
	score: 0,
    init: function(canv) {
        _this = this;
        console.log(canv);
        this.width = parseInt(canv.width);
        this.height = parseInt(canv.height);

        this.canvas = canv;
        this.context = this.canvas.getContext("2d");
		this.cannon.id = this.sprites.length;
		this.cannon.weight = .6;
    },
    addSprite(sprite) {
		sprite.id = this.sprites.length;
        this.sprites.push(sprite);
    },
    right: function() {
        return this.width;
    },
    bottom: function() {
        return this.height;
    },
    wipe: function() {
        this.context.globalCompositeOperation = 'destination-out';
        this.context.fillStyle = 'white';
        this.context.fillRect(0,0,this.width,this.height);
        this.context.globalCompositeOperation = 'source-over';
        //this.context.stroke();
    },
	renderScoreboard: function() {
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 1;
		this.context.strokeRect(this.width - 250,this.height - 60,this.width - 2,this.height - 2);
		this.context.stroke();
		this.context.font = '18px Arial';
		this.context.fillStyle = 'black';
		this.context.fillText("Score:",this.width - 190,this.height - 40);
		this.context.fillText(this.score.toString(),this.width - 190,this.height - 10);
		this.context.fillText("Bullets:",this.width - 90,this.height - 40);
		this.context.fillText(this.bulletCount.toString(),this.width - 90,this.height - 10);
	},
	renderCannon: function(cannon) {
		const tipX = cannon.tipX();
		const tipY = cannon.tipY();
		//console.log("Drawing cannon from (" + cannon.x + "," + cannon.y + ") to (" + tipX + "," + tipY + ")");
		this.context.strokeStyle = cannon.color;
		this.context.lineWidth = 5;
		this.context.beginPath();
		this.context.moveTo(cannon.x,this.height - cannon.y);
		this.context.lineTo(tipX,this.height - tipY);
		this.context.stroke();
	},
    renderSprite: function(sprite) {
        sprite.move(this);
		if (this.lost) {
			//console.log("Sprite " + sprite.color + " lost at (" + sprite.x + "," + sprite.y + ")");
			this.sprites.splice(this.sprites.indexOf(sprite),1);
			this.score --;
			return;
		}
		// Check for collisions
		for (var i = 0; i < this.sprites.length; i++) {
			if (sprite.id != this.sprites[i].id) {
				const radius = 15;
				var left = this.sprites[i].x - radius;
				var right = this.sprites[i].x + radius;
				var top = this.sprites[i].y + radius;
				var bottom = this.sprites[i].y - radius;
				if ((sprite.x >= left) && 
					(sprite.x < right) &&
					(sprite.y >= bottom) &&
					(sprite.y < top))
				{
					console.log("Sprite " + sprite.color + " collided with sprite " + this.sprites[i].color + " at (" + sprite.x + "," + sprite.y + ") vs (" + this.sprites[i].x + "," + this.sprites[i].y + ")");
					console.log(sprite.x + " >= " + left);
					console.log(sprite.x + " < " + right);
					console.log(sprite.y + " >= " + bottom);
					console.log(sprite.y + " < " + top);
					if (sprite.type == 'bullet' || this.sprites[i].type == 'bullet') {
						this.sprites.splice(this.sprites.indexOf(sprite),1);
						this.sprites.splice(this.sprites.indexOf(this.sprites[i]),1);
						this.bannerText = "Hit!";
						this.bannerX = sprite.x - 50;
						this.bannerY = sprite.y - 20;
						this.bannerExpires = new Date().getTime() + 2000;
						this.score += 10;
					}
					else {
						sprite.xVel = 0 - sprite.xVel;
						sprite.yVel = 0 - sprite.yVel;
						sprite.x += sprite.xVel;
						sprite.y += sprite.yVel;
					}
				}
			}
		}
        this.context.beginPath();
        if (sprite.shape == 'circle') {
            this.context.arc(sprite.x,this.height - sprite.y,sprite.radius,0,2*Math.PI,false);
            this.context.fillStyle = sprite.color;
            this.context.fill();
        }
        else {
            this.context.moveTo(sprite.x,this.height - sprite.y);
            this.context.lineTo(sprite.x+1,this.height - sprite.y+1);
            this.context.stroke();
        }
    },
    show: function() {
        for (var i = 0; i < this.sprites.length; i ++) {
            this.renderSprite(this.sprites[i]);
        }
		this.renderCannon(this.cannon);
		if (this.bannerExpires > new Date().getTime()) {
			this.context.fillStyle = 'black';
			this.context.font = '24px Arial';
			this.context.fillText(this.bannerText,this.bannerX,this.height - this.bannerY);
		}
		this.renderScoreboard();
    },
    go: function(){
        var loopIt = function() {
            //console.log("loopIt");
            requestAnimationFrame(loopIt, _this.canvas);
            _this.wipe();
            _this.show();
        }
        loopIt();
    }
}