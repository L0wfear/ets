import * as React from 'react';

const expression = /(https|http)?:\/\/(((www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const urlRegex = new RegExp(expression);

export const makeReactMessage = (messageRaw) => {
  const message = messageRaw.replace(/\[href\]/g, '').replace(urlRegex, (url) => `[href]${url}[href]`);

  return (
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
        ))
      }
    </div>
  );
};
