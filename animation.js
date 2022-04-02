var Sprite = {
    x: 0,
    y: 0,
    xVel: 5,
    yVel: 5,
    weight: .02,
    shape: 'circle',
    radius: 15,
    color: 'green',
    begin: function(x,y,xVel,yVel) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
    },
    move: function(frame) {
        // Decceleration
        this.yVel -= this.weight * 9.8;

        // Apply velocity
        this.x += this.xVel;
        this.y += this.yVel;

        if (this.x > frame.width || this.x < 0) {
            this.xVel = 0 - this.xVel;
            this.x += this.xVel;
        }

        if (this.y < 0) {
            this.yVel = 0 - this.yVel;
            this.y += this.yVel;
        }
    }
}

var Frame = {
    width: 0,
    height: 0,
    sprites: new Array(),
    canvas: '',
    context: '',
    _this: '',
    init: function(canv) {
        _this = this;
        console.log(canv);
        this.width = parseInt(canv.width);
        this.height = parseInt(canv.height);

        this.canvas = canv;
        this.context = this.canvas.getContext("2d");
    },
    addSprite(sprite) {
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
    renderSprite: function(sprite) {
        sprite.move(this);
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
    },
    go: function(){
        var loopIt = function() {
            console.log("loopIt");
            requestAnimationFrame(loopIt, _this.canvas);
            _this.wipe();
            _this.show();
        }
        loopIt();
    }
}