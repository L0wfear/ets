import * as React from 'react';
import { get } from 'lodash';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { registryCheckLine } from 'components/new/ui/registry/module/actions-registy';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = CommontTdTiteProps;

const CheckboxTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const [onClickStatus, setOnClick] = React.useState({ status: false, id: null });
    const dispatch = etsUseDispatch();
    const isChecked = etsUseSelector(
      (state) => (
        Boolean(
          get(
            getListData(state.registry, props.registryKey).data.checkedRows,
            props.rowData[getListData(state.registry, props.registryKey).data.uniqKey],
            false,
          ),
        )
      ),
    );

    const handleClick = React.useCallback(
      () => {
        setOnClick(
          (oldState) => {
            clearTimeout(oldState.id);
            const id = setTimeout(
              () => {
                setOnClick({ status: false, id: null });
              },
              300,
            );

            return {
              status: true,
              id,
            };
          },
        );

        if (!onClickStatus.status) {
          dispatch(
            registryCheckLine(
              props.registryKey,
              props.rowData,
            ),
          );
        }
      },
      [dispatch, props.rowData, props.registryKey, onClickStatus],
    );

    const handleDoubleClick = React.useCallback(
      (event) => {
        if (onClickStatus.status) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      [onClickStatus],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td onClick={handleClick} id={props.id} onDoubleClick={handleDoubleClick}>
        <ExtField
          type="boolean"
          error={false}
          label={false}
          value={isChecked}
          className="pointer"
        />
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default CheckboxTdTitle;
