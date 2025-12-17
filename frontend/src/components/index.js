//carpeta utils
export { default as Header } from "./Utils/Header";
export { default as SideMenu } from "./Utils/SideMenu";
export { default as Footer } from "./Utils/Footer";
export { default as RestrictedAcces } from "./Utils/RestrictedAcces";
export { default as Loading } from "./Utils/Loading";
export { default as Toast } from "./Utils/Toast";


//carpeta form 
export {default as Casilla} from './Form/Casilla';
export {default as Nivel} from './Form/Nivel';
export {default as RamoForm} from './Form/RamoForm';


//carpeta planificacion
export {default as Plan} from './Planificacion/PLan';
export {default as Ramo} from './Planificacion/Ramo';
export {default as Semestre} from './Planificacion/Semestre';


//carpeta PrintedPlan
export {default as PrintedPlan} from './PrintedPlan/PrintedPlan';
export {default as PrintedRamo} from './PrintedPlan/PrintedRamo';
export {default as PrintedSem} from './PrintedPlan/PrintedSem';

//Ranking 
export {default as RankingBar} from './RankingBar';

export {default as SimulRamos} from './SimulRamos';


export {default as Tabla} from './Tabla'

export const IStateRamo = {
    APROBADO:   'APROBADO',
    REPROBADO:  'REPROBADO',
    INSCRITO:   'INSCRITO',
}


export const IColor = {
    RED:    'red',
    BLUE:   'blue',
    GREEN:  'green',
    YELLOW: 'yellow',
}


export const IToastType = {
  SUCCESS:  'success',
  INFO:     'info',
  ERROR:    'error',
  WARNING:  'warning',
}


export const ILabel = {
    PRIORITY:   'priority',
    POSTPONED:  'postponed',
    REPROBED:   'reprobed',
    RAMOS:      'ramos',
}
