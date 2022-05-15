import Car from './car'
import Road from './road';

import './style.css'
import Visualizer from './visualizer';

/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 200;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
//const car = new Car(road.getLaneCenter(1), canvas.height / 2, 30, 50, 'black', 'manual');
const car = new Car(road.getLaneCenter(1), carCanvas.height / 2, 30, 50, 'black', 'ai');
const traffic = [
  new Car(road.getLaneCenter(1), 200, 30, 50, 'red', 'auto', 2),
]
function draw() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);
  carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height / 2);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  car.draw(carCtx);
  carCtx.restore();
  Visualizer.drawNetwork(networkCtx, car.brain)
  requestAnimationFrame(draw);
}
draw();