import { PingResponse } from "@juice11-micro/contracts";
import { Controller, Get } from "@nestjs/common";
import { CatalogGrpc } from "./catalog.client.js";



@Controller('catalog')
export class CatalogController {

  constructor(
    private readonly wrapper: CatalogGrpc,
  ) { }

  @Get('ping')
  async register(): Promise<PingResponse> {
    return this.wrapper.getClient('catalog').ping({});
  }


}
