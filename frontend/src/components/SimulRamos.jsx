import React, { useState } from "react";
import RamoForm from "./Form/RamoForm";
import { Button } from "flowbite-react";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import axios from "axios";

export default function SimulRamos({ ramos, onClose }) {
    const {getHeaderToken} = useAuth();
    const {getBaseUrl} = useApi();
    const baseUrl = getBaseUrl();
    const headerToken = getHeaderToken();

    // Copia local para manipular el estado de cada ramo
    const [lista, setLista] = useState(ramos);

    // Cambiar estado de 1 ramo
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
        switch (estado.toLowerCase()) {
            case 'aprobado':
                return 'green'
            case 'reprobado':
                return 'red'
            default:
                return 'blue'
        }
    };

    const updateState = async () => {
        try {
            const payload = lista.map(r => ({
                codigo_ramo: r.codigo,
                estado: r.estado,
            }));

            await axios.post(
                `${baseUrl}/get-all/actualizar-estado-multiple`,
                { ramos: payload },
                headerToken
            );
            console.log('hola')
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold">Simulación de Ramos</h2>

            {lista.map((r) => (
                <div key={r.codigo} className="p-4">
                    <RamoForm ramo={r} color={getColorEstado(r.estado)}>
                        {buttons(r.estado, (nuevo) => cambiarEstado(r.codigo, nuevo))}
                    </RamoForm>
                </div>
            ))}

            <Button color="green" onClick={updateState}>Cerrar</Button>
        </>
    );
}

function buttons(estado, onChangeEstado) {

    if (!estado) return null;

    const st = estado.toLowerCase();

    return st === "inscrito" ? (
        <div className="flex gap-2">
            <Button
                color="green"
                size="xs"
                className="px-3 py-1.5"
                onClick={() => onChangeEstado("REPROBADO")}
            >
                Reprobado
            </Button>

            <Button
                color="green"
                size="xs"
                className="px-3 py-1.5"
                onClick={() => onChangeEstado("APROBADO")}
            >
                Aprobado
            </Button>
        </div>
    ) : (
        <div>
            <Button
                color="green"
                size="xs"
                className="px-3 py-1.5 font-medium"
                onClick={() => onChangeEstado("INSCRITO")}
            >
                Quitar etiqueta
            </Button>
        </div>
    );
}
