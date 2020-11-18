import { Injectable, OnModuleInit } from "@nestjs/common"

@Injectable()
export class InitHook implements OnModuleInit {
  onModuleInit() {
    console.log(`The module has been initialized.`)
  }
}
