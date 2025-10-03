import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';


//Investigar sobre los DTO y usarlos a la hora de los create y update en la base de datos
//Revisar tema de los errores, en vez de erroes internos 500 devolver mayor informacion del error con un error http


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':rut')
  getOne(@Param('rut') rut: string) {
    return this.usersService.findOne(rut);
  }

  @Post()
  create(@Body() body: { rut: string; email: string; rol: string }) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}