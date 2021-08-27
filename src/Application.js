import React from 'react';
import { GrudgeContext } from './GrudgeContext';

import Grudges from './Grudges';
import NewGrudge from './NewGrudge';

const Application = () => {
  const { undo, isPast, redo, isFuture } = React.useContext(GrudgeContext);

  return (
    <div className="Application">
      <NewGrudge />
      <button onClick={undo} disabled={isPast}>
        Undo
      </button>
      <button onClick={redo} disabled={isFuture}>
        Redo
      </button>
      <Grudges />
    </div>
  );
};

export default Application;
