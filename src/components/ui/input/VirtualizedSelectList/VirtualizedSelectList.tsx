import * as React from 'react';
import { List } from 'react-virtualized';
import { VirtualizedOption } from './styled/styled';

const styleList = { width: '100%' };

const VirtualizedSelectList = (props: any) => {
  const rows = props.children;
  const rowRenderer = ({ key, index, style }) => (
    <VirtualizedOption title={props.options[index].label} key={key} style={style}>{rows[index]}</VirtualizedOption>
  );
  const rowHeight = 36;
  const optionsCount = props.options.length - props.getValue().length;
  const menuHeight = optionsCount < 10
    ? (optionsCount) * rowHeight
    : rowHeight * 10;

  return (
    <List
      style={styleList}
      width={800}
      height={menuHeight}
      rowHeight={rowHeight}
      rowCount={optionsCount}
      rowRenderer={rowRenderer}
    />
  );
};

export default React.memo(VirtualizedSelectList);
