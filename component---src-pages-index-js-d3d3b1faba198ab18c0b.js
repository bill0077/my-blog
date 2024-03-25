"use strict";(self.webpackChunkmy_blog=self.webpackChunkmy_blog||[]).push([[678],{3731:function(e,t,n){n.d(t,{Z:function(){return i}});var r=n(7294),o=n(4160),a="ContentsTree-module--contentsTree__leaf--8208d";function i(){return r.createElement("div",null,r.createElement("div",{className:a},"  │"),r.createElement("div",{className:a},"  ├── PersonalHistory"),r.createElement("div",{className:a},"  │"),r.createElement("div",{className:a},"  ├── ProblemSolving"),r.createElement("div",{className:a},"  │     ├── boj "),r.createElement("div",{className:a},"  │     └── programmers"),r.createElement("div",{className:a},"  │"),r.createElement("div",{className:a},"  ├── SideProjects"),r.createElement("div",{className:a},"  │     ├── arbitrage-bot"),r.createElement("div",{className:a},"  │     ├── lambda-calculator "),r.createElement(o.rU,{to:"https://bill0077.github.io/my-blog/myblog-dev-log",className:a},"  │     ├── my-blog "),r.createElement("div",{className:a},"  │     └── tetris-ai"),r.createElement("div",{className:a},"  │"),r.createElement("div",{className:a},"  ├── Study"),r.createElement(o.rU,{to:"https://bill0077.github.io/my-blog/devops",className:a},"  │     └── DevOps"),r.createElement("div",{className:a},"  │"),r.createElement(o.rU,{to:"https://bill0077.github.io/my-blog/etc",className:a},"  └── etc"))}},1373:function(e,t,n){n.r(t),n.d(t,{default:function(){return T}});var r=n(7294),o=n(5953),a=n(7462),i=n(9477),l=n(735),s=n(5878),c=n(5845);class m extends i.ShaderMaterial{constructor(){super({uniforms:{depth:{value:null},opacity:{value:1},attenuation:{value:2.5},anglePower:{value:12},spotPosition:{value:new i.Vector3(0,0,0)},lightColor:{value:new i.Color("white")},cameraNear:{value:0},cameraFar:{value:1},resolution:{value:new i.Vector2(0,0)}},transparent:!0,depthWrite:!1,vertexShader:"\n        varying vec3 vNormal;\n        varying float vViewZ;\n        varying float vIntensity;\n        uniform vec3 spotPosition;\n        uniform float attenuation;\n\n        #include <common>\n        #include <logdepthbuf_pars_vertex>\n\n        void main() {\n          // compute intensity\n          vNormal = normalize(normalMatrix * normal);\n          vec4 worldPosition = modelMatrix * vec4(position, 1);\n          vec4 viewPosition = viewMatrix * worldPosition;\n          vViewZ = viewPosition.z;\n\n          vIntensity = 1.0 - saturate(distance(worldPosition.xyz, spotPosition) / attenuation);\n\n          gl_Position = projectionMatrix * viewPosition;\n\n          #include <logdepthbuf_vertex>\n        }\n      ",fragmentShader:`\n        varying vec3 vNormal;\n        varying float vViewZ;\n        varying float vIntensity;\n\n        uniform vec3 lightColor;\n        uniform float anglePower;\n        uniform sampler2D depth;\n        uniform vec2 resolution;\n        uniform float cameraNear;\n        uniform float cameraFar;\n        uniform float opacity;\n\n        #include <packing>\n        #include <logdepthbuf_pars_fragment>\n\n        float readDepth(sampler2D depthSampler, vec2 uv) {\n          float fragCoordZ = texture(depthSampler, uv).r;\n\n          // https://github.com/mrdoob/three.js/issues/23072\n          #ifdef USE_LOGDEPTHBUF\n            float viewZ = 1.0 - exp2(fragCoordZ * log(cameraFar + 1.0) / log(2.0));\n          #else\n            float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\n          #endif\n\n          return viewZ;\n        }\n\n        void main() {\n          #include <logdepthbuf_fragment>\n\n          vec3 normal = vec3(vNormal.x, vNormal.y, abs(vNormal.z));\n          float angleIntensity = pow(dot(normal, vec3(0, 0, 1)), anglePower);\n          float intensity = vIntensity * angleIntensity;\n\n          // fades when z is close to sampled depth, meaning the cone is intersecting existing geometry\n          bool isSoft = resolution[0] > 0.0 && resolution[1] > 0.0;\n          if (isSoft) {\n            vec2 uv = gl_FragCoord.xy / resolution;\n            intensity *= smoothstep(0.0, 1.0, vViewZ - readDepth(depth, uv));\n          }\n\n          gl_FragColor = vec4(lightColor, intensity * opacity);\n\n          #include <tonemapping_fragment>\n          #include <${c.i>=154?"colorspace_fragment":"encodings_fragment"}>\n        }\n      `})}}function u({opacity:e=1,radiusTop:t,radiusBottom:n,depthBuffer:o,color:a="white",distance:s=5,angle:c=.15,attenuation:u=5,anglePower:d=5}){const h=r.useRef(null),f=(0,l.A)((e=>e.size)),g=(0,l.A)((e=>e.camera)),p=(0,l.A)((e=>e.viewport.dpr)),[v]=r.useState((()=>new m)),[y]=r.useState((()=>new i.Vector3));t=void 0===t?.1:t,n=void 0===n?7*c:n,(0,l.C)((()=>{v.uniforms.spotPosition.value.copy(h.current.getWorldPosition(y)),h.current.lookAt(h.current.parent.target.getWorldPosition(y))}));const b=r.useMemo((()=>{const e=new i.CylinderGeometry(t,n,s,128,64,!0);return e.applyMatrix4((new i.Matrix4).makeTranslation(0,-s/2,0)),e.applyMatrix4((new i.Matrix4).makeRotationX(-Math.PI/2)),e}),[s,t,n]);return r.createElement(r.Fragment,null,r.createElement("mesh",{ref:h,geometry:b,raycast:()=>null},r.createElement("primitive",{object:v,attach:"material","uniforms-opacity-value":e,"uniforms-lightColor-value":a,"uniforms-attenuation-value":u,"uniforms-anglePower-value":d,"uniforms-depth-value":o,"uniforms-cameraNear-value":g.near,"uniforms-cameraFar-value":g.far,"uniforms-resolution-value":o?[f.width*p,f.height*p]:[0,0]})))}const d=r.forwardRef((({opacity:e=1,radiusTop:t,radiusBottom:n,depthBuffer:o,color:i="white",distance:l=5,angle:c=.15,attenuation:m=5,anglePower:d=5,volumetric:h=!0,debug:f=!1,children:g,...p},v)=>{const y=r.useRef(null);return r.createElement("group",null,f&&y.current&&r.createElement("spotLightHelper",{args:[y.current]}),r.createElement("spotLight",(0,a.Z)({ref:(0,s.Z)([v,y]),angle:c,color:i,distance:l,castShadow:!0},p),h&&r.createElement(u,{debug:f,opacity:e,radiusTop:t,radiusBottom:n,depthBuffer:o,color:i,distance:l,angle:c,attenuation:m,anglePower:d})),g&&r.cloneElement(g,{spotlightRef:y,debug:f}))}));var h=n(2198),f=n(6909),g=n(1343);function p(e){const{objectList:t,fallLimitHeight:n}=e,{0:o,1:a}=(0,r.useState)(0),i=(0,r.useRef)(0),s=(0,r.useRef)([0,0,0]),c=(0,r.useRef)([0,0,0]),m=(0,r.useRef)(!1),u=t[o].offset,d=t[o].objectHeight,h=(0,r.useRef)();return(0,l.C)((e=>{if(h.current){const e=1,r=100;m.current||(h.current.position.x=u[0],h.current.position.y=u[1],h.current.position.z=u[2],m.current=!0),1===i.current&&(s.current=[20*(Math.random()-.5),20+10*Math.random(),20*(Math.random()-.5)],c.current=[(Math.random()-.5)/30,(Math.random()-.5)/30,(Math.random()-.5)/30],i.current+=1),(i.current>0||0===i.current&&h.current.position.y>d)&&(h.current.position.x+=s.current[0],h.current.position.y+=s.current[1],h.current.position.z+=s.current[2],h.current.rotation.x+=c.current[0],h.current.rotation.y+=c.current[1],h.current.rotation.z+=c.current[2]),h.current.position.y<n&&(m.current=!1,i.current=0,h.current.position.x=u[0],h.current.position.y=u[1],h.current.position.z=u[2],h.current.rotation.x=0,h.current.rotation.y=0,h.current.rotation.z=0,s.current=[0,0,0],c.current=[0,0,0],o<t.length-1?a(o+1):a(0)),s.current[1]=Math.max(s.current[1]-e,-r)}})),r.createElement("group",{ref:h,onClick:()=>{i.current+=1}},t[o].object)}var v=n(5785),y=n(6337),b=n(2263);function _(e){const{text:t}=e,n=new i.MeshNormalMaterial;return r.createElement("group",{ref:n},r.createElement(y.o,{font:b,size:60,height:40,position:[0,0,0],curveSegments:12,material:n},t))}function w(e){const t=new RegExp("\n","g"),n=e.match(t),o=100*(n?n.length:0);return{object:r.createElement(_,{text:e}),offset:[-300,1e3,0],objectHeight:o}}function E(){const e=["Welcome to bill0077.log!\nPlease click me!","Feel free to rotate and click!"].map((e=>w(e))),t=["When I wrote this code, \nonly God and I understood what I did. \nNow only God knows\n- Anonymous","Coding like poetry should be short and concise.\n- Santosh Kalwar","It’s not a bug; \nit’s an undocumented feature.\n- Anonymous","First, solve the problem. \nThen, write the code.\n- John Johnson","Code is like humor. \nWhen you have to explain it, it’s bad.\n- Cory House","Make it work, \nmake it right, \nmake it fast.\n- Kent Beck","Clean code always looks like \nit was written by someone who cares.\n- Robert C. Martin","Of course, bad code can be cleaned up. \nBut it’s very expensive.\n- Robert C. Martin","Programming is the art of algorithm design \nand the craft of debugging errant code. \n– Ellen Ullman","Any fool can write code that \na computer can understand. \nGood programmers write code that \nhumans can understand. \n― Martin Fowler","Experience is the name \neveryone gives to their mistakes. \n– Oscar Wilde","Programming is the art of \ntelling another human being \nwhat one wants the computer to do. \n― Donald Ervin Knuth","Confusion is part of programming. \n― Felienne Hermans","Software and cathedrals are much the same \nfirst we build them, then we pray. \n- Samuel T. Redwine, Jr.","Programmer: \nA machine that turns coffee into code. \n– Anonymous","Programming is learned by writing programs. \n― Brian Kernighan","If debugging is the process of removing bugs, \nthen programming must be \nthe process of putting them in. \n– Sam Redwine","Sometimes it pays to stay in bed on Monday, \nrather than spending the rest of the week \ndebugging Monday’s code. \n– Dan Salomon","If, at first, you do not succeed, \ncall it version 1.0. \n― Khayri R.R. Woulfe","Computers are fast; \ndevelopers keep them slow. \n– Anonymous"].map((e=>w(e))),n=["That's it! \nThank you for staying until the end!"].map((e=>w(e)));return[].concat((0,v.Z)(e),(0,v.Z)(function(e){var t=e;for(let n=t.length-1;n>0;n--){const e=Math.floor(Math.random()*(n+1));[t[n],t[e]]=[t[e],t[n]]}return t}([].concat((0,v.Z)(t),(0,v.Z)(polyObjects)))),(0,v.Z)(n))}var x=n(3731),N="Home-module--home--eeb12",M="Home-module--home__main--2a0a1",P="Home-module--home__main__canvas--36a08",k="Home-module--home__main__titleBox--c2d57",S="Home-module--home__main__titleBox__contact--33deb",C="Home-module--home__main__titleBox__subtitle--05d67",H="Home-module--home__main__titleBox__title--c4566",R="Home-module--home__main__titleBox__title__contentsTree--7db75",Z="Home-module--home__main__titleBox__title__text--d1066",B="Home-module--home__main__titleBox__title__text__vibration--cebde";function j(){const e=(0,r.useRef)();return r.createElement(o.Xz,{dpr:[1,2],shadows:!1},r.createElement(d,{position:[0,500,1e3],angle:.3,penumbra:.1}),r.createElement(h.c,{ref:e,makeDefault:!0,fov:45,near:1,far:1e4,position:[-200,500,1500]}),r.createElement(f.B,{camera:e.current,minDistance:750,maxDistance:1500,azimuthRotateSpeed:.3,polarRotateSpeed:.5,dollySpeed:.5}),r.createElement(g.H,{camera:e.current,preset:"soft",intensity:5,shadows:!1,adjustCamera:!1},r.createElement(p,{objectList:E(),fallLimitHeight:-2e3})))}function I(e){let{vibrate:t}=e;return r.createElement("div",{className:t?B:Z},"bill0077.log")}function z(){const{0:e,1:t}=(0,r.useState)(!1),{0:n,1:o}=(0,r.useState)(!1);(0,r.useEffect)((()=>{if(e)return void o(!1);const t=setInterval((()=>{o(!0),setTimeout((()=>{o(!1)}),300)}),3e3);return()=>clearInterval(t)}),[e]);const a=(0,r.useMemo)((()=>r.createElement(j,null)),[]);return r.createElement("div",{className:N},r.createElement("div",{className:M},r.createElement("div",{className:P},a),r.createElement("div",{className:k},r.createElement("div",{className:H,onMouseEnter:()=>t(!0)},r.createElement(I,{vibrate:n}),r.createElement("div",{className:R},r.createElement(x.Z,null))),r.createElement("div",{className:C},"함께 성장하는 개발자를 꿈꿉니다"),r.createElement("a",{href:"mailto:bill007tjr@gmail.com",rel:"noreferrer noopener",className:S},"bill007tjr@gmail.com"),r.createElement("a",{href:"https://github.com/bill0077",target:"_blank",rel:"noreferrer noopener",className:S},"https://github.com/bill0077"))))}var T=function(){return r.createElement(z,null)}}}]);
//# sourceMappingURL=component---src-pages-index-js-d3d3b1faba198ab18c0b.js.map