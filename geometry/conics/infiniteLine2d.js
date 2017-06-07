'use strict';

const _Math = require('../../math/math.js');
const Vector2 = _Math.Vector2;
const Vector3 = _Math.Vector3;

const GeomUtils = require('../geomUtils.js');

const helperFunctions = {
  calculateTriple: function calculateTriple (vec3) {
    const V = vec3 || new Vector3();
    const point = this.point;
    const d = this.direction;
    const u = d.x;
    const v = d.y;
    const x = point.x;
    const y = point.y;
    V.set(-v, u, v * x - u * y);
    return V;
  }
};

const infiniteLine2DFunctions = {
  distanceTo: function distanceTo (Q) {
    return _Math.abs(infiniteLine2DFunctions.signedDistanceTo.call(this, Q));
  },
  signedDistanceTo: function signedDistanceTo (Q) {
    const x = Q.x;
    const y = Q.y;
    const triple = helperFunctions.calculateTriple.call(this);
    const a = triple.x;
    const b = triple.y;
    const c = triple.z;

    return ((a * x + b * y + c) / _Math.sqrt(a * a + b * b));
  },
  isPointOnLine: function isPointOnLine (Q) {
    const x = Q.x;
    const y = Q.y;
    const triple = helperFunctions.calculateTriple.call(this);
    const a = triple.x;
    const b = triple.y;
    const c = triple.z;
    return GeomUtils.NumericalCompare.isZero(a * x + b * y + c);
  },
  getPointOnLine: function getPointOnLine () {
    return this.point.clone();
  },
  getClosestPointToPoint: function getClosestPointToPoint (Q) {
    const P = this.point;
    const a = this.direction;
    const QP = Q.clone().sub(P);
    const t = a.dot(QP);
    return a.clone().multiplyScalar(t).add(P);
  },
  getTriple: function getTriple (vec3) {
    return helperFunctions.calculateTriple.call(this, vec3);
  },
  intersectWithInfiniteLine: function intersectWithInfiniteLine (infLine) {
    const L1 = helperFunctions.calculateTriple.call(this);
    const L2 = helperFunctions.calculateTriple.call(infLine);
    const P = L1.clone().cross(L2);
    const z = P.z;
    if (GeomUtils.NumericalCompare.isZero(z)) {
      return undefined;
    } else {
      return new Vector2(P.x / z, P.y / z);
    }
  },
  intersectWithCircle: function intersectWithCircle (circle) {
    const results = [];
    const center = circle.center;
    const a = center.x;
    const b = center.y;
    const r = circle.radius;
    const x0 = this.point.x;
    const y0 = this.point.y;
    const c = this.direction.x;
    const d = this.direction.y;

    const A = c * c + d * d;
    const B = 2 * (c * (x0 - a) + d * (y0 - b));
    const C = (x0 - a) * (x0 - a) + (y0 - b) * (y0 - b) - r * r;
    const disc = B * B - 4 * A * C;
    if (GeomUtils.NumericalCompare.isZero(disc)) {
      const t = -B / (2 * A);
      const x1 = x0 + c * t;
      const y1 = y0 + d * t;
      results.push(new Vector2(x1, y1));
    } else if (GeomUtils.NumericalCompare.isGTZero(disc)) {
      const t1 = (-B + _Math.sqrt(disc)) / (2 * A);
      const t2 = (-B - _Math.sqrt(disc)) / (2 * A);
      const x1 = x0 + c * t1;
      const y1 = y0 + d * t1;
      results.push(new Vector2(x1, y1));
      const x2 = x0 + c * t2;
      const y2 = y0 + d * t2;
      results.push(new Vector2(x2, y2));
    }
    return results;
  },
  intersectWithGeneralizedConic: function intersectWithGeneralizedConic (conic) {
    return conic.intersectWithInfiniteLine(this);
  },
  clone: function clone() {
    return InfiniteLine2D.create(this.point, this.direction);
  }
};

const InfiniteLine2D = {
  create: function (point, direction) {
    const d = direction.clone().normalize();
    const u = d.x;
    const v = d.y;
    const x = point.x;
    const y = point.y;

    const line = {};
    Object.assign(line, {
      point: point.clone(),
      direction: d
    });
    Object.assign(line, infiniteLine2DFunctions);
    return line;
  }
};

module.exports = InfiniteLine2D;
