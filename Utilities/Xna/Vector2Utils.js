import { using } from '../ModClasses.js';

using('Microsoft.Xna.Framework');
using('Microsoft.Xna.Framework.Graphics');
using('Terraria');

export class vec2 {
	static instance = Vector2.new()['void .ctor(float x, float y)'];

	static Normalize = Vector2['Vector2 Normalize(Vector2 value)'];
	static Subtract = Vector2['Vector2 Subtract(Vector2 value1, Vector2 value2)'];
	static Multiply = Vector2['Vector2 Multiply(Vector2 value1, float scaleFactor)'];
	static Lerp = Vector2['Vector2 Lerp(Vector2 value1, Vector2 value2, float amount)'];
	static Distance = Vector2['float Distance(Vector2 value1, Vector2 value2)'];
	static getOrigin = (x, y) => vec2.instance(x / 2, y / 2);
}