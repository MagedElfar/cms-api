import Entity from "./models/entity.model";
import { migration } from "./db/migration";
import Attribute from "./models/attribute.model";
import EntityInstance from "./models/entityInstance.model";
import RefreshToken from "./models/refreshToken.model";
import User from "./models/user.model";

migration([
    User,
    RefreshToken,
    Entity,
    Attribute,
    EntityInstance
])