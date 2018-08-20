declare namespace ETSCore {
  module Map {
    module InjectetLayerProps {
      type FuncAddLayer = (props: any) => Promise<{}>;
      type FuncRemoveLayer = () => void;
      type FuncAddFeaturesToSource = (features: ol.Feature | ol.Feature[]) => void;
      type FuncRemoveFeaturesFromSource = (features: ol.Feature | ol.Feature[] | void, all?: boolean) => void;
      type FuncGetFeatureById = (id: string) => ol.Feature;
      type FuncSetDataInLayer = (name: string, value: any) => void;
      type FuncGetAllFeatures = () => ol.Feature[];


      type FuncHideFeatures = (features: ol.Feature | ol.Feature[]) => void;

    }
  }
}