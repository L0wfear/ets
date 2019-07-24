import * as React from 'react';

import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import WaybillButtonCreateFuelCard from './buttons/WaybillButtonCreateFuelCard';
import WaybillButtonCarRefillAdd from './buttons/WaybillButtonCarRefillAdd';
import WaybillButtonCarRefillRemove from './buttons/WaybillButtonCarRefillRemove';

type WaybillCarRefillHeaderProps = {
  formDataKey: string;
  selectedRowIndex: number;
  setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WaybillCarRefillHeader: React.FC<WaybillCarRefillHeaderProps> = React.memo(
  (props) => {
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey);

    const visibleButtons = (
      !IS_CLOSED
      || canEditIfClose
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Row>
          <EtsHeaderContainer>
            <EtsHeaderTitle>
              Заправка топлива
            </EtsHeaderTitle>
            <EtsButtonsContainer>
              {
                visibleButtons && (
                  <React.Fragment>
                    <WaybillButtonCarRefillAdd formDataKey={props.formDataKey} />
                    <WaybillButtonCarRefillRemove formDataKey={props.formDataKey} selectedRowIndex={props.selectedRowIndex} setSelectedRowIndex={props.setSelectedRowIndex} />
                    <WaybillButtonCreateFuelCard formDataKey={props.formDataKey} />
                  </React.Fragment>
                )
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
        </EtsBootstrap.Row>
      ),
      [
        props,
        visibleButtons,
      ],
    );
  },
);

export default WaybillCarRefillHeader;
