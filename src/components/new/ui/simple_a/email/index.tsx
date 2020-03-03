import * as React from 'react';

const SimpleEmailA = React.memo(
  ({ title, email }: { title?: string; email: string; }) => (
    <a href={`mailto:${email}`}>{title || email}</a>
  ),
);

export default SimpleEmailA;
