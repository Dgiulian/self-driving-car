import Car from './car'
import Road from './road';
import './style.css'

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), canvas.height / 2, 30, 50, 'black');


function draw() {
  car.update();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(0, -car.y + canvas.height / 2);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();
  requestAnimationFrame(draw);
}
draw();