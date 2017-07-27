import { withHandlers, compose, withState } from 'recompose';

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
