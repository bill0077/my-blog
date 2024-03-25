import React from "react";
import { useGLTF } from "@react-three/drei";

export default function PolyObject(props) {
  const { filePath } = props;
  const { scene } = useGLTF(`${process.env.GATSBY_FILESERVER_URL}/${filePath}`);

  return (
    <primitive object={scene} {...props} />
  );
}