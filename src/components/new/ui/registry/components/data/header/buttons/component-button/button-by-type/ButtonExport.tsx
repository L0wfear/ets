import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

type PropsButtonExport = {
  registryKey: string;
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
};

class ButtonExport extends React.PureComponent<PropsButtonExport, {}> {
  render() {
    return (
      <Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={this.props.handleClick}
      >
        <Glyphicon glyph="download-alt" />
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleClick: () => (
    dispatch(
      registyLoadPrintForm(registryKey),
    )
  ),
});

export default connect(
  null,
  mapDispatchToProps,
)
(ButtonExport);
