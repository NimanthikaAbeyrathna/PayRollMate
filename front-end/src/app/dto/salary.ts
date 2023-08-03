export class Salary {
    constructor(
        public id :number,
        public employeeID: string,
        public year: number,
        public month: string,
        public basicSalary: number,
        public leaveAllowed: number,
        public leaveTaken: number,
        public noPayLeave: number,
        public normalOverTimeHours: number,
        public specialOverTimeHours: number,
        public salaryIncrement: number,
        public livingAllowance: number,
        public foodAllowance: number,
        public conveyanceAllowance: number,
        public medicalAllowance: number,
        public grossSalary: number,
        public overTime: number,
        public reimbursements: number,
        public bonus: number,
        public salaryBeforeDeduction: number,
        public noPayDeduction: number,
        public salaryAdvance: number,
        public welfareService: number,
        public insurance: number,
        public apit: number,
        public epfEmployeeContribution: number,
        public totalDeductions: number,
        public netPayableSalary: number,
        public epfEmployerContribution: number,
        public etfEmployerContribution: number

    ) {
    }

}
