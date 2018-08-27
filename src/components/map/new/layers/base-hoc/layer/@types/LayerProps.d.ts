type FuncAddLayerProps = {
  id: number | string;
  zIndex?: number;
  renderMode?: olx.layer.VectorRenderType,
}

declare namespace ETSCore {
  export module Map {
    export module InjectetLayerProps {
      type FuncAddLayer = (props: FuncAddLayerProps) => Promise<{}>;
      type FuncRemoveLayer = () => void;
      type FuncGetVectorSource = () => ol.source.Vector;
      type FuncAddFeaturesToSource = (features: ol.Feature | ol.Feature[]) => void;
      type FuncRemoveFeaturesFromSource = (features: ol.Feature | ol.Feature[] | void, all?: boolean) => void;
      type FuncGetFeatureById = (id: string) => ol.Feature;
      type FuncSetDataInLayer = (name: string, value: any) => void;
      type FuncGetAllFeatures = () => ol.Feature[];



    }
  }
}