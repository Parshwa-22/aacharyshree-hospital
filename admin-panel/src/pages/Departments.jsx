import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function Departments() {
  return <CollectionManager config={entityConfigs.departments} />;
}
