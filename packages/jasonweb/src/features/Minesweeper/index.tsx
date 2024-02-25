import './styles.scss';

import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
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

  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24">
      <div className="mt-8 max-w-screen-xl mx-auto">
        <NavLink to="..">
          <button type="button" aria-label="back">
            Back
          </button>
        </NavLink>
      </div>
      <div className="mt-40" ref={vueComponentRef} />
    </div>
  );
}

Component.displayName = 'Minesweeper';
