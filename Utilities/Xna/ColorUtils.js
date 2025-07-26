import { using } from './ModClasses.js';

using('Microsoft.Xna.Framework');
using('Microsoft.Xna.Framework.Graphics');
using('Terraria');

export class color {
	static instance = (r, g, b, a) => {
		let c = Color.new()
		c.R = r
		c.G = g
		c.B = b
		c.A = a
		return c
	};
	
	/*
  HEX: RRGGBB
  BINARY: RRRRRRRR GGGGGGGG BBBBBBBB
  n >> 16       = RRRRRRRR           = (R)
  n >> 8        = RRRRRRRR GGGGGGGG  = intermediary value.
  value & 255   = GGGGGGGG           = (G)
  n & 255       = BBBBBBBB           = (B)
*/
	static hexToRgb = h => (n = parseInt(h.replace('#',''), 16)) => color.instance(n >> 16,(n >> 8) & 255,n & 255);
}