import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { PlanificationService } from 'src/planification/planification.service';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly planService: PlanificationService
  ) {}

  async validateUser(email: string, password: string) {


    const user_aux = await this.usersService.findByEmail(email);
    if(user_aux && user_aux.rol === 'admin'){

      const payload = {
          rut: user_aux.rut,
          carreras: [],
          rol: user_aux.rol,
          isAdmin: true
      };

      const token = this.jwtService.sign(payload)


      return ({
        success: true,
        admin: true,
        rol: user_aux.rol,
        token,
      })
    }

    const url = `https://puclaro.ucn.cl/eross/avance/login.php?email=${email}&password=${password}`;
    let admin = false
    let userRole = 'alumno';

    try {
      // Hacemos la petición GET usando axios integrado con NestJS
      const response = await firstValueFrom(this.httpService.get(url));

      const data = response.data;

      // Si la respuesta tiene "error", devolvemos null
      if (data.error) {return { success: false, message: data.error };}



      const user = await this.usersService.findOne(data.rut)

      if(user) {
        console.log("existe el usuario");
        userRole = user.rol ?? 'alumno';
        admin = (userRole !== "alumno");
        
        this.adminService.updateAuditLog({
          rut: data.rut,
          accion: 'Usuario logeado'
        })
      } else {

        console.log("no existe el usuario");


        await this.usersService.create({
          user: { rut: data.rut, email: email, rol: "alumno" },
          carrera: {
            codigo: data.carreras[0].codigo,
            catalogo: data.carreras[0].catalogo,
            nombre: data.carreras[0].nombre
          }
        });

        //se actualiza el auditlog.
        this.adminService.updateAuditLog({
            rut: data.rut,
            accion: 'Usuario registrado'
        })

        //se genera la planificacion provisional
        await this.planService.generarPlan({
          rut: data.rut,
          carrera: {
            codigo: data.carreras[0].codigo,
            catalogo: data.carreras[0].catalogo,
            nombre: data.carreras[0].nombre
          },
        });
      }

      const payload = {
          rut: data.rut,
          carreras: data.carreras,
          rol: userRole,
          isAdmin: admin
      };

      const token = this.jwtService.sign(payload)

      return {
        success: true,
        admin: admin,
        rol: userRole,
        token
      };

    } catch (error) {
      // Si la API externa falla (timeout, caida, etc.)
      return {
        success: false,
        message: 'Error al conectar con el servicio externo',
        details: error.message,
      };
    }
  }
}
