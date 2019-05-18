import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import WaybillExportForm from './print_form';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsButtonWaybillExport = {
  registryKey: string;
  registyLoadPrintForm: any;
  actionChangeGlobalPaylaodInServiceData: any;
};

const ButtonWaybillExport: React.FC<PropsButtonWaybillExport> = (props) => {
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

  const toggleElement = <EtsBootstrap.Glyphicon glyph="download-alt" />;

  return (
    <React.Fragment>
      <EtsBootstrap.Dropdown
        id="dropdown-print"

        toggleElement={toggleElement}
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

const mapDispatchToProps = (dispatch: any) => ({
  actionChangeGlobalPaylaodInServiceData: (...arg) => (
    dispatch(
      actionChangeGlobalPaylaodInServiceData(...arg),
    )
  ),
  registyLoadPrintForm: (...arg) => (
    dispatch(
      registyLoadPrintForm(...arg),
    )
  ),
});

export default connect(
  null,
  mapDispatchToProps,
)
(ButtonWaybillExport);
