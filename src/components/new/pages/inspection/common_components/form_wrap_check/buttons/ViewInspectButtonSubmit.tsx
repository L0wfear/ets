import * as React from 'react';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { DivNone } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ViewInspectButtonSubmitProps = {
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  handleSubmit: () => any;
  handleCloseAndGetAct: () => any;
  handleGetAct: () => any;
  canSave: boolean;
};

export const ViewInspectButtonSubmit: React.FC<ViewInspectButtonSubmitProps> = (props) => {
  if (props.type === INSPECT_AUTOBASE_TYPE_FORM.list) {
    return (
      <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleSubmit}>Сохранить</EtsBootstrap.Button>
    );
  }

  if (props.type === INSPECT_AUTOBASE_TYPE_FORM.close) {
    return (
      <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleCloseAndGetAct}>Завершить проверку и сформировать акт</EtsBootstrap.Button>
    );
  }

  if (props.type === INSPECT_AUTOBASE_TYPE_FORM.closed) {
    return (
      <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleGetAct}>Cформировать акт</EtsBootstrap.Button>
    );
  }

  return (
    <DivNone />
  );
};

export default ViewInspectButtonSubmit;
