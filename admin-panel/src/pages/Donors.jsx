import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function Donors() {
  return <CollectionManager config={entityConfigs.donors} />;
}
