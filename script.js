const KEYS = {
	LEFT: 37,
	RIGHT: 39,
	SPACE: 32
}


let game = {

	ctx: null,
	active: true,
	ball: null,
	platform: null,
	rows: 4,
	cols: 8,
	width: 640,
	height: 360,
	blocks: [],
	collidedBlocks: 0,
	sprites: {
		background: null,
		ball: null,
		platform: null,
		block: null
	},




	init() {
		this.ctx = document.getElementById("canvas").getContext("2d");
		this.setEvents();
	},

	setEvents() {
		window.addEventListener("keydown", e => {
			if (e.keyCode === KEYS.SPACE) {
				this.platform.fire();
			} else if (e.keyCode === KEYS.RIGHT || e.keyCode === KEYS.LEFT) {
					this.platform.start(e.keyCode);
				}
			
		})
		window.addEventListener("keyup", () => {
			this.platform.stop();
		})
	},

	preload(callback) {
		const onImageLoad = () => {
				++loaded;
				if (loaded >= required) {
					callback();
				}
			}

		let loaded = 0;
		let required = Object.keys(this.sprites).length;
		for (let key in this.sprites) {
			this.sprites[key] = new Image();
			this.sprites[key].src = "img/" + key + ".png";
			this.sprites[key].addEventListener("load", onImageLoad)
		}
	},

	update() {
		this.collideBlocks();
		this.collidePlatform();
		this.ball.collideWorldBounds();
		this.platform.collideWorldBounds();
		this.platform.move();
		this.ball.move();
	},
	collideBlocks() {
		for (let block of this.blocks) {
			if (this.ball.collide(block) && block.active) {
				this.ball.bumbBlock(block);

			};
		}
	},
	testBlocks() {
		if (this.collidedBlocks === this.blocks.length) {
			this.end("Вы выиграли :)")
		}
	},
	end(message) {
		this.active = false;
		this.renderMessage(message);
		setTimeout(() => window.location.reload(), 2000);
	},
	addScore() {
		this.collidedBlocks++;
		this.checkVelocity();
	},
	checkVelocity() {
		if (this.collidedBlocks >= Math.floor(this.blocks.length / 4) && this.collidedBlocks < Math.floor(this.blocks.length / 4 + 1)) {
			console.log('+speed')
			this.ball.velocity++;
		}	else if (this.collidedBlocks >= Math.floor(this.blocks.length / 3) && this.collidedBlocks < Math.floor(this.blocks.length / 3 + 1)) {
			this.ball.velocity++;
			console.log('+speed')
		}	else if (this.collidedBlocks >= Math.floor(this.blocks.length / 2) && this.collidedBlocks < Math.floor(this.blocks.length / 2 + 1)) {
			this.ball.velocity++;
			console.log('+speed')
		}	else if (this.collidedBlocks >= Math.floor(this.blocks.length - Math.floor(this.blocks.length / 4)) && this.collidedBlocks < Math.floor(this.blocks.length - Math.floor(this.blocks.length / 4) + 1)) {
			this.ball.velocity++;
			console.log('+speed')
		}	else if (this.collidedBlocks >= Math.floor(this.blocks.length - Math.floor(this.blocks.length / 3)) && this.collidedBlocks < Math.floor(this.blocks.length - Math.floor(this.blocks.length / 3) + 1)) {
			this.ball.velocity++;
			console.log('+speed')
		}
	},
	collidePlatform() {
		if (this.ball.collide(this.platform)) {
			this.ball.platform(this.platform);
		}
	},
	run() {
		if (this.active) {
  		window.requestAnimationFrame(() => {
  			this.update();
  			this.render();
  			this.run();
		});
  	}
	},


	create() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.blocks.push({
					width: 60,
					height: 20,
					x: 64*col + 65,
					y: 24*row + 35,
					active: true
				})
			}
		}
	},

	render() {
			this.ctx.clearRect(0, 0, this.width, this.height)
			this.ctx.drawImage(this.sprites.background, 0, 0);
			this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y, 20, 20);
			this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y, this.platform.width, this.platform.height);

			this.renderBlocks();

	},
	renderMessage(message) {
		window.requestAnimationFrame(() => {
			this.ctx.fillStyle = "white";
		this.ctx.font = "50px Tahoma";
		this.ctx.fillText(message, this.width / 2 - 120, this.height / 2)
		})
	},
	renderBlocks() {
			for (let block of this.blocks) {
				if (block.active) {
					this.ctx.drawImage(this.sprites.block, block.x, block.y, 60, 20);
				}
			}
	},
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	},
	start() {
		console.log("start");
		this.init();
		this.preload(() => {
			this.create();
			this.run();



		})
	
	}
};

game.ball = {
	x: 320,
	y: 280,
	velocity: 4,
	dy: 0,
	dx: 0,
	width: 20,
	height: 20,
	start() {
		this.dy = this.velocity;
		this.dx = game.random(-this.velocity, this.velocity);
		this.move();
	},
	move() {
		if (this.dy) {
			this.y -= this.dy;
		}
		if (this.dx) {
			this.x -= this.dx;
		}
	},
	bumbBlock(block) {
		this.dy = -this.dy;
		block.active = false;
		game.addScore();
		game.testBlocks();
	},
	collideWorldBounds() {
		let x = this.x - this.dx;
		let y = this.y - this.dy;

		let ballLeft = x;
		let ballRight = x + this.width;
		let ballTop = y;
		let ballBottom = y + this.height;

		let worldLeft = 0;
		let worldRight = game.width;
		let worldTop = 0;
		let worldBottom = game.height;

		if (ballLeft < worldLeft) {
			this.x = 0;
			this.dx = -this.dx;
		}	else if (ballRight > worldRight) {
			this.x = worldRight - this.width;
			this.dx = -this.dx;
		}	else if (ballTop < worldTop) {
			this.y = 0;
			this.dy = -this.dy;
		}	else if (ballBottom > worldBottom) {
			game.end("Вы проиграли :(");
		}


	},
	collide(element) {
		let x = this.x - this.dx;
		let y = this.y - this.dy;

		if (x + this.width > element.x &&
		x < element.x + element.width &&
		y < element.y + element.height &&
		y + this.height > element.y) {
			return true;
		} 
		return false;
	},
	platform(element) {
			if (this.dy < 0) {
				this.dy = this.velocity;
			let touchX = this.x + this.width / 2;
			this.dx = -1 * this.velocity * element.getTouchOffset(touchX);
			}
	}
};

game.platform = {
	x: 280,
	y: 300,
	velocity: 6,
	dx: 0,
	ball: game.ball,
	width: 100,
	height: 20,
	fire() {
		if (this.ball) {
			this.ball.start();
			this.ball = null;
		}
	},
	start(direction) {
		if (direction === KEYS.LEFT) {
			this.dx = -this.velocity;
		} else if (direction === KEYS.RIGHT) {
			this.dx = this.velocity;
		}

	},
	stop() {
		this.dx = 0;
	},
	move() {
		if (this.dx) {
  			this.x += this.dx;
  			if (this.ball && this.x >= 0 && this.x <= game.width - this.width) {
  				this.ball.x += this.dx;
  			}
  		}
	},
	getTouchOffset(x) {
		const diff = (this.x + this.width) - x;
		const offset = this.width - diff;
		const result = 2 * offset / this.width;
		return result - 1;
	},
	collideWorldBounds() {
		if (this.x + this.dx < 0 || this.x + this.width + this.dx > game.width) {
			this.dx = 0;
		}
	}
};


window.addEventListener("load", () => {
	game.start();
})