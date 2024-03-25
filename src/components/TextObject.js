import React from "react";
import { Text3D } from "@react-three/drei";
import { MeshNormalMaterial } from "three";

import taebaekPath from "../../static/fonts/TAEBAEK-Regular.json";

export default function TextObject(props) {
  const { text } = props;
  const textMaterial = new MeshNormalMaterial();

  return (
    <group
    ref={textMaterial}>
      <Text3D
        font={taebaekPath}
        size={60}
        height={40}
        position={[0, 0, 0]}
        curveSegments={12}
        material={textMaterial}>
        {text}
      </Text3D>
    </group>
  );
}