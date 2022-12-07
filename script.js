
document.addEventListener('DOMContentLoaded', init);
var drivers = [];

var ctx, chart;
var speed_mid_data = [];
var speed_mid_labels = [];
function init() {
	for(let i = 0; i < 15; i++) {
		let car_size = parseInt(Math.random()*4+1);
		drivers.push(new Driver(
			pose = 			[i*60+100, 220], 
			max_speed = (Math.random()*3+10)/car_size,
			lines = 		{5:100, 4:130, 3:160, 2:190, 1:220},
			way_jump = 	parseInt(Math.random()*10*car_size),
			size =			[car_size*25+5, car_size+16],
			acceleration = [(5-car_size)/40, (5-car_size)/10],
		));
		// console.log(size)
		let rnd_line = parseInt(Math.random()*Object.keys(drivers[drivers.length-1].lines).length)+1;
		drivers[drivers.length-1].pose[1] = 
			drivers[drivers.length-1].lines[rnd_line];
		drivers[drivers.length-1].my_line = rnd_line;
		drivers[drivers.length-1].my_last_line = rnd_line;
		// drivers[drivers.length-1].pose[1] = 
		// 	drivers[drivers.length-1].lines[rnd_line];
	}
	ctx = document.getElementById('myChart');
	chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: speed_mid_labels,
      datasets: [{
        label: 'средняя скорость потока',
        data: speed_mid_data,
        borderWidth: 3
      }]
    },
    options: {
    	animation: false,
    	pointStyle: 'line',
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
	anim();
}

function anim() {

	let mid_speed = 0;
	for(let i = 0; i < drivers.length; i++) {
		drivers[i].update_sensors(drivers, i);
		drivers[i].update();
		mid_speed += drivers[i].speed;
	}
	mid_speed /= drivers.length;
	speed_mid_data.push(mid_speed);
	speed_mid_labels.push('*');
	if(speed_mid_data.length > 200) {
		speed_mid_data.splice(0, 1);
		speed_mid_labels.splice(0, 1);
	}
	// document.querySelector('.info').innerHTML = 'средняя скорость потока<br>' + mid_speed;
	chart.data.labels = speed_mid_labels;
	chart.data.datasets[0].data = speed_mid_data;
	// chart.data.datasets[0].data.push(mid_speed)
	chart.update();


	window.requestAnimationFrame(anim);
	// window.setTimeout(anim, 100);
}
