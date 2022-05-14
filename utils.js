/**
 * It returns the value if it's between the min and max, otherwise it returns the min or max
 * @param value - The value to clamp.
 * @param min - The minimum value that the value can be.
 * @param max - The maximum value that the returned value can be.
 * @returns The value of the variable "value"
 */
export function clamp(value, min, max) {
  if(value < min){
    return min;
  }
  if(value > max) {
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