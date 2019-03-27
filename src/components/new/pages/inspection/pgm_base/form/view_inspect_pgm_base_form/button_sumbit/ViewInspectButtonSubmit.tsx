import * as React from 'react';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import { Button } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';

type ViewInspectButtonSubmitProps = {
  type: keyof typeof INSPECT_PGM_BASE_TYPE_FORM;
  handleSubmit: () => any;
  handleCloseAndPgmBaseAct: () => any;
  handleGetPgmBaseAct: () => any;
  canSave: boolean;
};

export const ViewInspectButtonSubmit: React.FC<ViewInspectButtonSubmitProps> = (props) => {
  if (props.type === INSPECT_PGM_BASE_TYPE_FORM.list) {
    return (
      <Button disabled={!props.canSave} onClick={props.handleSubmit}>Сохранить</Button>
    );
  }

  if (props.type === INSPECT_PGM_BASE_TYPE_FORM.close) {
    return (
      <Button disabled={!props.canSave} onClick={props.handleCloseAndPgmBaseAct}>Завершить проверку и сформировать акт</Button>
    );
  }

  if (props.type === INSPECT_PGM_BASE_TYPE_FORM.closed) {
    return (
      <Button disabled={!props.canSave} onClick={props.handleGetPgmBaseAct}>Cформировать акт</Button>
    );
  }

  return (
    <DivNone />
  );
};

export default ViewInspectButtonSubmit;
