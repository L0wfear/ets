import * as React from 'react';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ButtonInspectShowActs from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/ButtonInspectShowActs';

type ViewInspectButtonSubmitProps = {
  type: keyof typeof INSPECT_TYPE_FORM;
  handleSubmit: () => any;
  isPermittedToUpdateClose: boolean;
  handleSubmitClosed: () => any;
  handleCloseAct: () => any;
  handleGetAct: () => any;
  handleSaveGetAct: () => any;
  canSave: boolean;

  id: number;
  registryPage: string;
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

  return (
    <React.Fragment>
      {
        props.type === INSPECT_TYPE_FORM.list && (
          <React.Fragment>
            <EtsBootstrap.Button disabled={false} onClick={props.handleSubmit}>Сохранить</EtsBootstrap.Button>
            <ButtonInspectShowActs id={props.id} registryKey={props.registryPage} />
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleSaveGetAct}>Сформировать акт для подписи сторон</EtsBootstrap.Button>
            <EtsBootstrap.Button disabled={!props.canSave} onClick={handleCloseAct}>Завершить проверку</EtsBootstrap.Button>
          </React.Fragment>
        )
      }
      {
        props.type === INSPECT_TYPE_FORM.closed && (
          <React.Fragment>
            {
              props.isPermittedToUpdateClose && (
                <EtsBootstrap.Button disabled={!props.canSave} onClick={handleSubmitClosed}>Сохранить изменения</EtsBootstrap.Button>
              )
            }
            <ButtonInspectShowActs id={props.id} registryKey={props.registryPage} />
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.handleGetAct}>Cформировать акт</EtsBootstrap.Button>
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
};

export default ViewInspectButtonSubmit;
