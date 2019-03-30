import { InspectContainer } from "./@types/container";
import { InspectContainerService } from "api/Services";

export const promiseCreateInspectContainer = (inspectContainer: InspectContainer) => {
  return InspectContainerService.post(
    {
      ...inspectContainer,
    },
    false,
    'json',
  );
};

export const promiseUpdateInspectContainer = (inspectContainer: InspectContainer) => {
  return InspectContainerService.path(inspectContainer.id).put(
    {
      ...inspectContainer,
    },
    false,
    'json',
  );
};
