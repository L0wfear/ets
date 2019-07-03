import * as React from 'react';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { DivNone } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ViewInspectButtonSubmitProps = {
  type: keyof typeof INSPECT_AUTOBASE_TYPE_FORM;
  handleSubmit: () => any;
  isPermittedToUpdateClose: boolean;
  handleSubmitClosed: () => any;
  handleCloseAct: () => any;
  handleGetAct: () => any;
  handleSaveGetAct: () => any;
  canSave: boolean;
};

export const ViewInspectButtonSubmit: React.FC<ViewInspectButtonSubmitProps> = (props) => {

  const handleCloseAct = React.useCallback(
    async () => {
      try {
        await global.confirmDialog({
          title: 'Подтверждение действий',
          body: 'Вы уверены, что хотите завершить проверку?',
          okName: 'Подтвердить',
          cancelName: 'Отмена',
        });
      } catch (error) {
        // no
        return;
      }
      props.handleCloseAct();
    },
    [props.handleCloseAct],
  );
  const handleSubmitClosed = React.useCallback(
    async () => {
      try {
        await global.confirmDialog({
          title: 'Подтверждение действий',
          body: 'Вы уверены, что хотите внести и сохранить изменения?',
          okName: 'Подтвердить',
          cancelName: 'Отмена',
        });
      } catch (error) {
        // no
        return;
      }
      props.handleSubmitClosed();
    },
    [props.handleSubmitClosed],
  );

  if (props.type === INSPECT_AUTOBASE_TYPE_FORM.list) {
    return (
      <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleSubmit}>Сохранить</EtsBootstrap.Button>
    );
  }

  if (props.type === INSPECT_AUTOBASE_TYPE_FORM.close) {
    return (
      <React.Fragment>
        <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleSaveGetAct}>Сформировать акт для подписи сторон</EtsBootstrap.Button>
        <EtsBootstrap.Button disabled={!props.canSave} onClick={handleCloseAct}>Завершить проверку</EtsBootstrap.Button>
      </React.Fragment>
    );
  }

  if (props.type === INSPECT_AUTOBASE_TYPE_FORM.closed) {
    return (
      <React.Fragment>
        {
          props.isPermittedToUpdateClose && (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={handleSubmitClosed}>Сохранить изменения</EtsBootstrap.Button>
          )
        }
        <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleGetAct}>Cформировать акт</EtsBootstrap.Button>
      </React.Fragment>
    );
  }

  return (
    <DivNone />
  );
};

export default ViewInspectButtonSubmit;
