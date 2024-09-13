import { PrivilegioResponse } from "./PrivilegioResponse";

export interface RolResponse {
    id: string;
    nombre: string;
    descripcion: string;
    privilegios: PrivilegioResponse[];
}
