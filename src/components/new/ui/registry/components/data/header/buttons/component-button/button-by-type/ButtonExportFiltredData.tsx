import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ButtonExportFiltredDataProps = {
  registryKey: string;
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
};

const ButtonExportFiltredData: React.FC<ButtonExportFiltredDataProps> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={props.handleClick}
      >
        <EtsBootstrap.Glyphicon glyph="download-alt" />
      </EtsBootstrap.Button>
    );
  },
);

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleClick: () => (
    dispatch(
      registyLoadPrintForm(registryKey, true),
    )
  ),
});

export default connect(
  null,
  mapDispatchToProps,
)
(ButtonExportFiltredData);
