import Car from "./car";
import NeuralNetwork from "./network";
import Road from "./road";

import "./style.css";
import { getRandomNumber } from "./utils";
import Visualizer from "./visualizer";

const N = 1;
document.getElementById("save").addEventListener("click", save);
document.getElementById("discard").addEventListener("click", discard);
/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
//const car = new Car(road.getLaneCenter(1), canvas.height / 2, 30, 50, 'black', 'manual');
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  const savedBbrain = JSON.parse(localStorage.getItem("bestBrain"));
  for (let i = 0; i < cars.length; i++) {
    cars[0].brain = savedBbrain;
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(0), 0, 30, 50, "red", "auto", 2),
  new Car(road.getLaneCenter(0), -100, 30, 50, "red", "auto", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "red", "auto", 2),
  new Car(road.getLaneCenter(2), -1500, 30, 50, "red", "auto", 2),
];

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    const car = new Car(road.getLaneCenter(1), 100, 30, 50, "black", "ai");
    cars.push(car);
  }
  return cars;
}
function draw() {
  carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
  networkCanvas.height = window.innerHeight;

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let car of cars) {
    car.update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));
  const newTraffic = [];
  for (let i = traffic.length - 1; i >= 0; i--) {
    const d = traffic[i].y - bestCar.y;

    if (d > 500) {
      const originalX = traffic[i].x;
      traffic.splice(i, 1);
      const newLane = getRandomNumber(0, road.borders.length - 1);
      console.log(newLane, 0, road.borders.length);
      const newCar = new Car(
        road.getLaneCenter(newLane),
        bestCar.y - carCanvas.height / 2,
        30,
        50,
        "red",
        "auto",
        2
      );
      newTraffic.push(newCar);
    }
  }

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height / 2);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let car of cars) {
    car.draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);
  carCtx.restore();
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  traffic.push(...newTraffic);
  requestAnimationFrame(draw);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
  localStorage.removeItem("bestBrain");
}
draw();
