import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

type ButtonExportFiltredDataProps = {
  registryKey: string;
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
};

const ButtonExportFiltredData: React.FC<ButtonExportFiltredDataProps> = React.memo(
  (props) => {
    return (
      <Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={props.handleClick}
      >
        <Glyphicon glyph="download-alt" />
      </Button>
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
