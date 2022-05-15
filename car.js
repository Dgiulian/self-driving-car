
import Controls from "./controls";
import Sensor from "./sensor";
import { clamp } from "./utils";

const MAX_SPEED = 3;

export default class Car {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 0;
    this.acceleration = 0.2;
    this.friction = 0.05;
    this.angle = 0;

    this.controls = new Controls();
    this.sensor = new Sensor(this);

  }
  update(roadBorders) {
    this.#move()
    this.sensor.update(roadBorders);
  }
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }


    this.speed = clamp(this.speed, -MAX_SPEED / 2, MAX_SPEED);
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (this.controls.left) {
      const flip = this.speed > 0 ? 1 : -1;
      this.angle += flip * 0.03;
    }
    if (this.controls.right) {
      const flip = this.speed > 0 ? 1 : -1;
      this.angle -= flip * 0.03;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;


  }
  draw(/** @type {CanvasRenderingContext2D} */ ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(-this.angle)
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill()
    ctx.restore()
    this.sensor.draw(ctx);
  }
}

