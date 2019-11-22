	const EMPTY = 0
	const TAIL  = 1
	const HEAD  = 2
	const MOUSE = 3
	const WALL  = 4

	class Exel{
		constructor(x,y, size){
			this.element = document.createElement("div")
			this.element.className = "exel"
			this.x = x;
			this.y = y;
			this._state = EMPTY;
			this.turn = 0
			this.modX = 1
			this.modY = 0
			if(size){
				this.element.style.width = size + "px"
				this.element.style.height = size + "px"
			}
		}
		set state(state){			
			this._state = state;
			switch(state){
				case EMPTY: this.element.classList.remove("snake","mouse","head","wall"); break;
				case TAIL: this.element.classList.add("snake");break;
				case HEAD: this.element.classList.add("head","snake"); break;
				case MOUSE:this.element.classList.add("mouse"); break;
				case WALL: this.element.classList.add("wall");break;
			}	
		}

		get state(){
			return this._state
		}
	}

	class Snake{
		constructor(len,width,height){
			this.x = getRandomArbitrary(len,width - 1)
			this.y = getRandomArbitrary(0,height - 1)
			this.len = len;
			this.modX = 1;
			this.modY = 0;
			this.elements = []

			this.width = width
			this.height = height

			let ceils = 0
			while(len){
				len --;
				let x = this.x - ceils
				this.elements.push(Exel.matrix[this.y][x])
				this.elements[ceils].state = TAIL
				ceils ++
			}
			this.elements[0].state = HEAD
		}

		step(){
			for (var i = 0; i < this.elements.length; i++) {

				if(this.elements[i].turn === 1){
					if(this.elements[i].modX === 1 && this.elements[i].modY === 0){
						this.elements[i].modX = 0
						this.elements[i].modY = 1
					} else
					if(this.elements[i].modX === 0 && this.elements[i].modY === 1){
						this.elements[i].modX = -1
						this.elements[i].modY = 0

					} else
					if(this.elements[i].modX === -1 && this.elements[i].modY === 0){
						this.elements[i].modX = 0
						this.elements[i].modY = -1

					} else
					if(this.elements[i].modX === 0 && this.elements[i].modY === -1){
						this.elements[i].modX = 1
						this.elements[i].modY = 0

					}

				}
				if(this.elements[i].turn === -1){
					if(this.elements[i].modX === 1 && this.elements[i].modY === 0){
						this.elements[i].modX = 0
						this.elements[i].modY = -1
					} else
					if(this.elements[i].modX === 0 && this.elements[i].modY === -1){
						this.elements[i].modX = -1
						this.elements[i].modY = 0
					} else
					if(this.elements[i].modX === -1 && this.elements[i].modY === 0){
						this.elements[i].modX = 0
						this.elements[i].modY = 1
					} else
					if(this.elements[i].modX === 0 && this.elements[i].modY === 1){
						this.elements[i].modX = 1
						this.elements[i].modY = 0
					}

				}

				let modX = this.elements[i].modX;
				let modY = this.elements[i].modY;


				if(i === 0){
					this.x += this.elements[i].modX;
					if(this.x > this.width - 1) this.x = 0
					if(this.x < 0 ) this.x = this.width - 1
					this.y += this.elements[i].modY;
					if(this.y > this.height - 1) this.y = 0
					if(this.y < 0 ) this.y = this.height - 1
					this.colisionTest(this.x,this.y)
					//this.onStep(this.x,this.y)
				}

				let x = this.elements[i].x + modX
				if(x > this.width - 1) x = 0
				if(x < 0 ) x = this.width - 1

				let y = this.elements[i].y + modY
				if(y > this.height - 1) y = 0
				if(y < 0 ) y = this.height - 1

				this.elements[i].state = EMPTY
				if(i === this.elements.length -1) this.elements[i].turn = 0;
				this.elements[i] = Exel.matrix[y][x]
				this.elements[i].modX = modX;
				this.elements[i].modY = modY;
				this.elements[i].state = i === 0? HEAD: TAIL; 
			}
			this.onStep(this.x,this.y)
		}

		push(){
			let turn = this.elements[0].turn
			let modX = this.elements[0].modX
			let modY = this.elements[0].modY
			this.x += this.elements[0].modX;
			if(this.x > this.width - 1) this.x = 0
			if(this.x < 0 ) this.x = this.width - 1
			this.y += this.elements[0].modY;
			if(this.y > this.height - 1) this.y = 0
			if(this.y < 0 ) this.y = this.height - 1
			this.colisionTest(this.x,this.y)
			this.elements.unshift(Exel.matrix[this.y][this.x])
			this.elements[0].state = HEAD;
			this.elements[1].state = TAIL;
			this.elements[0].turn = turn;
			this.elements[0].modX = modX;
			this.elements[0].modY = modY;
			
			//this.onStep(this.x,this.y)
		}
		colisionTest(x,y){
			for (var i = 0; i < this.elements.length; i++) {
				if(this.elements[i].x === x && this.elements[i].y === y) this.onAutoCollesion();
			}
		}
	}


	Exel.createField = function createField(width,height,el){
		let exelWidth = (window.innerWidth - 25)/width
		let EXELSIZE;
		EXELSIZE =  exelWidth;
		if(window.innerWidth > 1000)
			EXELSIZE = 30;


		Exel.matrix = []
		el.innerHTML = ""
		el.style.width = width * EXELSIZE + "px";
		el.style.height = height * EXELSIZE + "px";
		let count = width * height
		for (var i = 0; i < count; i++) {
			let x = i % width
			let y = parseInt(i/width)
			let exel = new Exel(x,y,EXELSIZE)
			el.appendChild(exel.element)
			if(!Exel.matrix[y])Exel.matrix[y] = [];
			Exel.matrix[y][x] = exel;
		}
	}

	class Mouse {
		// Создание мыши в случайной точке, кроме списка запрещенных точек. 
		constructor(map,matrix){
			let x,y=0
			while(!map[y][x]){
				x = getRandomArbitrary(0,map[y].length - 1);
				y = getRandomArbitrary(0,map.length -1)
			}
			this.matrix = matrix
			this.matrix[y][x].state = MOUSE;
			this.x = x
			this.y = y
		}

		del(){
			this.matrix[this.y][this.x].state = EMPTY;
		}
	}


	class Game {
		constructor(width,height,interval,map){
			this.map    = map
			this.width  = width
			this.height = height
			this.interval = interval | 500
			this.isStart = false;
		}
		start() {
			Exel.createField(this.width,this.height,document.querySelector(".field"))
			this.snake = new Snake(3,this.width,this.height);
			
			this.snake.onAutoCollesion = this.restart.bind(this)
			this.snake.onStep = this.stepTest.bind(this)

			this.createMap();

			this.int = setInterval(()=>this.snake.step(),this.interval)
			
			document.addEventListener("keydown",(e)=>{
				if(e.keyCode === 37) this.snake.elements[0].turn = -1
				if(e.keyCode === 39) this.snake.elements[0].turn = 1
			})
			document.querySelector('.turnLeft').addEventListener("touchstart",()=> {this.snake.elements[0].turn = -1},false)
			document.querySelector('.turnRight').addEventListener("touchstart",()=> {this.snake.elements[0].turn = 1},false)

			this.isStart = true;
			document.querySelector('#msg').style.display = "none";
		}
		stop(){
			this.isStart = false
			clearInterval(this.int)
		}
		rePause(){
			this.isStart = true;
			this.int = setInterval(()=>this.snake.step(),this.interval)
		}
		restart(noAlert){
			this.stop();
			if(!noAlert) document.querySelector('#msg').style.display = "flex"
				alert("Your goal was be " + this.goal)
			setTimeout(()=>{this.goal = 0;this.start()},2000)
			
		}
		/**
		* Проверка шага по карте Решения - snake.push + this.updateMap / this.restart
		*/
		stepTest(x,y){
			if(this.reload === 1){
				if(!([]).concat(...Exel.matrix).map(el=>el.state).includes(MOUSE)){
					this.updateMap()
				}
			}
			if(this.reload) this.reload --
			if(x === this.mouse.x && y === this.mouse.y){
				this.snake.push()
				this.updateMap()
				this.reload = 2
				this.goal = this.goal +1
			}
			if(this.map && this.map[y][x]) this.restart()
		}

		set goal(goal){
			this._goal = goal;
			document.querySelector(".gameGoal").innerHTML = this.goal;
		}
		get goal(){
			return this._goal | 0;
		} 
		createMap(){
			//Exel.matrix
			if(this.map){
			for (var i = 0; i < this.map.length; i++) {
				for (var j = 0; j < this.map[i].length; j++) {
					if(this.map[i][j])
						Exel.matrix[i][j].state = WALL
				}
			}}
			this.updateMap()	
		}
		updateMap(){
			if(this.mouse) this.mouse.del()
			this.mouse = new Mouse(mapField(Exel.matrix),Exel.matrix)
		}
	}

	function getRandomArbitrary(min, max) {
  		return Math.round(Math.random() * (max - min) + min);
	}

	function mapField(field) {
		let out = [];
		for (var i = 0; i < field.length; i++) {
			out[i] = field[i].map(el=>el.state === EMPTY)
		}
		return out
	}
	function prepareMap(map, field) {
		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				//map[i][j] = !map[i][j]
				if(field[i][j]) map[i][j] = 1
			}
		}
		return map
	}
