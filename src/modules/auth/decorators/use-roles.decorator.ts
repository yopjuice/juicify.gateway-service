import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./role.decorator.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RoleGuard } from "../guards/role.guard.js";
import { Role } from "../types/index.js";


export function UseRoles(roles: Role[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard, RoleGuard),
  );
}
