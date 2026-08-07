import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function Counters() {
  return <CollectionManager config={entityConfigs.counters} />;
}
