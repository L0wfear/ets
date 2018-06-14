import { withHandlers, compose, withState, shouldUpdate } from 'recompose';
import { createValidDate, createValidDateTime } from 'utils/dates';

export const onChangeWithKeys = compose(
  shouldUpdate((props, nextProps) => Object.entries(nextProps).some(([key, value]) => {
    if (key === 'boundKeys') {
      const { boundKeys: new_boundKeys = [] } = nextProps;
      const { boundKeys: old_boundKeys = [] } = props;

      return new_boundKeys.some((b_value, i) => old_boundKeys[i] !== b_value);
    }

    return value !== props[key];
  })),
  withHandlers({
    onChange: ({ onChange, boundKeys = []}) => (e, ...other) => onChange(...boundKeys, e, ...other),
  })
);

export const onChangeWithKeyOfObject = withHandlers({
  onChange: ({ onChange, boundKey = '' }) => (e, ...other) => onChange({ [boundKey]: e, ...other }),
});

export const onClickWithKeys = withHandlers({
  onClick: ({ onClick, boundKeys = []}) => e => onClick(...boundKeys, e),
});

export const tabable = compose(
  withState('tabKey', 'setTabKey'),
  withHandlers({ handleTabSelect: ({ setTabKey }) => (key1, key2) => setTabKey(typeof key1 === 'string' ? key1 : key2) }),
);

/**
 * Input fields enhacers
 */
export const dateTimeFormatter = withHandlers({
  onChange: ({ time = true, onChange }) => eventValue => {
    const validationFunction = time ? createValidDateTime : createValidDate;
    onChange(validationFunction(eventValue));
  },
});

export const multiSelectFormatter = withHandlers({
  onChange: ({ onChange, delimiter = ',', integer = false }) => (eventValue = []) => {
    const itemList = eventValue
      .map(item => integer ? parseInt(item, 10) : item);
    onChange(itemList);
  },
});

export interface IOnChangeWithKeyOfObject {
  boundKey: string;
}