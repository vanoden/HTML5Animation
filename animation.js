/**
 * Base Model For Sprite Objects
 */
var Sprite = {
    x: 0,					// X Coordinate
    y: 0,					// Y Coordinate
    xVel: 5,				// X Velocity
    yVel: 5,				// Y Velocity
    density: .001,			// Weight (applies for gravity)
    shape: 'circle',		// Shape of the sprite
	type: 'ball',			// Type of sprite
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
        this.yVel -= this.density * this.radius * 9.8;

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
		// Let items go a little higher than the top of the frame
		else if (this.y > frame.height*1.5) {
			if (this.restrain) {
	            this.yVel = 0 - this.yVel;
	            this.y -= frame.height *1.5;
			}
			else {
				// Drop the sprite
				console.log(this.color + " " + this.type + " lost at (" + this.x + "," + this.y + ")");
				this.lost = true;
			}
		}
    },
	draw: function(frame) {
		frame.context.beginPath();
		if (this.shape == 'circle') {
			frame.context.arc(this.x,frame.height - this.y,this.radius,0,2*Math.PI,false);
			frame.context.fillStyle = this.color;
			frame.context.fill();
		}
		else {
			frame.context.moveTo(this.x,frame.height - this.y);
			frame.context.lineTo(this.x+1,frame.height - this.y+1);
			frame.context.stroke();
		}
	}
}

/**
 * Cannon Object - represents the User's cannon/spaceship/vehicle
 */
var Cannon = {
	x: 0,					// X Coordinate
	y: 0,					// Y Coordinate
	xForce: 0,				// X Force
	yForce: 0,				// Y Force
	xFriction: 0.1,			// X Friction
	xVel: 0,				// X Velocity
	yVel: 0,				// Y Velocity
	maxAbsXVel: 10,			// Maximum X Velocity
	angle: 90,				// Angle of the cannon
	power: 5,				// Power of the cannon - starting velocity of projectiles
	length: 40,				// Length of the cannon
	mobileX: true,			// Cannon can move horizontally
	mobileY: false,			// Cannon can move vertically
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
	move: function(frame) {
		// Move the cannon
		if (this.mobileX) {
			this.xVel += this.xForce;
			if (this.xVel > 0) this.xVel -= this.xFriction;
			if (this.xVel < 0) this.xVel += this.xFriction;
			if (this.xVel > this.maxAbsXVel) this.xVel = this.maxAbsXVel;
			if (this.xVel < -1*this.maxAbsXVel) this.xVel = -1*this.maxAbsXVel;
			this.x += this.xVel;
			if (this.x > frame.width) {
				this.x = frame.width;
				this.xVel = 0;
			}
			if (this.x < 0) {
				this.x = 0;
				this.xVel = 0;
			}
			//if (this.xVel > 0 && this.xVel < 10) this.xVel += .3;
			//else if (this.xVel < 0 && this.xVel > -10) this.xVel -= .3;
		}
		if (this.mobileY) {
			this.y += this.yVel;
		}
	},
	draw: function(frame) {
		frame.context.strokeStyle = this.color;
		frame.context.lineWidth = 5;
		frame.context.beginPath();
		frame.context.moveTo(this.x,frame.height - this.y);
		frame.context.lineTo(this.nozzleX(),frame.height - this.nozzleY());
		frame.context.stroke();
	}
}
var Bullet = { ...Sprite };

var Button = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	color: 'black',
	text: '',
	font: '18px Arial',
	active: false,
	action: '',
	begin: function(x,y,width,height,color,text,action) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.text = text;
		this.action = action;
	},
	/**
	 * Draw the button
	 */
	draw: function(frame) {
		if (!this.active) {
			return;
		}
		frame.context.textAlign = 'center';
		frame.context.textBaseline = 'middle';
		frame.context.fillStyle = this.color;
		frame.context.fillRect(this.x,this.y,this.width,this.height);
		frame.context.strokeStyle = 'black';
		frame.context.lineWidth = 2;
		frame.context.fillStyle = this.color;
		frame.context.strokeRect(this.x,this.y,this.width,this.height);
		frame.context.stroke();
		frame.context.font = this.font;
		frame.context.fillStyle = 'black';
		frame.context.fillText(this.text,this.x + this.width/2,this.y + this.height/2);
	},
	/**
	 * Check if the button was clicked
	 * @param x X Coordinate of the click
	 * @param y Y Coordinate of the click
	 * @returns True if the button was clicked
	 */
	clicked: function(x,y) {
		let left = this.x;
		let right = this.x + this.width;
		let top = this.y;
		let bottom = this.y + this.height;
		console.log("Checking if button was clicked at (" + x + " > " + left + " && " + x + " < " + right + " && " + y + " > " + top + " && " + y + " < " + bottom + ")");
		if (x >= left && x <= right && y >= top && y <= bottom) {
			return true;
		}
		return false;
	}
}

var ScoreBoard = {
	x: 0,
	y: 0,
	width: 350,
	height: 60,
	border: 'black',
	font: '18px Arial',
	buttons: new Array(),
	contents: new Array(),
	addButton: function(button) {
		button.x = this.x + button.x;
		button.y = this.y + button.y;
		this.buttons.push(button);
	},
	draw: function(frame) {
		frame.context.strokeStyle = this.border;
		frame.context.lineWidth = 1;
		frame.context.strokeRect(this.x,this.y,this.width,this.height);
		frame.context.stroke();

		// Draw Scoreboard Boundary
		frame.context.strokeStyle = 'black';
		frame.context.lineWidth = 1;
		frame.context.strokeRect(this.x,this.y,this.x+this.width,this.y+this.height);
		frame.context.stroke();
		// Draw Scoreboard Text
		frame.context.textAlign = 'center';
		frame.context.textBaseline = 'top';
		frame.context.font = this.font;
		frame.context.fillStyle = 'black';
		frame.context.fillText("Score", this.x + 35, this.y + 10);
		frame.context.fillText(frame.score.toString(), this.x + 35, this.y + 35);
		frame.context.fillText("Bullets", this.x + 95, this.y + 10);
		frame.context.fillText(frame.bulletCount.toString(), this.x + 95, this.y + 35);
		frame.context.fillText("Targets", this.x + 155, this.y + 10);
		frame.context.fillText(frame.targetCount().toString(), this.x + 155, this.y + 35);

		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].draw(frame);
		}
	}
}

var Frame = {
    width: 0,
    height: 0,
    sprites: new Array(),
	buttons: new Array(),
    canvas: '',
    context: '',
    _this: '',
	cannon: Cannon,
	scoreboard: ScoreBoard,
	bannerText: '',
	bannerExpires: 0,
	bannerX: 0,
	bannerY: 0,
	bulletCount: 100,
	scoreboardFont: '18px Arial',
	scoreboardHeight: 60,
	scoreboardWidth: 250,
	score: 0,						// Points acquired
	active: false,					// Frame is active - sprites are loaded
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
	addTargets(count) {
		// Add Balls to Game Frame
		for (var i = 0; i < count; i++) {
	        let ball = Object.create(Sprite);
			let radius = 12 + Math.random()*20;
        	ball.begin((Math.random()*(frame.width - radius)),radius,1+i,15);
        	ball.color = colors[parseInt(Math.random()*6)];
			ball.weight = 0.02;
			ball.radius = radius;
            this.addSprite(ball);
		}
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
	 * Add a button to the frame
	 * @param button Button to add
	 */
	addButton(button) {
		this.buttons.push(button);
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
		this.scoreboard.draw(this);
	},
	/**
	 * Draw the Cannon
	 */
	renderCannon: function(cannon) {
		cannon.draw(this);
	},
	/**
	 * Draw active buttons
	 */
	renderButtons: function() {
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].active) {
				this.buttons[i].draw(this);
			}
		}
	},
	/**
	 * Render all sprites
	 */
	renderSprites: function() {
		for (var i = 0; i < this.sprites.length; i++) {
			this.sprites[i].draw(this);
		}
	},
	/**
	 * Draw the specified sprite
	 */
    renderSprite: function(sprite) {
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
					(sprite.y - sprite.radius < top)
				)
				{
					//console.log("Sprite " + sprite.color + " collided with sprite " + this.sprites[i].color + " at (" + sprite.x + "," + sprite.y + ") vs (" + this.sprites[i].x + "," + this.sprites[i].y + ")");
					//console.log(sprite.x + " >= " + left);
					//console.log(sprite.x + " < " + right);
					//console.log(sprite.y + " >= " + bottom);
					//console.log(sprite.y + " < " + top);
					if (sprite.type == 'bullet' && this.sprites[i].type == 'bullet') {
						// Bullets don't collide with each other
						continue;
					}
					else if (sprite.type == 'bullet' || this.sprites[i].type == 'bullet') {
						let value = 0;
						if (sprite.type == 'bullet') {
							value = parseInt(100/this.sprites[i].radius);
						}
						else {
							value = parseInt(100/sprite.radius);
						}
						this.score += value;

						if (sprite.type == 'bullet') {
							// Bullet is destroyed
							this.sprites.splice(this.sprites.indexOf(sprite),1);
							// Target is reduced
							this.sprites[i].radius -= 5;
							if (this.sprites[i].radius < 10) {
								// Target is destroyed
								this.sprites.splice(this.sprites.indexOf(this.sprites[i]),1);
							}
							else {
								this.sprites[i],yVel += 5;
							}
						}
						else if (this.sprites[i].type == 'bullet') {
							// Bullet is destroyed
							this.sprites.splice(this.sprites.indexOf(this.sprites[i]),1);
							// Target is reduced
							sprite.radius -= 5;
							if (sprite.radius < 10) {
								// Target is destroyed
								this.sprites.splice(this.sprites.indexOf(sprite),1);
							}
							else {
								sprite.yVel += 5;
							}
						}
						this.bannerText = "Hit! +" + value;
						this.bannerX = sprite.x - 50;
						this.bannerY = sprite.y - 20;
						this.bannerExpires = new Date().getTime() + 2000;
					}
					else {
						let xDiff = sprite.x - this.sprites[i].x;
						let yDiff = sprite.y - this.sprites[i].y;
						// Are Balls Approaching Each Other?
						if (xDiff > 0 && yDiff > 0) {
							// Bounce the sprites off each other

							// If allowed, transfer energy with respect to difference of mass
							let weightRatio = sprite.radius / this.sprites[i].radius;
							// Otherwise, ignore physics to make the game more fun
							//weightRatio = 1;

							let xTemp = sprite.xVel;
							sprite.xVel = this.sprites[i].xVel / weightRatio;
							this.sprites[i].xVel = xTemp * weightRatio;
							let yTemp = sprite.yVel;
							sprite.yVel = this.sprites[i].yVel / weightRatio;
							this.sprites[i].yVel = yTemp * weightRatio;
							
							sprite.x += sprite.xVel;
							sprite.y += sprite.yVel;
							this.sprites[i].x += this.sprites[i].xVel;
							this.sprites[i].y += this.sprites[i].yVel;
						}
					}
				}
			}
		}
        sprite.draw(this);
    },
    show: function() {
		//this.renderSprites();
        for (var i = 0; i < this.sprites.length; i ++) {
			this.sprites[i].move(this);
            this.renderSprite(this.sprites[i]);
        }
		this.cannon.move(this);
		this.cannon.draw(this);
		//this.renderCannon(this.cannon);
		this.renderButtons();
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
		this.active = true;
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
    },
	restartGame: function() {
		console.log("Restarting Game");
		this.sprites = new Array();
		this.cannon = Cannon;
		this.bannerText = '';
		this.bannerExpires = 0;
		this.bannerX = 0;
		this.bannerY = 0;
		this.bulletCount = 100;
		this.score = 0;
		this.addTargets(10);
	}
}