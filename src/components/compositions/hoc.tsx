import { withHandlers, compose, withState } from 'recompose';
import { createValidDate, createValidDateTime } from 'utils/dates';

export const onChangeWithKeys = withHandlers({
  onChange: props => e => props.onChange(...props.boundKeys, e),
});

export const onClickWithKeys = withHandlers({
  onClick: props => e => props.onClick(...props.boundKeys, e),
});

export const tabable = compose(
  withState('tabKey', 'setTabKey', ({ defaultTabKey = '1' }) => defaultTabKey),
  withHandlers({ handleTabSelect: ({ setTabKey }) => (key1, key2) => setTabKey(typeof key1 === 'string' ? key1 : key2) })
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

export const fileFormatter = withHandlers({
  onChange: ({ onChange }) => e => {
    const nativeArray = [];

    for (const file of e.target.file) {
      nativeArray.push(file);
    }

    onChange(nativeArray);
  },
});
