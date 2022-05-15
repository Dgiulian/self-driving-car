import { getIntersection, lerp } from "./utils";

export default class Sensor {
  constructor(/** @type {Car} */ car) {
    /** type {Car } */
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 150;
    this.raySpread = Math.PI / 4;
    this.rays = [];
    this.readings = [];
  }
  update(roadBorders) {
    this.#castRays();
    this.readings = [];
    for (let ray of this.rays) {
      this.readings.push(this.#getReading(ray, roadBorders));
    }
  }
  #getReading(ray, roadBorders) {
    let touches = [];
    for (let border of roadBorders) {
      const intersection = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (intersection) {
        touches.push(intersection);
      }
    }
    if (touches.length === 0) {
      return null
    }
    else {
      const offsets = touches.map(touch => touch.offset);
      const minOffset = Math.min(...offsets);
      return touches.find(touch => touch.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
      ) + this.car.angle;
      const start = {
        x: this.car.x,
        y: this.car.y
      }

      const x = this.car.x - this.rayLength * Math.sin(rayAngle);
      const y = this.car.y - this.rayLength * Math.cos(rayAngle);
      const end = {
        x, y
      }
      this.rays.push([start, end]);
    }
  }
  draw(/** @type { CanvasRenderingContext2D} */ ctx) {
    let i = 0;
    //for (let ray of this.rays) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let end = ray[1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke()

      /* Draw end of ray */
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke()
    }
  }
}