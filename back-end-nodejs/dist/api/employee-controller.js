"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.router = express_1.default.Router();
let pool;
dotenv_1.default.config();
initPool();
function initPool() {
    return __awaiter(this, void 0, void 0, function* () {
        pool = yield promise_mysql_1.default.createPool({
            host: process.env.host,
            port: +process.env.port,
            database: process.env.database,
            user: process.env.username,
            password: process.env.password,
            connectionLimit: +process.env.connection_limit
        });
    });
}
exports.router.get("/employeeID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeIDsArray = yield pool.query('SELECT employee_id FROM employee');
    const formattedEmployeeIDs = employeeIDsArray.map((row) => row.employee_id);
    res.json(formattedEmployeeIDs);
}));
exports.router.get("/getBasicSalary/:employeeID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getBasicSalary = yield pool.query('SELECT basic_salary FROM employee WHERE employee_id=?', [req.params.employeeID]);
    const basicSalary = getBasicSalary[0].basic_salary;
    res.json(basicSalary);
}));
exports.router.get("/year", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('years works');
        const years = yield pool.query('SELECT * FROM year');
        const formattedYears = years.map((row) => {
            return {
                id: row.id,
                year: row.year
            };
        });
        res.json(formattedYears);
    }
    catch (err) {
        console.error('Error fetching years:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.router.post("/year", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const yearData = req.body;
    if (!yearData) {
        res.sendStatus(400);
        return;
    }
    const result = yield pool.query('INSERT INTO year (year) VALUES (?)', [yearData.year]);
    const year = {
        id: result.insertId,
        year: yearData.year,
    };
    res.status(201).json(year);
}));
exports.router.delete("/year/:employeeID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('DELETE  FROM  year WHERE  id = ?', [req.params.employeeID]);
    res.sendStatus(result.affectedRows ? 204 : 404);
}));
exports.router.post('/print', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const printRequest = req.body;
    const requestEmployeeId = printRequest[0];
    const requestYear = printRequest[1];
    const requestMonth = printRequest[2];
    const salary = yield pool.query('SELECT * FROM salary WHERE employeeid=? AND year=? AND month=?', [requestEmployeeId, requestYear, requestMonth]);
    const employee = yield pool.query('SELECT * FROM employee WHERE employee_id=?', [requestEmployeeId]);
    const formattedSalary = salary.map((row) => {
        return {
            id: row.id,
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
    const formattedEmployee = employee.map((row) => {
        return {
            employeeID: row.employee_id,
            fullName: row.full_name,
            idNo: row.id_no,
            gender: row.gender,
            dob: row.dob,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            department: row.department,
            post: row.post,
            epfNumber: row.epf_number,
            basicSalary: row.basic_salary,
            bankName: row.bank_name,
            branchName: row.branch_name,
            accNumber: row.acc_number,
            imageUrl: row.image_url
        };
    });
    const responseObject = [formattedSalary, formattedEmployee];
    res.json(responseObject);
}));
exports.router.post('/printsalarysheet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const printRequest = req.body;
    const requestYear = printRequest[0];
    const requestMonth = printRequest[1];
    const salaryList = yield pool.query('SELECT * FROM salary WHERE year=? AND month=?', [requestYear, requestMonth]);
    const employeeList = yield pool.query('SELECT * FROM employee');
    const formattedSalaryList = salaryList.map((row) => {
        return {
            id: row.id,
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
    const formattedEmployee = employeeList.map((row) => {
        return {
            employeeID: row.employee_id,
            fullName: row.full_name,
            idNo: row.id_no,
            gender: row.gender,
            dob: row.dob,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            department: row.department,
            post: row.post,
            epfNumber: row.epf_number,
            basicSalary: row.basic_salary,
            bankName: row.bank_name,
            branchName: row.branch_name,
            accNumber: row.acc_number,
            imageUrl: row.image_url
        };
    });
    const responseObject = [formattedSalaryList, formattedEmployee];
    res.json(responseObject);
}));
exports.router.post('/printepfsheet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const printRequest = req.body;
    const requestYear = printRequest[0];
    const requestMonth = printRequest[1];
    const salaryList = yield pool.query('SELECT * FROM salary WHERE year=? AND month=?', [requestYear, requestMonth]);
    const employeeList = yield pool.query('SELECT * FROM employee');
    const formattedSalaryList = salaryList.map((row) => {
        return {
            id: row.id,
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
    const formattedEmployee = employeeList.map((row) => {
        return {
            employeeID: row.employee_id,
            fullName: row.full_name,
            idNo: row.id_no,
            gender: row.gender,
            dob: row.dob,
            address: row.address,
            contactNumber: row.contact_number,
            email: row.email,
            department: row.department,
            post: row.post,
            epfNumber: row.epf_number,
            basicSalary: row.basic_salary,
            bankName: row.bank_name,
            branchName: row.branch_name,
            accNumber: row.acc_number,
            imageUrl: row.image_url
        };
    });
    const responseObject = [formattedSalaryList, formattedEmployee];
    res.json(responseObject);
}));
