import * as React from 'react';
import { List } from 'react-virtualized';
import { VirtualizedOption } from './styled/styled';

const styleList = { width: '100%' };

const VirtualizedSelectList = (props: any) => {
  const rows = props.children;
  const rowRenderer = ({ key, index, style }) => (
    <VirtualizedOption title={rows[index].label} key={key} style={style}>{rows[index]}</VirtualizedOption>
  );
  const rowHeight = 36;
  const childrenCount = rows.length - props.getValue().length;
  const menuHeight = childrenCount < 10
    ? (childrenCount) * rowHeight
    : rowHeight * 10;

  return (
    <List
      style={styleList}
      width={800}
      height={menuHeight}
      rowHeight={rowHeight}
      rowCount={childrenCount}
      rowRenderer={rowRenderer}
    />
  );
};

export default React.memo(VirtualizedSelectList);
