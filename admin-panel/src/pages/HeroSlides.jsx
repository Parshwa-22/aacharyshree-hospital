import CollectionManager from "../components/collection/CollectionManager";
import { entityConfigs } from "../config/entityConfigs";

export default function HeroSlides() {
  return <CollectionManager config={entityConfigs.hero} />;
}
