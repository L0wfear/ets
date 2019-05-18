import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import { DropdownWrap } from './styled';
import { MenuItem } from 'react-bootstrap';
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

  return (
    <React.Fragment>
      <DropdownWrap key="print" id="dropdown-print" pullRight>
        <EtsBootstrap.DropdownToggle noCaret bsSize="small">
          <EtsBootstrap.Glyphicon glyph="download-alt" />
        </EtsBootstrap.DropdownToggle>
        <EtsBootstrap.DropdownMenu>
          <MenuItem eventKey="byDate" onSelect={showPrintForm}>
            Журнал путевых листов (ТМФ №8)
          </MenuItem>
          <MenuItem eventKey="interval" onSelect={showPrintForm}>
            Отчет по выработке ТС
          </MenuItem>
        </EtsBootstrap.DropdownMenu>
      </DropdownWrap>
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
