import { withHandlers, compose, withState } from 'recompose';
import { createValidDate, createValidDateTime } from 'utils/dates';

export const onChangeWithKeys = withHandlers({
  onChange: ({ onChange, boundKeys = []}) => e => onChange(...boundKeys, e),
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
  onChange: ({ onChange, delimiter = ',', integer = false }) => (eventValue = '') => {
    if (eventValue === '') {
      onChange([]);
      return;
    }

    const itemList = eventValue
      .split(delimiter)
      .map(item => integer ? parseInt(item, 10) : item);
    onChange(itemList);
  },
});
