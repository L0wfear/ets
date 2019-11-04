import { withHandlers, compose, withState, shouldUpdate } from 'recompose';
import { isArray, isFunction } from 'util';

type TypePropsOnChangeWithKeys = {
  boundKeys?: Array<any>;
  [key: string]: any;
};

export const onChangeWithKeys = compose<any, any>(
  shouldUpdate((props: TypePropsOnChangeWithKeys, nextProps: TypePropsOnChangeWithKeys) => Object.entries(nextProps).some(([key, value]) => {
    if (key === 'boundKeys') {
      const { boundKeys: new_boundKeys } = nextProps;
      const { boundKeys: old_boundKeys } = props;
      if (isArray(new_boundKeys)) {
        return new_boundKeys.some((b_value, i) => old_boundKeys[i] !== b_value);
      }

      return new_boundKeys !== old_boundKeys;
    }

    return value !== props[key];
  })),
  withHandlers({
    onChange: ({ onChange, boundKeys = [], ...other}) => (e, ...otherOther) => {
      if (!other.disabled && isFunction(onChange)) {
        if (isArray(boundKeys)) {
          return onChange(...boundKeys, e, ...otherOther);
        } else {
          return onChange(boundKeys, e, ...otherOther);
        }
      }
    },
    onClick: ({ onClick, boundKeys = [], ...other}) => (e, ...otherOther) => {
      if (!other.disabled && isFunction(onClick)) {
        if (isArray(boundKeys)) {
          return onClick(...boundKeys, e, ...otherOther);
        } else {
          return onClick(boundKeys, e, ...otherOther);
        }
      }
    },
  }),
);

export const tabable = compose<any, any>(
  withState('tabKey', 'setTabKey', undefined),
  withHandlers({ handleTabSelect: ({ setTabKey }) => (key1, key2) => setTabKey(typeof key1 === 'string' ? key1 : key2) }),
);
