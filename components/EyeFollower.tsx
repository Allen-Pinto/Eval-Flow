'use client';

import { useEffect, useRef } from 'react';

export function InteractiveEyeFollower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const pupil1Ref = useRef<HTMLDivElement>(null);
  const pupil2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !faceRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerCenterX = rect.left + rect.width / 2;
      const containerCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - containerCenterY, e.clientX - containerCenterX);
      const distance = 12;

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      if (pupil1Ref.current) {
        pupil1Ref.current.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
      }
      if (pupil2Ref.current) {
        pupil2Ref.current.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
      }

      const tiltX = (e.clientY - containerCenterY) / 50;
      const tiltY = (e.clientX - containerCenterX) / 50;
      faceRef.current.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const handleMouseLeave = () => {
      if (pupil1Ref.current) pupil1Ref.current.style.transform = 'translate(-50%, -50%)';
      if (pupil2Ref.current) pupil2Ref.current.style.transform = 'translate(-50%, -50%)';
      if (faceRef.current) faceRef.current.style.transform = 'rotateX(0) rotateY(0)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="eye-container-3d">
        <div className="face-3d" ref={faceRef}>
          <div className="eyes-3d">
            <div className="eye-3d">
              <div className="pupil-3d" ref={pupil1Ref}>
                <div className="sparkle-3d"></div>
              </div>
            </div>
            <div className="eye-3d">
              <div className="pupil-3d" ref={pupil2Ref}>
                <div className="sparkle-3d"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .eye-container-3d {
          perspective: 1000px;
        }
        
        .face-3d {
          width: 240px;
          height: 240px;
          background: radial-gradient(circle at 30% 30%, #ffffff, #e8f0fe);
          border-radius: 50%;
          position: relative;
          box-shadow: 0 20px 60px rgba(66, 133, 244, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
        }
        
        .eyes-3d {
          display: flex;
          gap: 60px;
          position: relative;
          z-index: 10;
        }
        
        .eye-3d {
          width: 50px;
          height: 50px;
          background: white;
          border: 3px solid #4285F4;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .pupil-3d {
          width: 20px;
          height: 20px;
          background: #4285F4;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.05s ease-out;
        }
        
        .sparkle-3d {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 8px;
          left: 8px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}