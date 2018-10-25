import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import whitPreloader from 'components/ui/new/preloader/hoc/with-preloader/whitPreloader';


type PropsModalBodyPreloader = {
  typePreloader?: 'mainpage' | 'graph' | 'field' | 'lazy' | void;
  path?: string;
  page?: string;
};

class ModalBodyPreloader extends React.Component<PropsModalBodyPreloader, {}> {
  render() {
    return (
      <Modal.Body {...this.props}>
        {this.props.children}
      </Modal.Body>
    )
  }
}

export default whitPreloader({})(ModalBodyPreloader);