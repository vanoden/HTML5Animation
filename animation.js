/**
 * Base Model For Sprite Objects
 */
var Sprite = {
    x: 0,					// X Coordinate
    y: 0,					// Y Coordinate
    xVel: 5,				// X Velocity
    yVel: 5,				// Y Velocity
    weight: .02,			// Weight (applies for gravity)
    shape: 'circle',		// Shape of the sprite
    radius: 15,				// Radius of the sprite
    color: 'green',			// Color of the sprite
	restrain: true,			// Restrain the sprite to the frame - bounce off walls
	lost: false,			// Sprite is lost - remove from the frame
	id: 0,					// Unique ID...set on initialization
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

		// Keep the sprite within the sides frame by bounce or drop
        if (this.x > frame.width || this.x < 0) {
			if (this.restrain) {
	            this.xVel = 0 - this.xVel;
	            this.x += this.xVel;
			}
			else {
				// Drop the sprite
				this.lost = true;
			}
        }

		// Sprite Hits the Ground
        if (this.y < 0) {
			if (this.restrain) {
	            this.yVel = 0 - this.yVel;
	            this.y += this.yVel;
			}
			else {
				// Drop the sprite
				console.log(this.color + " " + this.type + " lost at (" + this.x + "," + this.y + ")");
				this.lost = true;
			}
        }
		// Sprite hits the top
		else if (this.y > frame.height) {
			if (this.restrain) {
	            this.yVel = 0;
	            this.y += frame.height;
			}
			else {
				// Drop the sprite
				console.log(this.color + " " + this.type + " lost at (" + this.x + "," + this.y + ")");
				this.lost = true;
			}
		}
    }
}

/**
 * Cannon Object - represents the User's cannon/spaceship/vehicle
 */
var Cannon = {
	x: 0,					// X Coordinate
	y: 0,					// Y Coordinate
	angle: 5,				// Angle of the cannon
	power: 5,				// Power of the cannon - starting velocity of projectiles
	length: 40,				// Length of the cannon
	color: 'black',			// Color of the cannon
	/**
	 * Get the horizontal component of the cannon's nozzle wrs to base location
	 * @returns X component of the cannon angle
	 */
	xComp: function() {
		const angleInRadians = this.angle * (Math.PI / 180);
		//console.log("Angle in radians: " + angleInRadians);
		const Cos = parseFloat(Math.cos(parseFloat(angleInRadians)));
		return this.length * Cos;
	},
	/**
	 * Get the vertical component of the cannon's nozzle wrs to base location
	 * @returns Y component of the cannon angle
	 */
	yComp: function() {
		const angleInRadians = this.angle * (Math.PI / 180);
		//console.log("Angle in radians: " + angleInRadians);
		const Sin = parseFloat(Math.sin(angleInRadians));
		return this.length * Sin;
	},
	nozzleX: function() {
		return this.x + this.xComp();
	},
	nozzleY: function() {
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
	scoreboardFont: '18px Arial',
	scoreboardHeight: 60,
	scoreboardWidth: 250,
	score: 0,
	/**
	 * Initialize the framw within the canvas
	 * @param canv Canvas to draw on
	 */
    init: function(canv) {
        _this = this;
        console.log(canv);
        this.width = parseInt(canv.width);
        this.height = parseInt(canv.height);

        this.canvas = canv;
        this.context = this.canvas.getContext("2d");

		// Initialize the cannon
		this.cannon.id = this.sprites.length;
    },
	/**
	 * Add a sprite to the frame
	 * @param sprite Sprite to add
	 */
    addSprite(sprite) {
		sprite.id = this.sprites.length;
        this.sprites.push(sprite);
    },
	/**
	 * Get the Right boundary of the frame
	 * @returns Right boundary of the frame
	 */
    right: function() {
        return this.width;
    },
	/**
	 * Get the Bottom boundary of the frame
	 * @returns Bottom boundary of the frame
	 */
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
	/**
	 * Draw the Scoreboard
	 */
	renderScoreboard: function() {
		// Draw Scoreboard Boundary
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 1;
		this.context.strokeRect(this.width - this.scoreboardWidth,this.height - this.scoreboardHeight,this.width - 2,this.height - 2);
		this.context.stroke();
		// Draw Scoreboard Text
		this.context.font = this.scoreboardFont;
		this.context.fillStyle = 'black';
		this.context.fillText("Score:",this.width - 190,this.height - 40);
		this.context.fillText(this.score.toString(),this.width - 190,this.height - 10);
		this.context.fillText("Bullets:",this.width - 90,this.height - 40);
		this.context.fillText(this.bulletCount.toString(),this.width - 90,this.height - 10);
	},
	/**
	 * Draw the Cannon
	 */
	renderCannon: function(cannon) {
		this.context.strokeStyle = cannon.color;
		this.context.lineWidth = 5;
		this.context.beginPath();
		this.context.moveTo(cannon.x,this.height - cannon.y);
		this.context.lineTo(cannon.nozzleX(),this.height - cannon.nozzleY());
		this.context.stroke();
	},
	/**
	 * Draw the specified sprite
	 */
    renderSprite: function(sprite) {
        sprite.move(this);
		if (sprite.lost) {
			// Remove sprite from the frame if it's lost
			this.sprites.splice(this.sprites.indexOf(sprite),1);

			// Bullets aren't free!!!
			this.score --;
			return;
		}
		// Check for collisions
		for (var i = 0; i < this.sprites.length; i++) {
			if (sprite.id != this.sprites[i].id) {
				const radius = 15;
				var left = this.sprites[i].x - this.sprites[i].radius;
				var right = this.sprites[i].x + this.sprites[i].radius;
				var top = this.sprites[i].y + this.sprites[i].radius;
				var bottom = this.sprites[i].y - this.sprites[i].radius;
				if ((sprite.x + sprite.radius >= left) && 
					(sprite.x - sprite.radius < right) &&
					(sprite.y + sprite.radius >= bottom) &&
					(sprite.y - sprite.radius < top))
				{
					console.log("Sprite " + sprite.color + " collided with sprite " + this.sprites[i].color + " at (" + sprite.x + "," + sprite.y + ") vs (" + this.sprites[i].x + "," + this.sprites[i].y + ")");
					//console.log(sprite.x + " >= " + left);
					//console.log(sprite.x + " < " + right);
					//console.log(sprite.y + " >= " + bottom);
					//console.log(sprite.y + " < " + top);
					if (sprite.type == 'bullet' || this.sprites[i].type == 'bullet') {
						let value = 0;
						if (sprite.type == 'bullet') {
							value = parseInt(100/this.sprites[i].radius);
						}
						else {
							value = parseInt(100/sprite.radius);
						}
						this.score += value;

						this.sprites.splice(this.sprites.indexOf(sprite),1);
						this.sprites.splice(this.sprites.indexOf(this.sprites[i]),1);
						this.bannerText = "Hit! +" + value;
						this.bannerX = sprite.x - 50;
						this.bannerY = sprite.y - 20;
						this.bannerExpires = new Date().getTime() + 2000;
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
	targetCount: function() {
		let count = 0;
		for (var i = 0; i < this.sprites.length; i++) {
			if (this.sprites[i].type == 'ball') {
				count ++;
			}
		}
		return count;
	},
    go: function(){
        var loopIt = function() {
            //console.log("loopIt");
            requestAnimationFrame(loopIt, _this.canvas);
            _this.wipe();
            _this.show();
			if (_this.targetCount() < 1) {
				// Game Over!
				_this.context.font = '48px Arial';
				_this.context.fillStyle = 'black';
				_this.context.fillText("Game Over!", 200, 200);
			}
        }
        loopIt();
    }
}