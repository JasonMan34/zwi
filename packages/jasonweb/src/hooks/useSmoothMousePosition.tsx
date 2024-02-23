import { useEffect, useState } from 'react';

import useMousePosition from './useMousePosition';

const useSmoothMousePosition = (smoothingFactor = 0.04) => {
  const rawMousePosition = useMousePosition();
  const [smoothedPosition, setSmoothedPosition] = useState(rawMousePosition);

  useEffect(() => {
    let animationFrameId: number;

    const smoothPosition = () => {
      setSmoothedPosition((prevPosition) => {
        if (
          Math.abs(rawMousePosition.x - prevPosition.x) < 10 &&
          Math.abs(rawMousePosition.y - prevPosition.y) < 10
        ) {
          return prevPosition;
        }

        return {
          x: lerp(prevPosition.x, rawMousePosition.x, smoothingFactor),
          y: lerp(prevPosition.y, rawMousePosition.y, smoothingFactor),
        };
      });

      animationFrameId = requestAnimationFrame(smoothPosition);
    };

    smoothPosition();

    return () => cancelAnimationFrame(animationFrameId);
  }, [rawMousePosition, smoothingFactor]);

  return smoothedPosition;
};

function lerp(prev: number, cur: number, factor: number) {
  const distance = Math.sqrt(Math.abs(prev - cur));
  const f = factor * (distance && 1 - 1 / distance);

  return (1 - f) * prev + f * cur;
}

export default useSmoothMousePosition;
