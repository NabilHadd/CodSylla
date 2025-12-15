import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SyllabusService } from 'src/syllabus/syllabus.service';
import { AdvanceService } from 'src/advance/advance.service';
import { UsersService } from 'src/users/users.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { PlanificationService } from 'src/planification/planification.service';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService,
    private readonly  syllabusService: SyllabusService,
    private readonly advanceService: AdvanceService,
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly planService: PlanificationService
  ) {}

  /**
   * Valida las credenciales contra el endpoint externo
   */
  async validateUser(email: string, password: string) {

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
        //Si el usuario no existe se debe crear el usuario y luego generar inmediatamente la 
        //planificación curricular provisional, por lo que se llama a generarPlanificacion

        console.log("no existe el usuario");


        await this.usersService.create({
          user: { rut: data.rut, email: "default", rol: "alumno" },
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
        //luego hay que pensar la logica para el tema de los ranking
      }

      const payload = {
          rut: data.rut,
          carreras: data.carreras,
          rol: userRole,
          isAdmin: admin
      };

      const token = this.jwtService.sign(payload)


      //TODO ESTE CODIGO DEBE SER TRANSFERIDO......
      //Y REPENSADO HAY QUE TENER COMO OBJETIVO RELLENAR LA BASE DE DATOS MAS QUE NADA.

      //---------------------------------------


      // Si es exitoso, devolvemos los datos del usuario
      //const root_advance = await this.advanceService.getAdvance(data.rut, data.carreras[0].codigo)
      //const root_syll = await this.syllabusService.getSyllabus(data.carreras[0].codigo, data.carreras[0].catalogo)

      //const re_syll = root_syll[0]
      //const syll = root_syll[1]

      //const aprobados = root_advance[0]
      //const advance = root_advance[1]

      //nombres de los aprobados
      //const nombres = aprobados.aprobados.map(r => (syll.find(ra => (ra.codigo == r)))).filter(r => r != null).map(r => r.asignatura)
      //codigo de los aprobados
      //const codigos = aprobados.aprobados.map(r => (syll.find(ra => (ra.codigo == r)))).filter(r => r != null).map(r => r.codigo)

      //codigos de los pendientes
      //const pendientes = syll.filter(r => codigos.includes(r.codigo))


      //tengo los ramos reprobados y tengo la malla reconstruida, filtrar los ramos que estan reprobados.
      //Estoy identificando a la perfeccion los ramos pendientes pero no se que hacer con ramos como: formacion general valorica y los ramos de minor, Tendria que hardcodearlo pero esta dificil.


      return {
        success: true,
        admin: admin,
        rol: userRole,
        token,
        //rut: data.rut,
        //carreras: data.carreras,
        //avance: advance,
        //aprobados: aprobados,
        //syllabus: syll,
        //pendientes: pendientes,
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
