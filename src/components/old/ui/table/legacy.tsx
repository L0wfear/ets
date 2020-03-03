import * as React from 'react';

export const renderCarData = ({ data }, props: { localState?: { show_gov_numbers?: boolean; }; }) => {
  const show_gov_numbers = props?.localState?.show_gov_numbers;
  if (!show_gov_numbers) {
    return data?.count;
  }

  const gov_numbers = data?.gov_numbers || [];
  return (
    <div>
      <div><b>{data?.count}{Boolean(gov_numbers.length) ? ':' : ''}</b></div>
      {
        Boolean(gov_numbers.length) && gov_numbers.map((gov_number) => (
          <div key={gov_number}>{gov_number}</div>
        ))
      }
    </div>
  );
};