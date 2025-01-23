import { Module } from "@nestjs/common";
import { AddressService } from "../services/addres.service";

@Module({
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}