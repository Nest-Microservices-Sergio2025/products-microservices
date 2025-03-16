import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    @Type(() => Number)
    @Min(0)
    price: number;
}
