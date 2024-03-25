import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function FallingObjects(props) {
  const { objectList, fallLimitHeight } = props;
  const [objectNum, setObjectNum] = useState(0);
  const clickCount = useRef(0);
  const objectOffset = useRef({
    offset: objectList[objectNum]['offset'],
    groundHeight: objectList[objectNum]['objectHeight']
  });
  const objectState = useRef({
    isFalling: false,
    speed: [0, -30, 0],
    rotation: [0, 0, 0]
  });

  const handleClick = () => { clickCount.current += 1; }
 
  const objectRef = useRef();
  useFrame((state) => {
    if (objectRef.current) {
      const G = 1;
      
      // set initial position
      if (!objectState.current.isFalling) {
        objectRef.current.position.x = objectOffset.current.offset[0];
        objectRef.current.position.y = objectOffset.current.offset[1];
        objectRef.current.position.z = objectOffset.current.offset[2];
        objectRef.current.rotation.x = 0;
        objectRef.current.rotation.y = 0;
        objectRef.current.rotation.z = 0;
        objectState.current.isFalling = true;
      }

      // when clicked, the object starts falling at a random initial speed.
      if (clickCount.current === 1) {
        objectState.current.speed = [(Math.random()-0.5)*20, 20+Math.random()*10, (Math.random()-0.5)*20];
        objectState.current.rotation = [(Math.random()-0.5)/30, (Math.random()-0.5)/30, (Math.random()-0.5)/30];
        clickCount.current += 1;
      }

      // objects fall according to basic laws of physics until they hit the ground or clicked
      if (clickCount.current > 0 || clickCount.current === 0 && objectRef.current.position.y > objectOffset.current.groundHeight) {
        objectRef.current.position.x += objectState.current.speed[0];
        objectRef.current.position.y += objectState.current.speed[1];
        objectRef.current.position.z += objectState.current.speed[2];
        
        objectRef.current.rotation.x += objectState.current.rotation[0];
        objectRef.current.rotation.y += objectState.current.rotation[1];
        objectRef.current.rotation.z += objectState.current.rotation[2];
      }

      // get next object after previos object reaches fall limit height
      if (objectRef.current.position.y < fallLimitHeight) {
        var i = objectNum;
        if (objectNum < objectList.length-1) {
          setObjectNum(objectNum+1);
          i++;
        } else {
          setObjectNum(0);
          i=0;
        }
        objectOffset.current.offset = objectList[i]['offset'];
        objectOffset.current.groundHeight = objectList[i]['objectHeight'];

        clickCount.current = 0;
        objectState.current.rotation = [0, 0, 0];
        objectState.current.speed = [0, -30, 0];
        objectState.current.isFalling = false;
      }
      objectState.current.speed[1] = objectState.current.speed[1] - G;
    }
  });

  return (
    <group
    ref={objectRef}
    onClick={handleClick}>
      {objectList[objectNum]['object']}
    </group>
  );
}