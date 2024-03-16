import express, { Request, Response } from "express";
const app = express();
const port = 3000;

app.use(express.json());
app.use('/', express.static('public'));

type Employee =
{
    id:number,
    idCard:string,
    fullName:string,
    pricePerHour:number
}

type WorkedHour =
{
    id:number,
    employeeId:number,
    hours:number
}

const employees:Employee[] = [];
let workedHours:WorkedHour[] = [];
let climbingID = 0;
let climbingHourID = 0;
// let climbingID = employees? employees.at(-1)?.id : 0;
// let climbingHourID = workedHours? workedHours.at(-1)?.id : 0;

//Endpoints
// (get) /employee
// -> obtener todos los empleados registrados
app.get('/employee', (request:Request, response:Response) =>
{
    response.json(employees);
})
// (get) /employee/:id
// -> obtener un empleado enviando el id
app.get('/employee/:id', (request:Request, response:Response) =>
{
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const employee = employees.find((e:Employee) => e.id === requestID)
    if (!employee) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            }
        )
    }
    return response.status(200).json(
        {
            statusCode: 200,
            statusValue: 'OK',
            data: employee
        }
    )
})
// (get) /employee/:id/hours
// -> obtiene todas las horas trabajadas por un empleado, enviando el id
app.get('/employee/:id/hours', (request:Request, response:Response) =>
{
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const employee = employees.find((e:Employee) => e.id === requestID)
    if (!employee) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            }
        )
    }
    const workedHour = workedHours.filter((e:WorkedHour) => e.employeeId === requestID)
    if (!workedHour || workedHour.length == 0) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `Employee ${employee.fullName} has no hours logged In`
            }
        )
    }
    else{
        let totalHours = 0;
        workedHour.forEach(worked => {
            totalHours += worked.hours;
        });
        const workedEmployee = 
        {
            id: employee.id,
            fullName: employee.fullName,
            workedHours: totalHours
        }
        return response.status(200).json(
            {
                statusCode: 200,
                statusValue: 'OK',
                data: workedEmployee
            }
        )
    }
})
// (get) /employee/:id/salary
// ->  obtiene el salario a pagar basandose en el total de horas por el precio de hora del empleado
app.get('/employee/:id/salary', (request:Request, response:Response) =>
{
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const employee = employees.find((e:Employee) => e.id === requestID)
    if (!employee) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            }
        )
    }
    const workedHour = workedHours.filter((e:WorkedHour) => e.employeeId === requestID)
    if (workedHour.length == 0) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `Employee ${employee.fullName} has no hours logged In`
            }
        )
    }
    else{
        let totalHours = 0;
        workedHour.forEach(worked => {
            totalHours += worked.hours;
        });
        const workedEmployee = 
        {
            id: employee.id,
            fullName: employee.fullName,
            totalHours: totalHours,
            salary: totalHours * employee.pricePerHour
        }
        return response.status(200).json(
            {
                statusCode: 200,
                statusValue: 'OK',
                data: workedEmployee
            }
        )
    }
})
// (post) /employee
// -> agrega un empleado nuevo
app.post('/employee', (request:Request, response:Response) =>
{
    const { fullName, idCard, pricePerHour } = request.body;

    if(employees.find((e:Employee) => e.idCard === idCard))
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: `idCard: Id is already in use`
            })
    }
    if (fullName.trim().length === 0) 
    {
        return response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `username is required`
        })
    }
    if (isNaN(pricePerHour) || pricePerHour <= 0) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Wage: Hourly wage is not a number or is below 0'
            }
        )
    }
    climbingID++;
    const newEmployee:Employee =
    {
        id: climbingID,
        fullName,
        idCard,
        pricePerHour
    }
    employees.push(newEmployee);
    return response.status(201).json(
        {
            statusCode: 201,
            statusValue: 'Created',
            data: newEmployee
        }
    )
})
// (post) /employee/:id/hours
// -> agrega un registro nuevo de horas usando el id del empleado para asociar las horas
app.post('/employee/:id/hours', (request:Request, response:Response) =>
{
    const hours = request.body.hours;
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const employee = employees.find((e:Employee) => e.id === requestID)
    if (!employee) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            }
        )
    }
    if (isNaN(hours) || hours <= 0) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Hours: Requested time is not a number or is below 0'
            }
        )
    }
    climbingHourID++;
    const workedHour:WorkedHour =
    {
        id: climbingHourID,
        employeeId: requestID,
        hours
    }
    workedHours.push(workedHour);
    return response.status(201).json(
        {
            statusCode: 201,
            statusValue: 'Created',
            data: workedHour
        }
    )
})
// (put) /employee/:id
// -> actualiza la informacion del empleado (solo el fullname y pricePerhours)
app.put('/employee/:id', (request:Request, response:Response) =>
{
    const { fullName, pricePerHour } = request.body;
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const employee = employees.find((e:Employee) => e.id === requestID)
    if (!employee) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            }
        )
    }
    if (fullName.trim().length === 0) 
    {
        return response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: `username is required`
        })
    }
    if (isNaN(pricePerHour) || pricePerHour <= 0) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Wage: Hourly wage is not a number or is below 0'
            }
        )
    }
    employee.fullName = fullName;
    employee.pricePerHour = pricePerHour;
    employees[employee.id-1] = employee;

    return response.status(200).json(
        {
            statusCode: 200,
            statusValue: 'OK',
            data: employee
        })
})
// (delete) / employee
// -> borra un empleado y todo el registro de las horas trabajadas
app.delete('/employee/:id', (request:Request, response:Response) =>
{
    let requestID = parseInt(request.params.id)
    if (isNaN(requestID)) 
    {
        return response.status(400).json(
            {
                statusCode: 400,
                statusValue: 'Bad Request',
                message: 'Requested ID is not a number'
            }
        )
    }
    const employee = employees.find((e:Employee) => e.id === requestID)
    if (!employee) {
        return response.status(404).json(
            {
                statusCode: 404,
                statusValue: 'Not found',
                message: `There's no employee with the id ${requestID}`
            }
        )
    }
    employees.splice(employee.id-1, 1);
    workedHours = workedHours.filter((e:WorkedHour) => e.employeeId !== requestID)
    return response.status(200).json(
        {
            statusCode: 200,
            statusValue: 'OK',
            message: `Employee ${employee.fullName} successfully deleted`
        }
    )
})
// se requiere que se validen los valores enviados (id, fullname, cedula, pricePerHour)
// entre las validaciones la cedula no puede estar repetida

app.listen(port, () => console.log(`Server running at port ${port}`));