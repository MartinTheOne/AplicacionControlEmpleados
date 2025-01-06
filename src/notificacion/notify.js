// src/utils/notyf.js
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';  // Importar los estilos de Notyf

const notyf = new Notyf({
    duration: 3000,
    position: { x: 'center', y: 'top' },
    types: [
        {
            type: 'success',
            background: "#28b463",
            className: "rounded-[10px] text-black text-[15px]"
        },
        {
            type: 'error',
            background: "#e74c3c",
            className: "rounded-[10px] text-black text-[15px]"
        }
    ]
});

export default notyf;
