import { CAR_IMAGES } from "./config/constants";

/**
 * It returns the value if it's between the min and max, otherwise it returns the min or max
 * @param value - The value to clamp.
 * @param min - The minimum value that the value can be.
 * @param max - The maximum value that the returned value can be.
 * @returns The value of the variable "value"
 */
export function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/**
 * "It returns a value that is a percentage of the way between two other values."
 *
 * The function takes three arguments:
 *
 * a: The first value.
 * b: The second value.
 * t: The percentage of the way between the two values.
 * The function returns a value that is a percentage of the way between a and b
 * @param a - The first value.
 * @param b - The target value
 * @param t - The current time (or position) of the tween. This can be seconds or frames, steps,
 * seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
 * @returns the value of a + (b - a) * t.
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * If the line segment from A to B intersects the line segment from C to D, return the point of
 * intersection and the offset along the line segment from A to B, otherwise return null.
 * @param A - The first point of the first line
 * @param B - The start point of the line segment
 * @param C - The start point of the line segment
 * @param D - The point on the line segment that is closest to the point
 * @returns The intersection point of two lines.
 */
export function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

/**
 * For each line segment in poly1, check if it intersects with any line segment in poly2. If it does,
 * return true. If it doesn't, return false.
 * @param poly1 - The first polygon
 * @param poly2 - [{x: 0, y: 0}, {x: 0, y: 100}, {x: 100, y: 100}, {x: 100, y: 0}]
 * @returns A boolean value.
 */
export function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

/**
 * If the value is positive, the color is red, if the value is negative, the color is blue, and the
 * alpha channel is the absolute value of the value.
 * @param value - The value to be converted to a color.
 * @returns A string of the form "rgba(R,G,B,alpha)" where R,G,B are the red, green, and blue
 * components of the color and alpha is the opacity.
 */
export function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

export function getRandomCarImage() {
  return CAR_IMAGES[Math.floor(Math.random() * CAR_IMAGES.length)];
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
