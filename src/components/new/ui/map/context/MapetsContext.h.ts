import Map from 'ol/Map';

export type MapByKeysType = {
  [key: string]: Map,
};

export type SetMapToContextType = (key: string, map: Map) => void;
export type RemoveMapToContextType = (key: string) => void;
export type GetMapImageInBase64ByKeyType = (key: string) => Promise<{ image: any; canvas: HTMLCanvasElement }>;

export type StateMapEtsProvider = {
  mapByKeys: MapByKeysType,
  setMapToContext: SetMapToContextType;
  removeMapToContext: RemoveMapToContextType;
  getMapImageInBase64ByKey: GetMapImageInBase64ByKeyType;
};
