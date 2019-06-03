import * as React from 'react';

export type WithElementFromArrayProps = {
  array: any[];
  startIndex?: number;
};

const withElementFromArray = (Component: React.ComponentType<any>) => React.memo<any>(
  (props) => {
    const [data, setData] = React.useState(
      () => ({
        index: props.startIndex || 0,
        responses: Array(props.array.length - (props.startIndex || 0)),
      }),
    );

    const element = React.useMemo(
      () => {
        return props.array[data.index];
      },
      [data.index, props.array],
    );

    const onHide = React.useCallback(
      (result) => {
        if (data.index === props.array.length - 1) {
          props.onHide([...data.responses, result]);
        } else {
          setData(
            (oldData) => ({
              index: oldData.index + 1,
              responses: [...oldData.responses, result],
            }),
          );
        }
      },
      [props.onHide, data, props.array],
    );

    return (
      <Component
        children={props.children}
        element={element}
        onHide={onHide}
      />
    );
  },
);

export default withElementFromArray;
