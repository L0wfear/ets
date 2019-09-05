import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { TypeDownload } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { promiseLoadOrderBlobAndSave } from 'redux-main/reducers/modules/order/order_promise';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type Props = CommonTypesForButton & {};

const ButtonOrderExport: React.FC<Props> = React.memo(
  (props) => {
    const selectedRow: Order = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const showPrintForm = React.useCallback(
      (eventValue) => {
        promiseLoadOrderBlobAndSave(selectedRow.id, eventValue);
      },
      [selectedRow],
    );
    const disabled = !selectedRow;

    return (
      <EtsBootstrap.Dropdown
        id="dropdown-print"
        disabled={disabled}

        toggleElement={<EtsBootstrap.Glyphicon glyph="download-alt" />}
        toggleElementSize="small"
      >
        <EtsBootstrap.DropdownMenu pullRight>
          <EtsBootstrap.MenuItem eventKey={TypeDownload.old} onSelect={showPrintForm}>
            Скан-копия факсограммы
          </EtsBootstrap.MenuItem>
          <EtsBootstrap.MenuItem eventKey={TypeDownload.new} onSelect={showPrintForm}>
            Расшифровка централизованного задания
          </EtsBootstrap.MenuItem>
        </EtsBootstrap.DropdownMenu>
      </EtsBootstrap.Dropdown>
    );
  },
);

export default ButtonOrderExport;
