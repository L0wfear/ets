import * as React from 'react';
import { List } from 'react-virtualized';
import { isNullOrUndefined } from 'util';

import { VirtualizedOption } from './styled/styled';
import { NoOptionsMessage } from 'components/old/ui/input/ReactSelect/styled/styled';

const styleList = { width: '100%' };

const VirtualizedSelectList = (props: any) => {
  const rows = props.children;
  const noOptionsMessage = props.noOptionsMessage();
  const rowRenderer = ({ key, index, style }) => (
    isNullOrUndefined(rows.length)
      ? <NoOptionsMessage {...props}>{noOptionsMessage}</NoOptionsMessage>
      : <VirtualizedOption title={props.options[index].label} key={key} style={style}>{rows[index]}</VirtualizedOption>
  );
  const rowHeight = 36;
  const optionsCount = props.options.length - props.getValue().length;
  const rowCount = isNullOrUndefined(rows.length)
    ? 1
    : !isNullOrUndefined(rows.length) && rows.length < 10
      ? rows.length
      : optionsCount;

  const menuHeight = ( optionsCount < 10 || rows.length < 10 || isNullOrUndefined(rows.length) )
    ? rowCount * rowHeight
    : rowHeight * 10;

  return (
    <List
      style={styleList}
      width={800}
      height={menuHeight}
      rowHeight={rowHeight}
      rowCount={rowCount}
      rowRenderer={rowRenderer}
    />
  );
};

export default React.memo(VirtualizedSelectList);
