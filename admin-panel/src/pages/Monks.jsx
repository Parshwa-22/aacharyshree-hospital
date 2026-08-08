import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function Monks() {
  return <CollectionManager config={entityConfigs.monks} />;
}
