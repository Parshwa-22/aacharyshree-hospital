import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function Contacts() {
  return <CollectionManager config={entityConfigs.contacts} />;
}
