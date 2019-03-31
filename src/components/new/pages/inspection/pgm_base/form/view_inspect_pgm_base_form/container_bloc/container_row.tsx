import * as React from 'react';
import { CheckContainerRow, CheckContainerTd, ButtonBlock } from '../styled/ViewInspectPgmBaseStyled';
import { Button, Glyphicon } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';

type ContainerRowProps = {
  container: any;
  onEditContainer: (container: any) => void;
  onRemoveContainer: (container: any) => void;
  isPermittedChangeListParams: boolean;
};

const ContainerRow: React.FC<ContainerRowProps> = (props) => {
  const { container } = props;

  const handleEditContainer = React.useCallback(
    () => {
      props.onEditContainer(props.container);
    },
    [props.container],
  );

  const handleRemoveContainer = React.useCallback(
    () => {
      props.onRemoveContainer(props.container);
    },
    [props.container],
  );

  return (
    <CheckContainerRow>
      <CheckContainerTd>
        {container.number}
      </CheckContainerTd>
      <CheckContainerTd>
        На {container.updated_at_date}
      </CheckContainerTd>
      {
        props.isPermittedChangeListParams
          ? (
            <CheckContainerTd>
              <ButtonBlock>
                <Button bsSize="small" onClick={handleEditContainer}>
                  <Glyphicon glyph="pencil" />
                </Button>
                <Button bsSize="small" disabled onClick={handleRemoveContainer}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonBlock>
            </CheckContainerTd>
          )
          : (
            <DivNone />
          )
      }
    </CheckContainerRow>
  );
};

export default ContainerRow;
