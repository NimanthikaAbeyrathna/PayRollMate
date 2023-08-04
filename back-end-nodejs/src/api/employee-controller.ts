import express, {json} from "express";
import mysql, {Pool} from "promise-mysql";
import dotenv from 'dotenv';

export const router = express.Router();

let pool: Pool;
dotenv.config();
initPool();

async function initPool() {
    pool = await mysql.createPool({
        host: process.env.host,
        port: +process.env.port!,
        database: process.env.database,
        user: process.env.username,
        password: process.env.password,
        connectionLimit: +process.env.connection_limit!
    });
}

type  Employee = {
    employeeID: string,
    fullName: string,
    idNo: string,
    gender: string,
    dob: Date,
    address: string,
    contactNumber: string,
    email: string,
    department: string,
    post: string,
    epfNumber: string,
    basicSalary: number,
    bankName: string,
    branchName: string,
    accNumber: number,
    imageUrl: string
}
type Year = {
    id:number,
    year:number
}

type Salary={
    id :number,
    employeeID: string,
    year: number,
    month: string,
    basicSalary: number,
    leaveAllowed: number,
    leaveTaken: number,
    noPayLeave: number,
    normalOverTimeHours: number,
    specialOverTimeHours: number,
    salaryIncrement: number,
    livingAllowance: number,
    foodAllowance: number,
    conveyanceAllowance: number,
    medicalAllowance: number,
    grossSalary: number,
    overTime: number,
    reimbursements: number,
    bonus: number,
    salaryBeforeDeduction: number,
    noPayDeduction: number,
    salaryAdvance: number,
    welfareService: number,
    insurance: number,
    apit: number,
    epfEmployeeContribution: number,
    totalDeductions: number,
    netPayableSalary: number,
    epfEmployerContribution: number,
    etfEmployerContribution: number
}

router.get("/employeeID", async (req, res) => {

    const employeeIDsArray = await pool.query('SELECT employee_id FROM employee');
    const formattedEmployeeIDs = employeeIDsArray.map((row: any) => row.employee_id);

    res.json(formattedEmployeeIDs);
});

router.get("/getBasicSalary/:employeeID", async (req, res) => {

    const getBasicSalary = await pool.query('SELECT basic_salary FROM employee WHERE employee_id=?',[req.params.employeeID]);
    const basicSalary = getBasicSalary[0].basic_salary;
    res.json(basicSalary);

});


router.get("/year", async (req, res) => {
    try {
        console.log('years works')
        const years = await pool.query('SELECT * FROM year');
        const formattedYears: Year[] = years.map((row: any) => {
            return {
                id: row.id,
                year: row.year
            };
        });

        res.json(formattedYears);
    } catch (err) {
        console.error('Error fetching years:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/year", async (req, res) => {

    const  yearData  = req.body;
    if (!yearData) {
        res.sendStatus(400);
        return
    }

    const result = await pool.query('INSERT INTO year (year) VALUES (?)', [yearData.year]);

    const year = {
        id: result.insertId,
        year: yearData.year,
    };

    res.status(201).json(year);
});

router.delete("/year/:employeeID", async (req, res) => {

    const result = await pool.query('DELETE  FROM  year WHERE  id = ?', [req.params.employeeID]);

    res.sendStatus(result.affectedRows ? 204 : 404);
});



router.post('/print', async (req, res) => {

    const printRequest = req.body;
    const requestEmployeeId = printRequest[0];
    const requestYear = printRequest[1];
    const requestMonth = printRequest[2];

    const salary = await pool.query('SELECT * FROM salary WHERE employeeid=? AND year=? AND month=?',[requestEmployeeId,requestYear,requestMonth]);
    const employee = await pool.query('SELECT * FROM employee WHERE employee_id=?',[requestEmployeeId]);

    const formattedSalary: Salary[] = salary.map((row: any) => {
        return {
            id :row.id,
            employeeID: row.employeeid,
            year: row.year,
            month: row.month,
            basicSalary: row.basicsalary,
            leaveAllowed: row.leave_allowed,
            leaveTaken: row.leave_taken,
            noPayLeave: row.no_pay_leave,
            normalOverTimeHours: row.normal_overtime_hours,
            specialOverTimeHours: row.special_overtime_hours,
            salaryIncrement: row.salary_increment,
            livingAllowance: row.living_allowance,
            foodAllowance: row.food_allowance,
            conveyanceAllowance: row.conveyance_allowance,
            medicalAllowance: row.medical_allowance,
            grossSalary: row.gross_salary,
            overTime: row.overtime,
            reimbursements: row.reimbursements,
            bonus: row.bonus,
            salaryBeforeDeduction: row.salary_before_deduction,
            noPayDeduction: row.no_pay_deduction,
            salaryAdvance: row.salary_advance,
            welfareService: row.welfare_service,
            insurance: row.insurance,
            apit: row.apit,
            epfEmployeeContribution: row.epf_employee_contribution,
            totalDeductions: row.total_deductions,
            netPayableSalary: row.net_payable_salary,
            epfEmployerContribution: row.epf_employer_contribution,
            etfEmployerContribution: row.etf_employer_contribution
        };
    });

    const formattedEmployee: Employee[] = employee.map((row: any) => {
        return {
            employeeID: row.employee_id,
            fullName: row.full_name,
            idNo: row.id_no,
            gender: row.gender,
            dob : row.dob,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            department: row.department,
            post: row.post,
            epfNumber: row.epf_number,
            basicSalary: row.basic_salary,
            bankName:row.bank_name,
            branchName: row.branch_name,
            accNumber: row.acc_number,
            imageUrl: row.image_url
        };
    });
    const responseObject = [formattedSalary,formattedEmployee];

    res.json(responseObject);
});



router.post('/printsalarysheet', async (req, res) => {

    const printRequest = req.body;
    const requestYear = printRequest[0];
    const requestMonth = printRequest[1];

    const salaryList = await pool.query('SELECT * FROM salary WHERE year=? AND month=?',[requestYear,requestMonth]);
    const employeeList = await pool.query('SELECT * FROM employee');

    const formattedSalaryList: Salary[] = salaryList.map((row: any) => {
        return {
            id :row.id,
            employeeID: row.employeeid,
            year: row.year,
            month: row.month,
            basicSalary: row.basicsalary,
            leaveAllowed: row.leave_allowed,
            leaveTaken: row.leave_taken,
            noPayLeave: row.no_pay_leave,
            normalOverTimeHours: row.normal_overtime_hours,
            specialOverTimeHours: row.special_overtime_hours,
            salaryIncrement: row.salary_increment,
            livingAllowance: row.living_allowance,
            foodAllowance: row.food_allowance,
            conveyanceAllowance: row.conveyance_allowance,
            medicalAllowance: row.medical_allowance,
            grossSalary: row.gross_salary,
            overTime: row.overtime,
            reimbursements: row.reimbursements,
            bonus: row.bonus,
            salaryBeforeDeduction: row.salary_before_deduction,
            noPayDeduction: row.no_pay_deduction,
            salaryAdvance: row.salary_advance,
            welfareService: row.welfare_service,
            insurance: row.insurance,
            apit: row.apit,
            epfEmployeeContribution: row.epf_employee_contribution,
            totalDeductions: row.total_deductions,
            netPayableSalary: row.net_payable_salary,
            epfEmployerContribution: row.epf_employer_contribution,
            etfEmployerContribution: row.etf_employer_contribution
        };
    });

    const formattedEmployee: Employee[] = employeeList.map((row: any) => {
        return {
            employeeID: row.employee_id,
            fullName: row.full_name,
            idNo: row.id_no,
            gender: row.gender,
            dob : row.dob,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            department: row.department,
            post: row.post,
            epfNumber: row.epf_number,
            basicSalary: row.basic_salary,
            bankName:row.bank_name,
            branchName: row.branch_name,
            accNumber: row.acc_number,
            imageUrl: row.image_url
        };
    });
    const responseObject = [formattedSalaryList,formattedEmployee];
    res.json(responseObject);
});



router.post('/printepfsheet', async (req, res) => {

    const printRequest = req.body;
    const requestYear = printRequest[0];
    const requestMonth = printRequest[1];

    const salaryList = await pool.query('SELECT * FROM salary WHERE year=? AND month=?',[requestYear,requestMonth]);
    const employeeList = await pool.query('SELECT * FROM employee');


    const formattedSalaryList: Salary[] = salaryList.map((row: any) => {
        return {
            id :row.id,
            employeeID: row.employeeid,
            year: row.year,
            month: row.month,
            basicSalary: row.basicsalary,
            leaveAllowed: row.leave_allowed,
            leaveTaken: row.leave_taken,
            noPayLeave: row.no_pay_leave,
            normalOverTimeHours: row.normal_overtime_hours,
            specialOverTimeHours: row.special_overtime_hours,
            salaryIncrement: row.salary_increment,
            livingAllowance: row.living_allowance,
            foodAllowance: row.food_allowance,
            conveyanceAllowance: row.conveyance_allowance,
            medicalAllowance: row.medical_allowance,
            grossSalary: row.gross_salary,
            overTime: row.overtime,
            reimbursements: row.reimbursements,
            bonus: row.bonus,
            salaryBeforeDeduction: row.salary_before_deduction,
            noPayDeduction: row.no_pay_deduction,
            salaryAdvance: row.salary_advance,
            welfareService: row.welfare_service,
            insurance: row.insurance,
            apit: row.apit,
            epfEmployeeContribution: row.epf_employee_contribution,
            totalDeductions: row.total_deductions,
            netPayableSalary: row.net_payable_salary,
            epfEmployerContribution: row.epf_employer_contribution,
            etfEmployerContribution: row.etf_employer_contribution
        };
    });

    const formattedEmployee: Employee[] = employeeList.map((row: any) => {
        return {
            employeeID: row.employee_id,
            fullName: row.full_name,
            idNo: row.id_no,
            gender: row.gender,
            dob : row.dob,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            department: row.department,
            post: row.post,
            epfNumber: row.epf_number,
            basicSalary: row.basic_salary,
            bankName:row.bank_name,
            branchName: row.branch_name,
            accNumber: row.acc_number,
            imageUrl: row.image_url
        };
    });

    const responseObject = [formattedSalaryList,formattedEmployee];
    res.json(responseObject);
});