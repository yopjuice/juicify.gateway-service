import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard.js";

export const Auth = () => UseGuards(AuthGuard);
