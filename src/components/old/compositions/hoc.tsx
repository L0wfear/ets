import { withHandlers, compose, withState, shouldUpdate } from 'recompose';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { isArray, isFunction } from 'util';

type TypePropsOnChangeWithKeys = {
  boundKeys?: any[];
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

export const onChangeWithKeyOfObject = withHandlers({
  onChange: ({ onChange, boundKey = '' }) => (e, ...other) => onChange({ [boundKey]: e, ...other }),
});

export const onClickWithKeys = withHandlers({
  onClick: ({ onClick, boundKeys = []}) => (e) => {
    if (isArray(boundKeys)) {
      return onClick(...boundKeys, e);
    } else {
      return onClick(boundKeys, e);
    }
  },
});

export const tabable = compose(
  withState('tabKey', 'setTabKey', undefined),
  withHandlers({ handleTabSelect: ({ setTabKey }) => (key1, key2) => setTabKey(typeof key1 === 'string' ? key1 : key2) }),
);

/**
 * Input fields enhacers
 */
export const dateTimeFormatter = withHandlers({
  onChange: ({ time = true, onChange }) => (eventValue) => {
    const validationFunction = time ? createValidDateTime : createValidDate;
    onChange(validationFunction(eventValue));
  },
});

export const multiSelectFormatter = withHandlers({
  onChange: ({ onChange, delimiter = ',', integer = false }) => (eventValue = []) => {
    const itemList = eventValue
      .map((item) => integer ? parseInt(item, 10) : item);
    onChange(itemList);
  },
});

export interface IOnChangeWithKeyOfObject {
  boundKey: string;
}
