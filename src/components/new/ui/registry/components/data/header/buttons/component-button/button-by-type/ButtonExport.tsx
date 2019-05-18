import * as React from 'react';
import { connect } from 'react-redux';
import { registyLoadPrintForm } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsButtonExport = {
  registryKey: string;
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
};

class ButtonExport extends React.PureComponent<PropsButtonExport, {}> {
  render() {
    return (
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={this.props.handleClick}
      >
        <EtsBootstrap.Glyphicon glyph="download-alt" />
      </EtsBootstrap.Button>
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
