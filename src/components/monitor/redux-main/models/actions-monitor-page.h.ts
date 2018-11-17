export namespace ActionsMonitorPage {
  export type monitorPageRemoveFromSelectedGeoobjects = (
    serverName: string,
    id?: string,
  ) => ({
    type: string,
    payload: {
      serverName: string,
      id: string,
    },
  });
}
