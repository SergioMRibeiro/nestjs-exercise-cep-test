import { Module } from "@nestjs/common";
import { AddressService } from "../services/address.service";

@Module({
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}