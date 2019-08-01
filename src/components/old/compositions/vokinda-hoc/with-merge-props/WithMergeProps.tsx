import * as React from 'react';

const WithMergeProps = (funcMergeProps) => (Component) =>
  (props) => <Component { ...funcMergeProps(props) } />;

export default WithMergeProps;
