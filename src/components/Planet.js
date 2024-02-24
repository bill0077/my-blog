import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text3D, BBAnchor } from "@react-three/drei";

import taebaekJsonPath from "../../static/fonts/TAEBAEK-Regular.json";
import { MeshNormalMaterial, Vector3 } from "three";

export default function Planet(props) {
  const { name, link, filePath, heightOffset, rotateSpeed, orbitRadius, orbitSpeed, defaultScale } = props;
  const [isHovered, setHover] = useState(false);
  const hoverStartTime = useRef(0);
  const totalHoverTime = useRef(0);
  const cameraPosition = useRef({});
  const cameraAngle = useRef({});

  const handleHover = () => setHover(true);
  const handleLeave = () => setHover(false);
  const handleClick = () => {
    window.location.href = `${process.env.GATSBY_PUBLIC_URL}/${link}`; 
  };

  const { scene } = useGLTF(`${process.env.GATSBY_FILESERVER_URL}/${filePath}`);
  const planetRef = useRef();
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.position.y = heightOffset; // set y axis offset
      cameraAngle.current = state.camera.rotation; // save current camera angle
      cameraPosition.current = state.camera.position; // save current camera position
      
      const elapsedTime = state.clock.getElapsedTime(); // get the elapsed time

      if (isHovered && hoverStartTime.current === 0) {
        hoverStartTime.current = elapsedTime;
      } else if (!isHovered && hoverStartTime.current) {
        totalHoverTime.current += elapsedTime - hoverStartTime.current;
        hoverStartTime.current = 0;
      } else if (!isHovered) {
        hoverStartTime.current = 0;
      }

      // Update the scale based on time elased after hover
      const hoverElapsedTime = elapsedTime - hoverStartTime.current;
      const scaleMotionFrame = 1;
      const scaleMotionSpeed = 4;
      const maxScaleRatio = 1.5;
      var scaleRatio;
      if (hoverStartTime.current) { // hoverStartTime used instead of isHovered because isHovered cause flickering in motion 
        scaleRatio = Math.max(1, maxScaleRatio - Math.pow(Math.max(0, scaleMotionFrame - hoverElapsedTime), scaleMotionSpeed));
      } else {
        scaleRatio = 1;
      }
      const scale = [defaultScale*scaleRatio, defaultScale*scaleRatio, defaultScale*scaleRatio];
      planetRef.current.scale.set(...scale);

      if (!hoverStartTime.current) {
        // Update the position based on the orbit equation (when not hovered)
        planetRef.current.position.x = Math.cos((elapsedTime - totalHoverTime.current)* orbitSpeed) * orbitRadius;
        planetRef.current.position.z = Math.sin((elapsedTime - totalHoverTime.current)* orbitSpeed) * orbitRadius;
      
        // Rotate by given speed (when not hovered)
        planetRef.current.rotation.y -= rotateSpeed;
      }
    }
  });

  var textVec = new Vector3(0, 0, 0);
  const textDistance = 200;
  if (planetRef.current && cameraAngle.current) {
    const vecCurr = new Vector3(
      cameraPosition.current.x-planetRef.current.position.x,
      cameraPosition.current.y-planetRef.current.position.y,
      cameraPosition.current.z-planetRef.current.position.z,
    );
    textVec = vecCurr.normalize().multiplyScalar(textDistance);
  }

  const planetMaterial = new MeshNormalMaterial();
  return (
    <group>
      {isHovered && planetRef.current && cameraAngle.current && (
        <BBAnchor anchor={[0.3, 0.3, 0.3]}> 
          <Text3D
          position={[ // set the position of the text same as object
            planetRef.current.position.x+textVec.x,
            planetRef.current.position.y+textVec.y,
            planetRef.current.position.z+textVec.z
          ]}
          rotation={[ // set the angle of the text to face camera
            cameraAngle.current.x,
            cameraAngle.current.y,
            cameraAngle.current.z
          ]}
          font={taebaekJsonPath} // font type
          size={50} // set the font size
          height={40}
          material={planetMaterial}>
          {name}
          </Text3D>
        </BBAnchor>
      )}
      
      <primitive 
        onPointerOver={handleHover}
        onPointerOut={handleLeave}
        onClick={handleClick}
        object={scene}
        ref={planetRef}
        {...props}
      />
    </group>
  );
}