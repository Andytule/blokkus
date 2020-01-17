// Random Integer (min inclusive, max exclusive)
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// Rounds to nearest hundred
export function toHundred(num) {
	return Math.round(num/100)*100;
}

// Converts from degrees to radians
export function toRadians(degrees) {
	return degrees * Math.PI / 180;
}

// Converts from radians to degrees
export function toDegrees(radians) {
	return radians * 180 / Math.PI;
}