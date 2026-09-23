import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BusinessRuleViolationError } from "../../../shared/errors/domain-errors.js";
import { UserInfo } from "../types/index.js";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfo => {
    const context = ctx.switchToHttp();
    
    const request = context.getRequest();

    const user = request?.user ?? request?.req?.user;

    if (!user) throw new BusinessRuleViolationError('CurrentUser decorator is used with no guards')

    return user as UserInfo;
  },
);
