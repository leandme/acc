#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Scene,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "public", "models", "body-visualizer", "mpfb");

const RAW_BASE = "https://raw.githubusercontent.com/makehumancommunity/makehuman/master";
const BASE_OBJ_URL = `${RAW_BASE}/makehuman/data/3dobjs/base.obj`;

const CANONICAL_CHANNELS = [
  "macro_weight",
  "macro_muscle",
  "macro_height",
  "local_torso_fat",
  "local_torso_muscle",
  "local_arms_fat",
  "local_arms_muscle",
  "local_legs_fat",
  "local_legs_muscle",
];

const commonChannelFiles = {
  local_torso_fat: [
    "makehuman/data/targets/stomach/stomach-tone-decr.target",
    "makehuman/data/targets/head/head-fat-incr.target",
  ],
  local_torso_muscle: [
    "makehuman/data/targets/stomach/stomach-tone-incr.target",
    "makehuman/data/targets/torso/torso-muscle-dorsi-incr.target",
    "makehuman/data/targets/torso/torso-muscle-pectoral-incr.target",
  ],
  local_arms_fat: [
    "makehuman/data/targets/armslegs/l-upperarm-fat-incr.target",
    "makehuman/data/targets/armslegs/r-upperarm-fat-incr.target",
    "makehuman/data/targets/armslegs/l-lowerarm-fat-incr.target",
    "makehuman/data/targets/armslegs/r-lowerarm-fat-incr.target",
  ],
  local_arms_muscle: [
    "makehuman/data/targets/armslegs/l-upperarm-muscle-incr.target",
    "makehuman/data/targets/armslegs/r-upperarm-muscle-incr.target",
    "makehuman/data/targets/armslegs/l-upperarm-shoulder-muscle-incr.target",
    "makehuman/data/targets/armslegs/r-upperarm-shoulder-muscle-incr.target",
    "makehuman/data/targets/armslegs/l-lowerarm-muscle-incr.target",
    "makehuman/data/targets/armslegs/r-lowerarm-muscle-incr.target",
  ],
  local_legs_fat: [
    "makehuman/data/targets/armslegs/l-upperleg-fat-incr.target",
    "makehuman/data/targets/armslegs/r-upperleg-fat-incr.target",
    "makehuman/data/targets/armslegs/l-lowerleg-fat-incr.target",
    "makehuman/data/targets/armslegs/r-lowerleg-fat-incr.target",
  ],
  local_legs_muscle: [
    "makehuman/data/targets/armslegs/l-upperleg-muscle-incr.target",
    "makehuman/data/targets/armslegs/r-upperleg-muscle-incr.target",
    "makehuman/data/targets/armslegs/l-lowerleg-muscle-incr.target",
    "makehuman/data/targets/armslegs/r-lowerleg-muscle-incr.target",
  ],
};

const sexConfigs = {
  male: {
    output: "body_male_v1.glb",
    targetHeightM: 1.78,
    genderBase: "makehuman/data/targets/macrodetails/caucasian-male-young.target",
    macroWeightLow: "makehuman/data/targets/macrodetails/universal-male-young-averagemuscle-minweight.target",
    macroWeightHigh: "makehuman/data/targets/macrodetails/universal-male-young-averagemuscle-maxweight.target",
    macroMuscleLow: "makehuman/data/targets/macrodetails/universal-male-young-minmuscle-minweight.target",
    macroMuscleHigh: "makehuman/data/targets/macrodetails/universal-male-young-maxmuscle-minweight.target",
    macroHeightLow: "makehuman/data/targets/macrodetails/height/male-young-averagemuscle-averageweight-minheight.target",
    macroHeightHigh: "makehuman/data/targets/macrodetails/height/male-young-averagemuscle-averageweight-maxheight.target",
  },
  female: {
    output: "body_female_v1.glb",
    targetHeightM: 1.65,
    genderBase: "makehuman/data/targets/macrodetails/caucasian-female-young.target",
    macroWeightLow: "makehuman/data/targets/macrodetails/universal-female-young-averagemuscle-minweight.target",
    macroWeightHigh: "makehuman/data/targets/macrodetails/universal-female-young-averagemuscle-maxweight.target",
    macroMuscleLow: "makehuman/data/targets/macrodetails/universal-female-young-minmuscle-minweight.target",
    macroMuscleHigh: "makehuman/data/targets/macrodetails/universal-female-young-maxmuscle-minweight.target",
    macroHeightLow: "makehuman/data/targets/macrodetails/height/female-young-averagemuscle-averageweight-minheight.target",
    macroHeightHigh: "makehuman/data/targets/macrodetails/height/female-young-averagemuscle-averageweight-maxheight.target",
  },
};

function ensureFileReader() {
  if (globalThis.FileReader) return;

  globalThis.FileReader = class {
    constructor() {
      this.onloadend = null;
      this.result = null;
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        if (this.onloadend) this.onloadend();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((ab) => {
        const mime = blob.type || "application/octet-stream";
        this.result = `data:${mime};base64,${Buffer.from(ab).toString("base64")}`;
        if (this.onloadend) this.onloadend();
      });
    }
    readAsText(blob) {
      blob.text().then((txt) => {
        this.result = txt;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.text();
}

function parseObj(objText) {
  const vertices = [];
  const indices = [];
  const lines = objText.split(/\r?\n/);

  for (const line of lines) {
    if (line.startsWith("v ")) {
      const parts = line.trim().split(/\s+/);
      vertices.push(Number(parts[1]), Number(parts[2]), Number(parts[3]));
      continue;
    }

    if (!line.startsWith("f ")) continue;

    const face = line.trim().split(/\s+/).slice(1);
    if (face.length < 3) continue;

    const vertexCount = vertices.length / 3;
    const vIdx = face.map((token) => {
      const first = token.split("/")[0];
      const n = Number(first);
      return n > 0 ? n - 1 : vertexCount + n;
    });

    for (let i = 1; i < vIdx.length - 1; i += 1) {
      indices.push(vIdx[0], vIdx[i], vIdx[i + 1]);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  };
}

function parseTarget(targetText, vertexCount) {
  const out = new Float32Array(vertexCount * 3);
  const lines = targetText.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 4) continue;

    const index = Number(parts[0]);
    if (!Number.isFinite(index) || index < 0 || index >= vertexCount) continue;

    out[index * 3] += Number(parts[1]);
    out[index * 3 + 1] += Number(parts[2]);
    out[index * 3 + 2] += Number(parts[3]);
  }

  return out;
}

function addInPlace(target, delta, weight = 1) {
  for (let i = 0; i < target.length; i += 1) {
    target[i] += delta[i] * weight;
  }
}

function subtractArrays(a, b) {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i += 1) {
    out[i] = a[i] - b[i];
  }
  return out;
}

function scaleArray(source, factor) {
  const out = new Float32Array(source.length);
  for (let i = 0; i < source.length; i += 1) {
    out[i] = source[i] * factor;
  }
  return out;
}

function measureBounds(positions) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    minZ: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
    maxZ: Number.NEGATIVE_INFINITY,
  };

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    if (x < bounds.minX) bounds.minX = x;
    if (y < bounds.minY) bounds.minY = y;
    if (z < bounds.minZ) bounds.minZ = z;
    if (x > bounds.maxX) bounds.maxX = x;
    if (y > bounds.maxY) bounds.maxY = y;
    if (z > bounds.maxZ) bounds.maxZ = z;
  }

  return bounds;
}

function normalizeBodyScaleAndPosition(basePositions, targetHeightM) {
  const bounds = measureBounds(basePositions);
  const rawHeight = Math.max(bounds.maxY - bounds.minY, 0.0001);
  const scale = targetHeightM / rawHeight;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerZ = (bounds.minZ + bounds.maxZ) / 2;

  const normalized = new Float32Array(basePositions.length);
  for (let i = 0; i < basePositions.length; i += 3) {
    normalized[i] = (basePositions[i] - centerX) * scale;
    normalized[i + 1] = (basePositions[i + 1] - bounds.minY) * scale;
    normalized[i + 2] = (basePositions[i + 2] - centerZ) * scale;
  }

  return { normalized, scale };
}

async function exportGlb(scene) {
  ensureFileReader();
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(Buffer.from(result));
          return;
        }
        reject(new Error("Expected binary GLB output"));
      },
      (error) => reject(error),
      { binary: true }
    );
  });
}

async function build() {
  await fs.mkdir(outDir, { recursive: true });

  console.log("Fetching base mesh...");
  const baseObj = await fetchText(BASE_OBJ_URL);
  const { vertices: baseVertices, indices } = parseObj(baseObj);
  const vertexCount = baseVertices.length / 3;
  console.log(`Base mesh parsed: ${vertexCount} vertices, ${indices.length / 3} triangles`);

  const targetPaths = new Set();
  for (const sexConfig of Object.values(sexConfigs)) {
    targetPaths.add(sexConfig.genderBase);
    targetPaths.add(sexConfig.macroWeightLow);
    targetPaths.add(sexConfig.macroWeightHigh);
    targetPaths.add(sexConfig.macroMuscleLow);
    targetPaths.add(sexConfig.macroMuscleHigh);
    targetPaths.add(sexConfig.macroHeightLow);
    targetPaths.add(sexConfig.macroHeightHigh);
  }
  for (const files of Object.values(commonChannelFiles)) {
    files.forEach((file) => targetPaths.add(file));
  }

  const targetDeltas = new Map();
  for (const relPath of targetPaths) {
    const url = `${RAW_BASE}/${relPath}`;
    const text = await fetchText(url);
    targetDeltas.set(relPath, parseTarget(text, vertexCount));
  }
  console.log(`Loaded target files: ${targetDeltas.size}`);

  for (const [sex, sexConfig] of Object.entries(sexConfigs)) {
    console.log(`Building ${sex}...`);

    const baseWithSex = new Float32Array(baseVertices);
    addInPlace(baseWithSex, targetDeltas.get(sexConfig.genderBase));

    const { normalized: normalizedBase, scale } = normalizeBodyScaleAndPosition(
      baseWithSex,
      sexConfig.targetHeightM
    );

    const morphDeltas = {};
    morphDeltas.macro_weight = scaleArray(
      subtractArrays(
        targetDeltas.get(sexConfig.macroWeightHigh),
        targetDeltas.get(sexConfig.macroWeightLow)
      ),
      scale
    );
    morphDeltas.macro_muscle = scaleArray(
      subtractArrays(
        targetDeltas.get(sexConfig.macroMuscleHigh),
        targetDeltas.get(sexConfig.macroMuscleLow)
      ),
      scale
    );
    morphDeltas.macro_height = scaleArray(
      subtractArrays(
        targetDeltas.get(sexConfig.macroHeightHigh),
        targetDeltas.get(sexConfig.macroHeightLow)
      ),
      scale
    );

    for (const [channel, files] of Object.entries(commonChannelFiles)) {
      const merged = new Float32Array(baseVertices.length);
      files.forEach((file) => addInPlace(merged, targetDeltas.get(file)));
      morphDeltas[channel] = scaleArray(merged, scale);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(normalizedBase, 3));
    geometry.setIndex(Array.from(indices));
    geometry.computeVertexNormals();
    geometry.morphTargetsRelative = true;
    geometry.morphAttributes.position = [];

    for (const channel of CANONICAL_CHANNELS) {
      const attr = new Float32BufferAttribute(morphDeltas[channel], 3);
      attr.name = channel;
      geometry.morphAttributes.position.push(attr);
    }

    const material = new MeshStandardMaterial({
      color: new Color("#b8b8b8"),
      roughness: 0.72,
      metalness: 0.04,
    });

    const mesh = new Mesh(geometry, material);
    mesh.name = `body_${sex}_v1`;
    mesh.updateMorphTargets();

    const scene = new Scene();
    scene.add(mesh);

    const glb = await exportGlb(scene);
    const outPath = path.join(outDir, sexConfig.output);
    await fs.writeFile(outPath, glb);
    console.log(`Wrote ${outPath} (${(glb.length / (1024 * 1024)).toFixed(2)} MB)`);
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
