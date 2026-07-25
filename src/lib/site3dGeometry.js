// Pure geometry / data helpers for the 3D site experience
// (app/the-view/experience). No React or three.js imports here so the
// math stays easy to unit-reason-about and reusable from both R3F
// components and any future tooling.
//
// Coordinate convention: "percent space" (xPct, yPct) is 0..100 and
// matches the convention already used by src/data/plots.json /
// src/data/tour.json and src/components/tour/MasterPlan.jsx: it is a
// position on the sanctioned drawing (10-layout-plan.jpg), x growing
// east, y growing south. "World space" is metres, centred on the site,
// with +X east and +Z south (so a camera looking toward -Z looks north,
// i.e. up the slope toward the amenity zone).

export const SQYD_TO_SQM = 0.83612736;

export function pctToWorld(pt, world) {
        return {
                x: (pt.x / 100 - 0.5) * world.widthM,
                z: (pt.y / 100 - 0.5) * world.depthM,
        };
}

// Every plot that has a real surveyed `level`, plus the two site-level
// anchors (gate / highest point) from site3d.json, become control points
// for inverse-distance-weighted interpolation of the terrain everywhere
// else. This is what "interpolate from neighbours" means for plots that
// have no level of their own.
export function buildElevationAnchors(plotsData, site3d) {
        const anchors = plotsData.plots
                .filter((p) => p.level != null)
                .map((p) => ({ x: p.pos.x, y: p.pos.y, level: p.level }));
        site3d.elevationAnchors.forEach((a) => anchors.push({ x: a.pos.x, y: a.pos.y, level: a.level }));
        return anchors;
}

export function idwLevel(xPct, yPct, anchors, power = 2) {
        let num = 0;
        let den = 0;
        for (let i = 0; i < anchors.length; i += 1) {
                const a = anchors[i];
                const d2 = (xPct - a.x) ** 2 + (yPct - a.y) ** 2;
                if (d2 < 1e-6) return a.level;
                const w = 1 / d2 ** (power / 2);
                num += w * a.level;
                den += w;
        }
        return den > 0 ? num / den : 0;
}

export function levelToWorldY(level, gateLevel, verticalExaggeration) {
        return (level - gateLevel) * verticalExaggeration;
}

// Real survey level (metres, e.g. 646.7) at any point on the drawing.
export function terrainLevel(xPct, yPct, anchors) {
        return idwLevel(xPct, yPct, anchors);
}

// Exaggerated scene-space height (metres, world units) at any point.
export function terrainWorldY(xPct, yPct, anchors, gateLevel, verticalExaggeration) {
        return levelToWorldY(terrainLevel(xPct, yPct, anchors), gateLevel, verticalExaggeration);
}

// Ray-casting point-in-polygon test, percent space.
export function pointInPolygon(x, y, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
                const xi = poly[i].x;
                const yi = poly[i].y;
                const xj = poly[j].x;
                const yj = poly[j].y;
                const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
                if (intersect) inside = !inside;
        }
        return inside;
}

function distToSegment(px, py, ax, ay, bx, by) {
        const abx = bx - ax;
        const aby = by - ay;
        const apx = px - ax;
        const apy = py - ay;
        const lenSq = abx * abx + aby * aby;
        const t = lenSq > 1e-9 ? Math.max(0, Math.min(1, (apx * abx + apy * aby) / lenSq)) : 0;
        const cx = ax + t * abx;
        const cy = ay + t * aby;
        return Math.hypot(px - cx, py - cy);
}

export function distToPolygonEdges(x, y, poly) {
        let min = Infinity;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
                const d = distToSegment(x, y, poly[i].x, poly[i].y, poly[j].x, poly[j].y);
                if (d < min) min = d;
        }
        return min;
}

// 0 outside the polygon, 1 well inside, smoothly feathered across the
// boundary (feather width in percent units) so the terrain vertex-colour
// mask doesn't produce a hard, aliased edge.
export function siteMask(x, y, poly, featherPct = 3.5) {
        const inside = pointInPolygon(x, y, poly);
        const d = distToPolygonEdges(x, y, poly);
        const signed = inside ? d : -d;
        return Math.max(0, Math.min(1, 0.5 + signed / featherPct));
}

// Plot pad footprint from real sqyd. Only area is real; the aspect ratio
// is a styling knob (site3d.json plots.aspectRatio) since the sanctioned
// drawing gives area, not the exact rectangle for every plot.
export function plotFootprintM(sqyd, aspectRatio) {
        const areaM2 = sqyd * SQYD_TO_SQM;
        const width = Math.sqrt(areaM2 * aspectRatio);
        const depth = areaM2 / width;
        return { width, depth };
}

// Combine verified + unverified plots into one flat list, each carrying a
// resolved `level` (real if present, else IDW-interpolated) and a
// `footprintSqyd` used purely to size the 3D pad (real sqyd when known,
// else a neutral default, never shown to the user as a real size).
export function buildAllPlots3D(plotsData, site3d, anchors) {
        const verified = plotsData.plots.map((p) => ({
                id: p.id,
                sqyd: p.sqyd,
                sqft: p.sqft,
                pos: p.pos,
                verified: true,
                level: p.level != null ? p.level : terrainLevel(p.pos.x, p.pos.y, anchors),
                footprintSqyd: p.sqyd,
        }));
        const unverifiedIds = new Set(plotsData.unverifiedPlots);
        const unverified = plotsData.unverifiedPositions.map((u) => ({
                id: u.id,
                sqyd: null,
                sqft: null,
                pos: u.pos,
                verified: !unverifiedIds.has(u.id),
                level: terrainLevel(u.pos.x, u.pos.y, anchors),
                footprintSqyd: site3d.plots.defaultSqydForUnverified,
        }));
        return [...verified, ...unverified].sort((a, b) => a.id - b.id);
}

// Plain combined plot list carrying ONLY real data (sqyd/sqft/level are
// null where plots.json has no verified figure). Used for anything shown
// to the user (panels, tooltips) so the UI never surfaces an invented
// number, mirroring src/components/tour/MasterPlan.jsx's ALL_PLOTS.
export function buildAllPlotsReal(plotsData) {
        const unverifiedIds = new Set(plotsData.unverifiedPlots);
        const verified = plotsData.plots.map((p) => ({ ...p, verified: true }));
        const unverified = plotsData.unverifiedPositions.map((u) => ({
                id: u.id,
                sqyd: null,
                sqft: null,
                level: null,
                pos: u.pos,
                verified: !unverifiedIds.has(u.id),
        }));
        return [...verified, ...unverified].sort((a, b) => a.id - b.id);
}

function lerp(a, b, t) {
        return a + (b - a) * t;
}

// Builds a flat road/highway ribbon as raw BufferGeometry attribute arrays
// (positions + a fill colour, plus a triangle index list) following a
// polyline in percent space, subdividing each segment so it can properly
// follow the terrain height function, and lifting it slightly above the
// ground to avoid z-fighting.
export function buildRibbonAttributes(pointsPct, widthM, world, heightFn, liftM = 0.12, stepM = 4) {
        const worldPts = pointsPct.map((p) => {
                const w = pctToWorld(p, world);
                return { ...w, xPct: p.x, yPct: p.y };
        });

        const samples = [];
        for (let i = 0; i < worldPts.length - 1; i += 1) {
                const a = worldPts[i];
                const b = worldPts[i + 1];
                const segLen = Math.hypot(b.x - a.x, b.z - a.z);
                const steps = Math.max(1, Math.ceil(segLen / stepM));
                for (let s = 0; s < steps; s += 1) {
                        const t = s / steps;
                        samples.push({
                                x: lerp(a.x, b.x, t),
                                z: lerp(a.z, b.z, t),
                                xPct: lerp(a.xPct, b.xPct, t),
                                yPct: lerp(a.yPct, b.yPct, t),
                        });
                }
        }
        const last = worldPts[worldPts.length - 1];
        samples.push({ x: last.x, z: last.z, xPct: last.xPct, yPct: last.yPct });

        const positions = [];
        const colors = [];
        const indices = [];
        const half = widthM / 2;
        const darkCenter = [0.09, 0.09, 0.09];
        const lightEdge = [0.2, 0.19, 0.16];

        for (let i = 0; i < samples.length; i += 1) {
                const cur = samples[i];
                const prev = samples[Math.max(0, i - 1)];
                const next = samples[Math.min(samples.length - 1, i + 1)];
                let dx = next.x - prev.x;
                let dz = next.z - prev.z;
                const len = Math.hypot(dx, dz) || 1;
                dx /= len;
                dz /= len;
                // perpendicular in the XZ plane
                const px = -dz;
                const pz = dx;
                const y = heightFn(cur.xPct, cur.yPct) + liftM;

                positions.push(cur.x + px * half, y, cur.z + pz * half);
                colors.push(...lightEdge);
                positions.push(cur.x - px * half, y, cur.z - pz * half);
                colors.push(...lightEdge);
                // A slightly darker centre strip is approximated by pushing a
                // third, lower-opacity-look row is unnecessary for a strip mesh;
                // instead blend edges via vertex colour only (kept simple/fast).
        }

        for (let i = 0; i < samples.length - 1; i += 1) {
                const a = i * 2;
                const b = i * 2 + 1;
                const c = (i + 1) * 2;
                const d = (i + 1) * 2 + 1;
                indices.push(a, c, b, b, c, d);
        }

        // Blend a darker centre band by darkening every vertex slightly less at
        // the edges, recompute colours with a radial-ish factor per pair.
        for (let i = 0; i < samples.length; i += 1) {
                const base = i * 6; // 2 verts * 3 comps
                for (let k = 0; k < 2; k += 1) {
                        const o = base + k * 3;
                        colors[o] = lerp(darkCenter[0], lightEdge[0], k === 0 || k === 1 ? 0.35 : 0);
                        colors[o + 1] = lerp(darkCenter[1], lightEdge[1], 0.35);
                        colors[o + 2] = lerp(darkCenter[2], lightEdge[2], 0.35);
                }
        }

        return {
                positions: new Float32Array(positions),
                colors: new Float32Array(colors),
                indices,
        };
}

export function polygonCentroidPct(poly) {
        let x = 0;
        let y = 0;
        poly.forEach((p) => {
                x += p.x;
                y += p.y;
        });
        return { x: x / poly.length, y: y / poly.length };
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerpN = lerp;
