import * as React from 'react';
import { List } from 'react-virtualized';
import { VirtualizedOption } from './styled/styled';

const VirtualizedSelectList = (props: any) => {
  const rows = props.children;
  const rowRenderer = ({ key, index, style }) => (
    <VirtualizedOption title={props.options[index].label} key={key} style={style}>{rows[index]}</VirtualizedOption>
  );
  const rowHeight = 36;
  const optionsCount = props.options.length - props.getValue().length; // <<< Если нет данных, проверить, что что-то есть!!!
  const menuHeight = optionsCount < 10
    ? (optionsCount) * rowHeight
    : rowHeight * 10;

  return (
    <List
      style={{ width: '100%', }}
      width={800}
      height={menuHeight}
      rowHeight={rowHeight}
      rowCount={optionsCount}
      rowRenderer={rowRenderer}
    />
  );
};

export default React.memo(VirtualizedSelectList);
