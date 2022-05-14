import Car from './car'
import './style.css'

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');

const car = new Car(100, 100, 30, 50, 'red');

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update();
  car.draw(ctx);
  requestAnimationFrame(draw);
}
draw();