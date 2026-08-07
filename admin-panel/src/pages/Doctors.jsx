import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function Doctors() {
  return <CollectionManager config={entityConfigs.doctors} />;
}
