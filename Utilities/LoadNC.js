import {vec2} from './Xna/Vector2Utils.js'
import {rec} from './Xna/RectangleUtils.js'
import {color} from './Xna/ColorUtils.js'
import ButtonUtils from './ButtonUtils.js'

const namespaces = {};

function RegisterNC(name, ns, cls) {
  namespaces[ns] ??= [];
  namespaces[ns].push({ name, cls });
}

export default function LoadNC(ns) {
  if (!namespaces[ns]) return tl.log(`Namespace "${ns}" not found.`);
  namespaces[ns].forEach(({ name, cls }) => globalThis[name] = cls);
}

RegisterNC('UVector2', 'Utilities', vec2)
RegisterNC('UColor', 'Utilities', color)
RegisterNC('URectangle', 'Utilities', rec)
RegisterNC('ButtonUtils', 'Utilities', ButtonUtils)