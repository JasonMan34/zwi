import './styles.scss';

import { useEffect, useRef } from 'react';
import { createApp } from 'vue';

import Minesweeper from './vue/Minesweeper/Minesweeper.vue'; // Import your Vue component

export function Component() {
  const vueComponentRef = useRef(null);

  useEffect(() => {
    // Mount the Vue component when the component is mounted
    const ms = createApp(Minesweeper);
    ms.mount(vueComponentRef.current!);

    // Ensure to destroy the Vue component when the React component is unmounted
    return () => ms.unmount();
  }, []);

  return <div className="mt-24" ref={vueComponentRef} />;
}

Component.displayName = 'Minesweeper';
