import { Store } from 'flummox';

let notTime = true;

export default class LoadingStore extends (Store as any) {
  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    const missionsActons = flux.getActions('missions');

    this.reg(
      false,
      repairActions.getRepairListByType,
      repairActions.getObjectProperty,
      repairActions.programRegistry,
      repairActions.programObject,
      repairActions.removeProgramObject,
      repairActions.programRemark,
      repairActions.removeProgramRemark,
      repairActions.rejectRemarks,
      repairActions.fixRemarks,
      repairActions.postDataToUpdateObjectPercent,
      repairActions.getDataAboutObjectById,
      repairActions.removePercent,
      repairActions.programRegistryPost,
      repairActions.programVersionPut,
      repairActions.programVersionPutOnlyFiles,
      repairActions.programVersionCreateVersion,
      repairActions.programVersionSendToReview,
      repairActions.programVersionSendToApply,
      repairActions.programVersionSendToCansel,
      repairActions.programVersionSendToClose,
      repairActions.programVersionSendFor,

      missionsActons.createMissions,
    );

    this.state = {
      operationsCount: 0,
    };
  }

  reg(lazy, ...actions) {
    actions.forEach((action) =>
      this.registerAsync(
        action,
        () => this.inc(),
        () => this.dec(),
        () => this.dec(),
      ),
    );
  }

  inc() {
    let { operationsCount } = this.state;
    operationsCount += 1;
    this.setState({ operationsCount });
  }

  dec() {
    let { operationsCount } = this.state;
    operationsCount -= 1;
    this.setState({ operationsCount });
  }

  isLoading() {
    if (__DEVELOPMENT__) {
      if (this.state.operationsCount > 0 && notTime) {
        console.time('----> timeLoad'); // eslint-disable-line
        notTime = false;
      }
      if (this.state.operationsCount === 0 && !notTime) {
        console.timeEnd('----> timeLoad'); // eslint-disable-line
        notTime = true;
      }
    }
    return this.state.operationsCount > 0;
  }
}
