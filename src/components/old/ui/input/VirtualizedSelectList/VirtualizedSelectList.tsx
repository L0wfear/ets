import * as React from 'react';
import { List } from 'react-virtualized';
import { VirtualizedOption } from './styled/styled';
import { getMultiValueId } from 'components/old/ui/input/ReactSelect/utils';

type Props = {
  children: Array<any>; // Возможно реакт
  id: string;
  modalKey: string;

  [k: string]: any;
};

const styleList = {
  width: '100%',
};
const rowHeight = 36;

const VirtualizedSelectList = React.memo(
  (props: Props) => {
    const rows = props.children;
    const rowRenderer = ({ key, index, style }) => (
      <VirtualizedOption
        id={`react-select-${getMultiValueId(props.id, props.modalKey, rows?.[index]?.value)}`}
        title={rows[index].label}
        key={key}
        style={style}
      >
        {rows[index]}
      </VirtualizedOption>
    );

    const childrenCount = rows.length;
    const menuHeight = rowHeight * 10;

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
  },
);

export default VirtualizedSelectList;
