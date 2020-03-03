import * as React from 'react';

import WaybillExportForm from './print_form';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type Props = CommonTypesForButton & {};

const ButtonWaybillExport: React.FC<Props> = (props) => {
  const [typeExportForm, setTypeExportForm] = React.useState(null);

  const handleHide = React.useCallback(
    () => {
      setTypeExportForm(null);
    },
    [],
  );

  const showPrintForm = React.useCallback(
    (eventValue) => {
      setTypeExportForm(eventValue);
    },
    [],
  );

  return (
    <React.Fragment>
      <EtsBootstrap.Dropdown
        id="dropdown-print"

        toggleElement={<EtsBootstrap.Glyphicon glyph="download-alt" />}
        toggleElementSize="small"
      >
        <EtsBootstrap.DropdownMenu pullRight>
          <EtsBootstrap.MenuItem eventKey="byDate" onSelect={showPrintForm}>
            Журнал путевых листов (ТМФ №8)
          </EtsBootstrap.MenuItem>
          <EtsBootstrap.MenuItem eventKey="interval" onSelect={showPrintForm}>
            Отчет по выработке ТС
          </EtsBootstrap.MenuItem>
        </EtsBootstrap.DropdownMenu>
      </EtsBootstrap.Dropdown>
      {
        typeExportForm && (
          <WaybillExportForm
            typeExportForm={typeExportForm}
            handleHide={handleHide}
            registryKey={props.registryKey}
          />
        )
      }
    </React.Fragment>
  );
};

export default ButtonWaybillExport;
