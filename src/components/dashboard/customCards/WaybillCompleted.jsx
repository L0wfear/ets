import WaybillInProgress from './WaybillInProgress.jsx';

export default class WaybillCompleted extends WaybillInProgress {
  selectItem(i) {
    const {
      count,
    } = this.props;

    this.setState({ selectedItem: null });
    setTimeout(() => {
      if (!!count) {
        if (typeof i === 'number') {
          this.context.flux.getActions('dashboard').getWaybillCompleted().then(waybillSubItems => this.setState({ waybillSubItems }));
        }
        this.props.openSubitemsList(i === null);
      }
    }, 50);
  }
}
