import * as React from 'react';
import { isNullOrUndefined } from 'util';

import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type FielNormsHeaderProps = {
  selectedRowIndex: number;
  meta: any[];
  buttonWidth: number;

  formDataKey: FormKeys;
};

const title = 'Использование расходного материала';

const FielNormsHeader: React.FC<FielNormsHeaderProps> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const handleAddRow = React.useCallback(
      () => {
        handleChange({
          norms: [
            ...norms,
            props.meta.reduce((emptyRow, { key, ...other }) => {
              emptyRow[key] = 'default_value' in other ? other.default_value : null;

              return emptyRow;
            }, {}),
          ],
        });
      },
      [handleChange, norms],
    );

    const handleRemoveRow = React.useCallback(
      () => {
        handleChange({
          norms: norms.filter((_, index) => index !== props.selectedRowIndex),
        });
      },
      [props.selectedRowIndex, handleChange, norms],
    );

    return (
      <EtsBootstrap.Row>
        <EtsHeaderContainerWrap>
          <EtsHeaderContainer>
            <EtsHeaderTitle>
              {title}
            </EtsHeaderTitle>
            <EtsButtonsContainer>
              {
                isPermitted
                  && (
                    <React.Fragment>
                      <ButtonTableInput block width={props.buttonWidth} onClick={handleAddRow}>Добавить строку</ButtonTableInput>
                      <ButtonTableInput block width={props.buttonWidth} onClick={handleRemoveRow} disabled={isNullOrUndefined(props.selectedRowIndex)}>Удалить строку</ButtonTableInput>
                    </React.Fragment>
                  )
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
        </EtsHeaderContainerWrap>
      </EtsBootstrap.Row>
    );
  },
);

export default FielNormsHeader;
