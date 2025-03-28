import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger("ProductsService");

    onModuleInit() {
        this.$connect();
        this.logger.log('Connected to the database');

    }
    create(createProductDto: CreateProductDto) {
        return this.product.create({
            data: createProductDto
        });
    }

    async findAll(paginationDto: PaginationDto) {

        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;

        const totalPages = await this.product.count({ where: { available: true } })
        const lastPage = Math.ceil(totalPages / limit);

        return {
            data: await this.product.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { available: true }
            }),
            meta: {
                page: page,
                total: totalPages,
                lastPage: lastPage
            }
        }
    }

    async findOne(id: number) {
        //return id
        const product = await this.product.findUnique({
            where: {
                id: id, available: true
            },
        });

        if (!product) {
            //throw new NotFoundException(`Product with id ${id} not found`)
            //throw new RpcException(`Product with id ${id} not found`)
            throw new RpcException({
                message: `Product with id ${id} not found`,
                status: HttpStatus.NOT_FOUND
            })

        }

        return product
    }

    async update(id: number, updateProductDto: UpdateProductDto) {

        const { id: __, ...data } = updateProductDto

        await this.findOne(id);

        return this.product.update({
            where: { id: id },
            data: data
        })
    }

    /*  async remove(id: number) {

         await this.findOne(id);

         return this.product.delete({
             where: { id: id },
         })

     } */

    async remove(id: number) {

        await this.findOne(id);

        return this.product.update({
            where: { id: id },
            data: { available: false }
        })

    }

    async validateProduct(ids: number[]) {

        //deleted duplicateds id
        const uniqueIds = [...new Set(ids)];

        //find products by id
        const products = await this.product.findMany({
            where: {
                id: {
                    in: uniqueIds
                }
            }
        });

        if (products.length !== uniqueIds.length) {
            throw new RpcException({
                message: `Some products were not found`,
                status: HttpStatus.BAD_REQUEST
            })
        }

        return products;
    }
}
