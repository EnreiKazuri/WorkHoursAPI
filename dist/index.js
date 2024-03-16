"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/', express_1.default.static('public'));
const employees = [];
const workedHours = [];
let climbingID = employees.length;
//Endpoints
// (get) /employee
// -> obtener todos los empleados registrados
app.get('/employee', (request, response) => {
    response.json(employees);
});
// (get) /employee/:id
// -> obtener un empleado enviando el id
app.get('/employee/:id', (request, response) => {
    try {
        let requestID = parseInt(request.params.id);
        const employee = employees.find((e) => e.id === requestID);
        if (!employee) {
            return response.status(404).json({
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            });
        }
        return response.status(200).json({
            statusCode: 200,
            statusValue: 'OK',
            data: employee
        });
    }
    catch (error) {
        return response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: 'Requested ID is not a number'
        });
    }
});
// (get) /employee/:id/hours
// -> obtiene todas las horas trabajadas por un empleado, enviando el id
// (get) /employee/:id/salary
// ->  obtiene el salario a pagar basandose en el total de horas por el precio de hora del empleado
// (post) /employee
// -> agrega un empleado nuevo
// (post) /employee/:id/hours
// -> agrega un registro nuevo de horas usando el id del empleado para asociar las horas
// (put) /employee/:id
// -> actualiza la informacion del empleado (solo el fullname y pricePerhours)
// (delete) / employee
// -> borra un empleado y todo el registro de las horas trabajadas
app.listen(port, () => console.log(`Server running at port ${port}`));
//# sourceMappingURL=index.js.map