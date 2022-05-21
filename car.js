import { CAR_IMAGES } from "./config/constants";
import Controls from "./controls";
import NeuralNetwork from "./network";
import Sensor from "./sensor";
import { clamp, getRandomCarImage, polysIntersect } from "./utils";

export default class Car {
  constructor(x, y, width, height, color, type, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 0;
    this.acceleration = 0.2;
    this.friction = 0.05;
    this.angle = 0;
    this.polygon = [];
    this.damaged = false;
    this.controls = new Controls(type);
    this.useBrain = type === "ai";
    this.image = new Image();
    this.image.src = getRandomCarImage();

    if (type !== "auto") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.maxSpeed = maxSpeed;
  }
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor?.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((s) =>
        s === null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }
  #assessDamage(roadBorders, traffic) {
    for (let border of roadBorders) {
      if (polysIntersect(this.polygon, border)) {
        return true;
      }
    }
    for (let t of traffic) {
      if (polysIntersect(this.polygon, t.polygon)) {
        return true;
      }
    }
    return false;
  }
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    this.speed = clamp(this.speed, -this.maxSpeed / 2, this.maxSpeed);

    if (this.controls.left) {
      const flip = this.speed >= 0 ? 1 : -1;
      this.angle += flip * 0.03;
    }
    if (this.controls.right) {
      const flip = this.speed >= 0 ? 1 : -1;
      this.angle -= flip * 0.03;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(
    /** @type {CanvasRenderingContext2D} */ ctx,
    /** @type {boolean} */ drawSensor
  ) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
    /* ctx.beginPath();
    if (!this.polygon.length) return;
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (drawSensor) {
      this.sensor?.draw(ctx);
    }
    */
  }
}
