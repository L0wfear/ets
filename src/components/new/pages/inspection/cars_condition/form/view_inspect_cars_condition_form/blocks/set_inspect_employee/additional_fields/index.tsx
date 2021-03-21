import * as React from 'react';
import { ViewInspectCarsConditionProps } from '../../../@types/ViewInspectCarsContidion';
import { ViewInspectAutobaseProps } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/@types/ViewInspectAutobase';
import { ViewInspectPgmBaseProps } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/@types/ViewInspectPgmBase';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { 
  AdditionalFiledsWrapper, 
  AdditionalFiledsAddBtn, 
} from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/additional_fields/styled';
import { HrDelimiter } from 'global-styled/global-styled';
import { CommonDataInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';
import RowAddAdditionalFiledsBlock from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/additional_fields/RowAddAdditionalFiledsBlock';
import styled from 'styled-components';

type AdditionalFiledsProps = {
  isPermittedChangeListParams: boolean;
  additional_fields: CommonDataInspect['additional_fields'];
  handleChange: (
    ViewInspectCarsConditionProps['handleChange']
    | ViewInspectAutobaseProps['handleChange']
    | ViewInspectPgmBaseProps['handleChange']
  );
  page: string;
  path?: string;
};

const OverlayTrigger = styled.div`
  &&& {
    margin-left: 5px;
    display: inline-flex;
    position: absolute;
    bottom: 75%;
  }
`;

const OverlayWarpper = styled.div`
  position: relative;
`;

const AdditionalFileds: React.FC<AdditionalFiledsProps> = React.memo(
  ({isPermittedChangeListParams, additional_fields, handleChange, page, path}) => {
    const isEmpty = React.useMemo(() => !additional_fields.length, [additional_fields])
    const [showAdditionalFileds, setShowAdditionalFileds] = React.useState(!isEmpty);
    const glyph = !showAdditionalFileds ? 'plus' : 'minus';
    
    const toggleShowAdditionalFileds = React.useCallback( () => {
      setShowAdditionalFileds(!showAdditionalFileds);
    },
    [showAdditionalFileds],
    );

    return (
      <AdditionalFiledsWrapper>
        <HrDelimiter />
        <OverlayWarpper>
          <AdditionalFiledsAddBtn
            disabled={!isEmpty}
            onClick={toggleShowAdditionalFileds}
          >
          <EtsBootstrap.Glyphicon glyph={glyph} />
          Добавить дополнительные поля
          </AdditionalFiledsAddBtn>
          <OverlayTrigger>
            <EtsBootstrap.OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={(
                <EtsBootstrap.Popover id={`additional_fields_title-popover`} >
                  {'Вы можете самостоятельно добавить поля для ввода дополнительной информации. Эти поля будут выведены в Акте проверки'}
                </EtsBootstrap.Popover>
              )}
              placement="right">
              <EtsBootstrap.Glyphicon glyph="info-sign" />
            </EtsBootstrap.OverlayTrigger>
          </OverlayTrigger>
        </OverlayWarpper>
        <div>
          {
            isPermittedChangeListParams && showAdditionalFileds && (
              <RowAddAdditionalFiledsBlock
                handleChange={handleChange}
                isPermitted={isPermittedChangeListParams}
                additional_fields={additional_fields}
                page={page}
                path={path}
                selectField="customId"
              />
            )
          }
        </div>
      </AdditionalFiledsWrapper>
    );
  },
);

export default AdditionalFileds;
