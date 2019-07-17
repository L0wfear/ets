import * as React from 'react';
import { CheckContainerRow, CheckContainerTd, ButtonBlock } from 'components/new/pages/inspection/common_components/form_wrap_check/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ContainerRowProps = {
  container: any;
  onEditContainer: (container: any) => void;
  onRemoveContainer: (container: any) => void;
  isPermittedChangeListParams: boolean;

  inspectIsClosed: boolean;
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
    <CheckContainerRow was_resaved={container.was_resaved}>
      <CheckContainerTd>
        {container.number}
      </CheckContainerTd>
      <CheckContainerTd>
        На {container.updated_at_date}
      </CheckContainerTd>
      <CheckContainerTd>
        <ButtonBlock>
          {
            props.isPermittedChangeListParams
              ? (
                <React.Fragment>
                  <EtsBootstrap.Button bsSize="small" onClick={handleEditContainer}>
                    <EtsBootstrap.Glyphicon glyph="pencil" />
                  </EtsBootstrap.Button>
                  <EtsBootstrap.Button bsSize="small" onClick={handleRemoveContainer}>
                    <EtsBootstrap.Glyphicon glyph="trash" />
                  </EtsBootstrap.Button>
                </React.Fragment>
              )
              : (
                props.inspectIsClosed && (
                  <EtsBootstrap.Button bsSize="small" onClick={handleEditContainer}>
                    <EtsBootstrap.Glyphicon glyph="search" />
                  </EtsBootstrap.Button>
                )
              )
          }
        </ButtonBlock>
      </CheckContainerTd>
    </CheckContainerRow>
  );
};

export default ContainerRow;
