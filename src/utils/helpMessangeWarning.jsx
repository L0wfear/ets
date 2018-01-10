import * as React from 'react';

export const makeReactMessange = (m) => {
  const partM = m.split('[href]');

  return (
    <div>
      {partM.map((om, i) => {
        if (i % 2 === 0) {
          return <span>{om}</span>;
        }
        return <a href={om}>{om}</a>;
      })}
    </div>
  );
};

export default{
  makeReactMessange,
};
