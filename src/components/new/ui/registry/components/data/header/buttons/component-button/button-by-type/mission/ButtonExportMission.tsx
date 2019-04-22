import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import PrintForm from 'components/missions/common/PrintForm';

type PropsButtonExportMission = {
  registryKey: string;
  registyLoadPrintForm: any;
  actionChangeGlobalPaylaodInServiceData: any;
};

const ButtonExportMission: React.FC<PropsButtonExportMission> = (props) => {
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
      <Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={handleClickOpenForm}
      >
        <Glyphicon glyph="download-alt" />
      </Button>
      <PrintForm
        show={isOpenModalRemove}
        onHide={handleClickCloseForm}
        onExport={handleExport}
        title="Печать журнала заданий"
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
(ButtonExportMission);
