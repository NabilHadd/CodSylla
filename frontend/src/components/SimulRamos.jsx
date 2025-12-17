import React, { useState } from "react";
import RamoForm from "./Form/RamoForm";
import { Button } from "flowbite-react";
import { IStateRamo, IColor} from './index'
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import axios from "axios";


export default function SimulRamos({ ramos, onClose, handleToast}) {


    const [lista, setLista] = useState(ramos);

    const {getHeaderToken} = useAuth();
    const {getBaseUrl} = useApi();
    const baseUrl = getBaseUrl();
    const headerToken = getHeaderToken();
    

    const cambiarEstado = (codigo, nuevoEstado) => {
        setLista(prev =>
            prev.map(r =>
                r.codigo === codigo
                    ? { ...r, estado: nuevoEstado }
                    : r
            )
        );
    };

    const getColorEstado = (estado) => {
        switch (estado.toUpperCase()) {
            case IStateRamo.APROBADO:
                return IColor.GREEN;
            case IStateRamo.REPROBADO:
                return IColor.RED;
            default:
                return IColor.BLUE;
        }
    };


    //Metodo que lee el estado en el que se encuentra cada ramo y lo 
    const updateState = async () => {
        try {
            const payload = lista.map(r => ({
                codigo_ramo: r.codigo,
                estado: r.estado,
            }));

            await axios.post(
                `${baseUrl}/historial/modificar-estado-ramos`,
                { ramos: payload },
                headerToken
            );
            handleToast(true);
        } catch (err) {
            handleToast(false);
        }
    };

    return (
    <>
        <h2 className="text-xl font-bold mb-4">Simulación de Ramos Actuales</h2>

        {lista.map((r) => (
        <div key={r.codigo} className="p-4">
            <RamoForm ramo={r} color={getColorEstado(r.estado)}>
            {buttons(r.estado, (nuevo) => cambiarEstado(r.codigo, nuevo))}
            </RamoForm>
        </div>
        ))}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-between gap-4">
        <Button
            onClick={onClose}
            className="
            flex-1
            bg-rose-100 text-rose-700
            border-2 border-rose-300
            hover:bg-rose-200
            transition-all
            shadow-sm
            "
        >
            Cerrar
        </Button>

        <Button
            onClick={updateState}
            className="
            flex-1
            bg-emerald-100 text-emerald-700
            border-2 border-emerald-300
            hover:bg-emerald-200
            transition-all 
            shadow-sm
            "         
        >
            Guardar
        </Button>
        </div>
    </>
    );
}

function buttons(estado, onChangeEstado) {

    if (!estado) return null;

    const state = estado.toUpperCase();

    return state === IStateRamo.INSCRITO ? (
        <div className="flex gap-2">
            <Button
                color={IColor.GREEN}
                size="xs"
                className="px-3 py-1.5"
                onClick={() => onChangeEstado(IStateRamo.REPROBADO)}
            >
                Reprobado
            </Button>

            <Button
                color={IColor.GREEN}
                size="xs"
                className="px-3 py-1.5"
                onClick={() => onChangeEstado(IStateRamo.APROBADO)}
            >
                Aprobado
            </Button>
        </div>
    ) : (
        <div>
            <Button
                color={IColor.GREEN}
                size="xs"
                className="px-3 py-1.5 font-medium"
                onClick={() => onChangeEstado(IStateRamo.INSCRITO)}
            >
                Quitar etiqueta
            </Button>
        </div>
    );
}
