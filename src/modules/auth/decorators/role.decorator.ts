import { SetMetadata } from "@nestjs/common";
import { Role } from "../types/index.js";

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
