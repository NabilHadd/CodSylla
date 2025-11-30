import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PreramosRepository{
    constructor(private readonly prisma: PrismaService){}

    async findPreramos(codigo_ramo: string){
        const preramos = await this.prisma.prerequisitos.findMany({
            where:{
                codigo_ramo: codigo_ramo,
            },
        });

        return preramos? preramos : [];
        
    }

    async findPreramosCodes(codigo_ramo: string){
        const preramos = await this.prisma.prerequisitos.findMany({
          where: { codigo_ramo }
        });

        return preramos ? preramos.map(p => p.codigo_preramo): [];
    }

}