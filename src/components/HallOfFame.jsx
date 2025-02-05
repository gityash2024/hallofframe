import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import mockData from '../data/mockData';

const OceanContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, #1a4b77 0%, #073050 100%);
`;

const Header = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 20;
  color:blue
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const CirclesContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 15;
  pointer-events: none;
`;

const Circle = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease;
  will-change: transform;

  &:hover {
    transform: scale(1.1);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 450px;
  background: rgba(23, 55, 87, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 10px;
  z-index: 100;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  * {
    padding: 10px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 15px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding: 10px;
`;

const ProfileTitle = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: inline-block;
`;

const QuoteBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  border-left: 4px solid rgba(255, 255, 255, 0.2);
`;

const AchievementsList = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1.5rem;
`;

const Achievement = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }

  &:before {
    content: "•";
    color: #4a9eff;
    font-size: 1.5rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  z-index: 90;
`;

const GlobalStyle = styled.div`
  * {
    margin: 0;
    padding: 4px;
    box-sizing: border-box;
  }
`;

function Ocean() {
  const meshRef = useRef();
  const materialRef = useRef();
  const frameId = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      frameId.current = requestAnimationFrame(() => state.invalidate());
    }
  });

  useEffect(() => {
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <shaderMaterial ref={materialRef} uniforms={{uTime: { value: 0 },uBigWavesElevation: { value: 0.2 },uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },uBigWaveSpeed: { value: 0.75 },uSmallWavesElevation: { value: 0.15 },uSmallWavesFrequency: { value: 3 },uSmallWavesSpeed: { value: 0.2 },uSmallWavesIterations: { value: 4 },uDepthColor: { value: new THREE.Color('#1e4d78') },uSurfaceColor: { value: new THREE.Color('#4c96d7') },uColorOffset: { value: 0.08 },uColorMultiplier: { value: 5 }}} vertexShader={`uniform float uTime;uniform float uBigWavesElevation;uniform vec2 uBigWavesFrequency;uniform float uBigWaveSpeed;uniform float uSmallWavesElevation;uniform float uSmallWavesFrequency;uniform float uSmallWavesSpeed;uniform float uSmallWavesIterations;varying float vElevation;vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}float snoise(vec3 v){const vec2 C = vec2(1.0/6.0, 1.0/3.0);const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);vec3 i  = floor(v + dot(v, C.yyy));vec3 x0 =   v - i + dot(i, C.xxx);vec3 g = step(x0.yzx, x0.xyz);vec3 l = 1.0 - g;vec3 i1 = min( g.xyz, l.zxy );vec3 i2 = max( g.xyz, l.zxy );vec3 x1 = x0 - i1 + 1.0 * C.xxx;vec3 x2 = x0 - i2 + 2.0 * C.xxx;vec3 x3 = x0 - 1. + 3.0 * C.xxx;i = mod(i, 289.0 );vec4 p = permute( permute( permute(i.z + vec4(0.0, i1.z, i2.z, 1.0 ))+ i.y + vec4(0.0, i1.y, i2.y, 1.0 ))+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));float n_ = 1.0/7.0;vec3  ns = n_ * D.wyz - D.xzx;vec4 j = p - 49.0 * floor(p * ns.z *ns.z);vec4 x_ = floor(j * ns.z);vec4 y_ = floor(j - 7.0 * x_ );vec4 x = x_ *ns.x + ns.yyyy;vec4 y = y_ *ns.x + ns.yyyy;vec4 h = 1.0 - abs(x) - abs(y);vec4 b0 = vec4( x.xy, y.xy );vec4 b1 = vec4( x.zw, y.zw );vec4 s0 = floor(b0)*2.0 + 1.0;vec4 s1 = floor(b1)*2.0 + 1.0;vec4 sh = -step(h, vec4(0.0));vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;vec3 p0 = vec3(a0.xy,h.x);vec3 p1 = vec3(a0.zw,h.y);vec3 p2 = vec3(a1.xy,h.z);vec3 p3 = vec3(a1.zw,h.w);vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));p0 *= norm.x;p1 *= norm.y;p2 *= norm.z;p3 *= norm.w;vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);m = m * m;return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );}void main(){vec4 modelPosition = modelMatrix * vec4(position, 1.0);float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWaveSpeed) *sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWaveSpeed) *uBigWavesElevation;for(float i = 1.0; i <= uSmallWavesIterations; i++){elevation -= abs(snoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);}modelPosition.y += elevation;vec4 viewPosition = viewMatrix * modelPosition;vec4 projectedPosition = projectionMatrix * viewPosition;gl_Position = projectedPosition;vElevation = elevation;}`} fragmentShader={`uniform vec3 uDepthColor;uniform vec3 uSurfaceColor;uniform float uColorOffset;uniform float uColorMultiplier;varying float vElevation;void main(){float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);gl_FragColor = vec4(color, 1.0);}`} />
    </mesh>
  );
}

function AnimatedOcean() {
  return (
    <Canvas camera={{fov: 75,near: 0.1,far: 100,position: [0, 2, 3]}}>
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.5} minPolarAngle={Math.PI / 3} enableDamping={true} dampingFactor={0.05} />
      <Ocean />
    </Canvas>
  );
}

const HallOfFame = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [circles, setCircles] = useState([]);
  const animationsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = () => {
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
    };

    const getContainedPosition = (circleSize = 60) => {
      const container = containerRef.current;
      const padding = 20;
      const maxX = container.clientWidth - circleSize - padding;
      const maxY = container.clientHeight - circleSize - padding;
      return {
        x: padding + Math.random() * (maxX - padding * 2),
        y: padding + Math.random() * (maxY - padding * 2)
      };
    };

    const createRandomCircles = () => {
      const newCircles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        ...getContainedPosition(),
        image: `https://source.unsplash.com/random/150x150?portrait&sig=${i}`,
        ...mockData[i]
      }));
      setCircles(newCircles);
      return newCircles;
    };

    const animateCircle = (element, index) => {
      const duration = gsap.utils.random(10, 15);
      const repeatDelay = gsap.utils.random(0, 3);
      
      const createAnimation = () => {
        const pos = getContainedPosition();
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: repeatDelay,
          defaults: { ease: "sine.inOut" }
        });

        tl.to(element, {
          x: pos.x,
          y: pos.y,
          duration: duration,
          rotation: gsap.utils.random(-30, 30)
        });

        animationsRef.current[index] = tl;
      };

      createAnimation();
    };

    const initializeAnimations = () => {
        cleanup();
        const newCircles = createRandomCircles();
        
        setTimeout(() => {
          newCircles.forEach((_, index) => {
            const element = document.getElementById(`circle-${index}`);
            if (element) {
              animateCircle(element, index);
            }
          });
        }, 100);
      };
  
      initializeAnimations();
  
      const handleResize = () => {
        initializeAnimations();
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        cleanup();
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return (
      <GlobalStyle>
        <OceanContainer>
          <AnimatedOcean />
          <Header>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              Innovation Hall of Fame
            </h1>
          </Header>
          
          <CirclesContainer ref={containerRef}>
            {circles.map((circle, index) => (
              <Circle
                key={circle.id}
                id={`circle-${index}`}
                style={{
                  backgroundImage: `url(${circle.image})`,
                  transform: `translate(${circle.x}px, ${circle.y}px)`
                }}
                onClick={() => setSelectedPerson(circle)}
              />
            ))}
          </CirclesContainer>
  
          {selectedPerson && (
            <>
              <Overlay  onClick={() => setSelectedPerson(null)} />
              <Modal >
                <ProfileHeader>
                  <ProfileImage 
                    src={selectedPerson.image} 
                    alt={selectedPerson.name} 
                  />
                  <ProfileInfo>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedPerson.name}
                    </h2>
                    <ProfileTitle>
                      <span className="text-blue-200">{selectedPerson.title}</span>
                    </ProfileTitle>
                    <p className="text-gray-300 text-sm mt-2">
                      Class of {selectedPerson.year}
                    </p>
                  </ProfileInfo>
                </ProfileHeader>
  
                <QuoteBox>
                  <p className="italic text-gray-100">
                    &quot;{selectedPerson.quote}&quot;
                  </p>
                </QuoteBox>
  
                <AchievementsList>
                  <h3 className="text-lg font-semibold text-blue-100 mb-3">
                    Notable Achievements
                  </h3>
                  {selectedPerson.achievements.map((achievement, index) => (
                    <Achievement key={index}>
                      <span className="text-gray-200">{achievement}</span>
                    </Achievement>
                  ))}
                </AchievementsList>
              </Modal>
            </>
          )}
        </OceanContainer>
      </GlobalStyle>
    );
  };
  
  export default HallOfFame;