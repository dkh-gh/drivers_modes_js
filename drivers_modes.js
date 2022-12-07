
class Driver {


	constructor(pose, max_speed, lines, way_jump, size, acceleration) {
		this.size = size;
		this.max_speed = max_speed;
		this.speed = 0;
		this.acceleration = acceleration;
		this.pose = pose;
		this.sensors = [false, false, false];
		this.sensors_dist = [5];
		this.minimal_driver_x = 0;
		this.lines = lines;
		this.way_jump = way_jump;
		this.my_line = 1;
		this.my_last_line = 1;
		this.in_line = true;

		this.object = document.createElement('div');
		this.object.setAttribute('class', 'driver');
		this.object.setAttribute('style', `
			width: `+this.size[0]+`px;
			height: `+this.size[1]+`px;
			background: #999;
			position: fixed;
			left: 0px; top: 0px;
			font-size: 13px;
		`);
		let _this = this;
		this.object.addEventListener('mouseover', function() {_this.speed = -1; });
		document.body.appendChild(this.object);

		this.update();
	}


	update() {

		// acceleration
		if(this.speed < this.max_speed && !this.sensors[0])
			this.speed += this.acceleration[0];
		// breaking
		else if(this.sensors[0] && this.speed > 0) {
			this.speed -= this.acceleration[1];
			this.jump();
		}
		if(this.speed < 0)
			this.speed = 0;
		else if(this.speed > this.max_speed)
			this.speed = this.max_speed;
		this.object.innerHTML = parseInt(this.speed) + '/' + parseInt(this.max_speed) + ', ' + this.way_jump;

		if(!this.in_line) {
			// if(this.sensors[1] || this.sensors[2])
				// this.my_line = this.my_last_line;
			if(this.pose[1] > this.lines[this.my_line])
				this.pose[1]--;
			else if(this.pose[1] < this.lines[this.my_line])
				this.pose[1]++;
			else
				this.in_line = true;
		}
		
		this.pose[0] += this.speed;
		if(this.pose[0] > document.body.clientWidth)
			this.pose[0] = 0;
			// this.pose[0] = this.minimal_driver_x - this.size[0] * 2;

		this.object.style.left = this.pose[0] - this.size[0]/2 + 'px';
		this.object.style.top = this.pose[1] - this.size[1]/2 + 'px';
	}


	jump() {
		let will_jump = parseInt(Math.random()*way_jump)+1 == way_jump;
		if(will_jump && this.in_line) {
			this.in_line = false;
			this.my_last_line = this.my_line;
			let tmp_way = parseInt(Math.random()*2)*2-1;
			if(tmp_way > 0 && !this.sensors[1]) this.my_line += 1;
			else if(tmp_way < 0 && !this.sensors[2]) this.my_line -= 1;

			if(this.my_line < 1)
				this.my_line = 1;
			if(this.my_line > Object.keys(this.lines).length)
				this.my_line = Object.keys(this.lines).length;
		}

	}


	update_sensors(drivers, num) {
		let forwarf_sensor = false;	
		let leftboard_sensor = false;
		let rightboard_sensor = false;	
		this.minimal_driver_x = 0;
		for(let i = 0; i < drivers.length; i++) {
			if(i != num) {
				if(this.minimal_driver_x > drivers[i].pose[0])
					this.minimal_driver_x = drivers[i].pose[0]
				if(  true
					&& this.pose[1]+this.size[1]/2 > drivers[i].pose[1]-drivers[i].size[1]/2
					&& this.pose[1]-this.size[1]/2 < drivers[i].pose[1]+drivers[i].size[1]/2
					&& this.pose[0]+this.size[0]/2+this.speed*this.sensors_dist[0]/this.acceleration[1] > drivers[i].pose[0]-drivers[i].size[0]/2
					&& this.pose[0]-this.size[0]/2 < drivers[i].pose[0]-drivers[i].size[0]/2
				) forwarf_sensor = true;
				if(  true
					&& this.pose[1]+this.size[1]/2-this.size[1] > drivers[i].pose[1]-drivers[i].size[1]/2
					&& this.pose[1]-this.size[1]/2-this.size[1] < drivers[i].pose[1]+drivers[i].size[1]/2
					&& this.pose[0]+this.size[0] > drivers[i].pose[0]-drivers[i].size[0]/2
					&& this.pose[0]-this.size[0] < drivers[i].pose[0]+drivers[i].size[0]/2
				) leftboard_sensor = true;
				if(  true
					&& this.pose[1]+this.size[1]/2+this.size[1] > drivers[i].pose[1]-drivers[i].size[1]/2
					&& this.pose[1]-this.size[1]/2+this.size[1] < drivers[i].pose[1]+drivers[i].size[1]/2
					&& this.pose[0]+this.size[0] > drivers[i].pose[0]-drivers[i].size[0]/2
					&& this.pose[0]-this.size[0] < drivers[i].pose[0]+drivers[i].size[0]/2
				) rightboard_sensor = true;
			}
		}
		// console.log(num+' > '+forwarf_sensor)
		this.sensors = [forwarf_sensor, leftboard_sensor, rightboard_sensor];
		// let rgb = ['c','c','c'];
		let bxshd = ['0 0 0 #000', '0 0 0 #000', '0 0 0 #000'];
		if(this.sensors[0])
			bxshd[0] = '-5px 0 5px -1px #f00f';
			// rgb[0] = 'f'
		if(this.sensors[1])
			bxshd[1] = '0 -10px 5px -5px #f005';
			// rgb[1] = 'f'
		if(this.sensors[2])
			bxshd[2] = '0 10px 5px -5px #f005';
			// rgb[2] = 'f'
		// this.object.style.background = '#'+rgb[0]+rgb[1]+rgb[2];
		this.object.style.boxShadow = bxshd[0] + ', ' +bxshd[1] + ', ' +bxshd[2];
	}

	
}
