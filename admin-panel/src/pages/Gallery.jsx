import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";
export default function Gallery() { return <CollectionManager config={entityConfigs.gallery} />; }
