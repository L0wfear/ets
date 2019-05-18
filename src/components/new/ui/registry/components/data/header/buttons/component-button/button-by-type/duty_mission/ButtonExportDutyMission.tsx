import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import PrintByDates from 'components/new/ui/modal/print_by_dates/PrintByDates';

type PropsButtonExportDutyMission = {
  registryKey: string;
  registyLoadPrintForm: any;
  actionChangeGlobalPaylaodInServiceData: any;
};

const ButtonExportDutyMission: React.FC<PropsButtonExportDutyMission> = (props) => {
  const [isOpenModalRemove, setIsOpenModalRemove] = React.useState(false);

  const handleClickOpenForm = React.useCallback(
    () => {
      setIsOpenModalRemove(true);
    },
    [],
  );
  const handleClickCloseForm = React.useCallback(
    () => {
      setIsOpenModalRemove(false);
    },
    [],
  );
  const handleExport = React.useCallback(
    async ({ date_from, date_to }) => {
      const payload = {
        getBlobData: {
          date_from,
          date_to,
        },
      };

      await props.actionChangeGlobalPaylaodInServiceData(props.registryKey, payload, false);
      await props.registyLoadPrintForm(props.registryKey);
      setIsOpenModalRemove(false);
    },
    [],
  );

  return (
    <React.Fragment>
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={handleClickOpenForm}
      >
        <EtsBootstrap.Glyphicon glyph="download-alt" />
      </EtsBootstrap.Button>
      <PrintByDates
        show={isOpenModalRemove}
        onHide={handleClickCloseForm}
        onExport={handleExport}
        title="Печать журнала наряд-заданий"
      />
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
(ButtonExportDutyMission);
