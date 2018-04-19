import * as React from 'react';

export const makeReactMessange = message => (
  <div>
    {
      message.split('\n').map((value, indexRow) => (
        <div key={indexRow}>
          {
            value.split('[href]').map((partMessange, indexCol) => {
              if (indexCol % 2 === 0) {
                return <span key={`${indexRow}/${indexCol}`}>{partMessange}</span>;
              }
              return <a key={`${indexRow}/${indexCol}`}href={partMessange}>{partMessange}</a>;
            })
          }
        </div>
        )
      )
    }
  </div>
);

export default{
  makeReactMessange,
};
