export type MapByKeysType = {
  [key: string]: ol.Map,
};

export type SetMapToContextType = (key: string, map: ol.Map) => void;
export type RemoveMapToContextType = (key: string) => void;
type GetMapImageInBase64ByKeyType = (key: string) => Promise<object>;

export type StateMapEtsProvider = {
  mapByKeys: MapByKeysType,
  setMapToContext: SetMapToContextType;
  removeMapToContext: RemoveMapToContextType;
  getMapImageInBase64ByKey: GetMapImageInBase64ByKeyType;
};
