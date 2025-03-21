import { Controller, NotImplementedException, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    //@Post()
    @MessagePattern({ cmd: 'create_products' })
    //create(@Body() createProductDto: CreateProductDto) { Ya no se usaria Body por que es un microservicio
    create(@Payload() createProductDto: CreateProductDto) { // Ahora se usara payload

        return this.productsService.create(createProductDto);
    }

    //@Get()
    @MessagePattern({ cmd: 'find_all' })
    findAll(@Payload() paginationDto: PaginationDto) {
        return this.productsService.findAll(paginationDto);
    }

    //@Get(':id')
    @MessagePattern({ cmd: 'find_one_product' })
    findOne(@Payload('id', ParseIntPipe) id: number) {

        //return {id}
        return this.productsService.findOne(id);
    }

    //@Delete(':id')
    @MessagePattern({ cmd: 'delete_product' })
    remove(@Payload('id') id: string) {
        return this.productsService.remove(+id);
    }


    //@Patch(':id')
    @MessagePattern({ cmd: 'update_product' })
    update(
        /* @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto */
        @Payload() updateProductDto: UpdateProductDto
    ) {

        //return { id: updateProductDto.id, updateProductDto }
        return this.productsService.update(updateProductDto.id, updateProductDto);
    }

    @MessagePattern({ cmd: 'validate_product' })
    validateProduct(@Payload() ids: number[]) {
        //return ids;

        try {
            return this.productsService.validateProduct(ids["productsId"]);

        } catch (error) {
            throw new NotImplementedException(`Error creating products: ${error.message}`);
        }
    }

}
