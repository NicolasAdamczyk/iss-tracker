import * as THREE from "three";
import { useMemo } from "react";

const loader = new THREE.TextureLoader();

function getSprite({ hasFog, color, opacity, path, pos, size }) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    fog: hasFog,
    map: loader.load(path),
    transparent: true,
    opacity,
  });
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

function getSprites({
  hasFog = true,
  hue = 0.65,
  numSprites = 8,
  opacity = 0.2,
  path = "/textures/others/rad-grad.png",
  radius = 10,
  sat = 0.5,
  size = 24,
  z = 0,
} = {}) {
  const layerGroup = new THREE.Group();
  for (let i = 0; i < numSprites; i += 1) {
    let angle = (i / numSprites) * Math.PI * 2;
    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random()
    );
    // const length = new THREE.Vector3(pos.x, pos.y, 0).length();
    // const hue = 0.0; // (0.9 - (radius - length) / radius) * 1;

    let color = new THREE.Color().setHSL(hue, 1, sat);
    const sprite = getSprite({ hasFog, color, opacity, path, pos, size });
    layerGroup.add(sprite);
  }
  return layerGroup;
}

function NebulaMaterial() {
  const sprites = useMemo(() => getSprites({
    numSprites: 8,
    radius: 10,
    z: 0,
    size: 16,
    opacity: 0.009,
    path: "/textures/others/rad-grad.png",
  }), []);

  return <primitive object={sprites} />;
}
export default NebulaMaterial;

// ON POURRA ANIMER UN PEU LE NEBULA