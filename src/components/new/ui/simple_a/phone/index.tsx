import * as React from 'react';

const SimplePhoneA = React.memo(
  ({ title, phone }: { title?: string; phone: string | number; }) => (
    <a href={`tel:${phone}`}>{title || phone}</a>
  ),
);

export default SimplePhoneA;
