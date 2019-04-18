import * as React from 'react';

import Title from 'components/new/ui/registry/components/data/header/title/Title';
import SelecteToMfRtFt from './middle/SelecteToMfRtFt';
import ButtonsToMfRtFtWrap from './buttons/ButtonsToMfRtFtWrap';
import { EtsHeaderContainerSelectForTechnicalOperationRelations } from './styled';

type SelectForTechnicalOperationRelationsStateProps = {
};
type SelectForTechnicalOperationRelationsDispatchProps = {};
type SelectForTechnicalOperationRelationsOwnProps = {
  registryKey: string;
};
type SelectForTechnicalOperationRelationsMergedProps = (
  SelectForTechnicalOperationRelationsStateProps
  & SelectForTechnicalOperationRelationsDispatchProps
  & SelectForTechnicalOperationRelationsOwnProps
);
type SelectForTechnicalOperationRelationsProps = SelectForTechnicalOperationRelationsMergedProps;

const SelectForTechnicalOperationRelations: React.FC<SelectForTechnicalOperationRelationsProps> = React.memo(
  (props) => {
    return (
      <EtsHeaderContainerSelectForTechnicalOperationRelations>
        <Title registryKey={props.registryKey} />
        <SelecteToMfRtFt registryKey={props.registryKey} />
        <ButtonsToMfRtFtWrap registryKey={props.registryKey} />
      </EtsHeaderContainerSelectForTechnicalOperationRelations>
    );
  },
);

export default SelectForTechnicalOperationRelations;
