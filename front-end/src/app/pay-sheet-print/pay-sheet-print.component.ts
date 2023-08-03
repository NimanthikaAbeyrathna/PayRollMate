import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Year} from "../dto/year";
import {Salary} from "../dto/salary";
import {Employee} from "../dto/employee";

@Component({
    selector: 'app-pay-sheet-print',
    templateUrl: './pay-sheet-print.component.html',
    styleUrls: ['./pay-sheet-print.component.scss']
})
export class PaySheetPrintComponent {
    private breakpointObserver = inject(BreakpointObserver);
    selectedEmployeeID: string = '';
    employeeIDsArray: string[] = [];
    yearList: Array<Year> = [];
    selectedYear: number = 0;
    selectedMonth: string = '';
    printRequest: Array<any> = [];
    selectedSalary: any = {};
    selectedEmployee: any = {};
    salarySheetSelectedYear: number = 0;
    salarySheetSelectedMonth: string = '';
    salarySheetList: Array<Salary> = [];
    epfSheetSelectedYear: number = 0;
    epfSheetSelectedMonth: string = '';
    salaryEPFSheetList:Array<Salary>=[];
    employeeEPFSheetList:Array<Employee>=[];

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );


    constructor(private http: HttpClient) {
        http.get<Array<any>>(`${environment.apiUrl2}/employee/employeeID`).subscribe(
            formattedEmployeeIDs => {
                this.employeeIDsArray = formattedEmployeeIDs;
            },
            error => {
                console.error('Error fetching employee IDs:', error);
            }
        );
        this.getYears();


    }

    getYears() {
        this.http.get<Array<Year>>(`${environment.apiUrl2}/employee/year`).subscribe(
            formattedYears => {
                this.yearList = formattedYears;
            },
            error => {
                console.error('Error fetching years:', error);
            }
        );
    }


    printPaySheet($event: any) {
        $event.preventDefault();

        const printRequestArray = [
            this.selectedEmployeeID, this.selectedYear, this.selectedMonth
        ];

        this.http.post<Array<any>>(`${environment.apiUrl2}/employee/print`, printRequestArray).subscribe(
            responseObject => {
                this.selectedSalary = responseObject[0][0];
                this.selectedEmployee = responseObject[1][0];

                const paySheetWindow = open("", `_blank`, "popup=true,width=600");

                // @ts-ignore
                paySheetWindow.document.write(this.getReportDesignHTML(this.selectedSalary, this.selectedEmployee));
            },
            error => {
                console.error('Error fetching salary:', error);
            }
        );
    }


    getReportDesignHTML(selectedSalary: any, selectedEmployee: any) {
        console.log(selectedSalary)
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay Sheet</title>
    <style>
         *{
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      margin-bottom: 20px;
      background-color: grey;

    }
    #paySheet{
      font-size: 10px;
      background-color: white;
      width: 148mm;
      height: 210mm;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: 10px;
      padding: 10px;
    }
    #paySheetContainer{
      position: relative;
    }
    #headerElm{
      display: flex;
      width: 100%;
      justify-content: center;

    }
    #logo {
      width: 50px;
      height: 60px;

    }
    #logo >img{
       height: 100%;
       width: 100%;
    }
   h4{
    text-align: center;
   }
    #leaveTable{
        text-align: center;
        width: 100%;
        border: 1px solid black;
    }
    #leaveTable th , #leaveTable td{
        border: 1px solid black;
    }
    #salaryCalculation{
        text-align: center;
        width: 100%;
        border: 1px solid black;
    }
    #salaryCalculation td{
        border: 1px solid black;
    }
    .labelContainer{
      display: flex;
      width: 100%;
    }
    .label {
      font-weight: bold;
      text-align: left;
      margin-bottom: 5px;
      width: 100%;
    }

    .data {
      margin-bottom: 5px;
      text-align: left;
      width: 100%;
    }

    </style>
</head>
<body>
    <div id="paySheet">
        <div id="paySheetContainer">
            <div id="headerElm">
                <div id="logo">
                    <img src="../../assets/images/noimage.jpg" alt="#">
                </div>
                <h2>ABC company pvt.Ltd</h2>
            </div>

            <h4>No 29, Goodshed Road, Rathnapura</h4>
            <h4>081-8527419 , 072-8527413</h4>
            <h4>Salary Slip - <span>year : ${selectedSalary.year}</span> <span>month : ${selectedSalary.month}</span> </h4>

            <div>
                <h5>Employee Id : <span>${selectedSalary.employeeID}</span></h5>
                <h5>Employee name : <span>${selectedEmployee.fullName}</span></h5>
                <h5>Employee NIC : <span>${selectedEmployee.idNo}</span></h5>
                <h5>EPF No : <span>${selectedEmployee.epfNumber}</span></h5>
                <h5>Designation : <span>${selectedEmployee.post}</span></h5>
            </div>

            <table id="leaveTable">
                <thead>
                    <tr>
                        <th>Leave Allowed</th>
                        <th>Leave Taken</th>
                        <th>No Pay Leave</th>
                        <th>OT hours (rate - 1.5) </th>
                        <th>OT hours (rate - 2  ) </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${selectedSalary.leaveAllowed}</td>
                        <td>${selectedSalary.leaveTaken}</td>
                        <td>${selectedSalary.noPayLeave}</td>
                        <td>${selectedSalary.normalOverTimeHours}</td>
                        <td>${selectedSalary.specialOverTimeHours}</td>
                    </tr>
                </tbody>
            </table>
            <br>
            <table id="salaryCalculation">
                <thead>
                    <tr>
                       <th>Earnings</th>
                       <th></th>
                       <th>Deductions</th>
                       <th></th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic salary</td>
                        <td>${selectedSalary.basicSalary}</td>
                        <td>No Pay Days Deductions</td>
                        <td>${selectedSalary.noPayDeduction}</td>
                    </tr>
                    <tr>
                        <td>Salary Increment</td>
                        <td>${selectedSalary.salaryIncrement}</td>
                        <td>Salary Advance</td>
                        <td>${selectedSalary.salaryAdvance}</td>
                    </tr>
                    <tr>
                        <td>Cost of Living Allowance</td>
                        <td>${selectedSalary.livingAllowance}</td>
                        <td>welfare services</td>
                        <td>${selectedSalary.welfareService}</td>
                    </tr>
                    <tr>
                        <td>Food Allowance</td>
                        <td>${selectedSalary.foodAllowance}</td>
                        <td>insurance</td>
                        <td>${selectedSalary.insurance}</td>
                    </tr>
                    <tr>
                        <td>Conveyance Allowance</td>
                        <td>${selectedSalary.conveyanceAllowance}</td>
                        <td>APIT</td>
                        <td>${selectedSalary.apit}</td>
                    </tr>
                    <tr>
                        <td>Medical Allowance</td>
                        <td>${selectedSalary.medicalAllowance}</td>
                        <td>EPF Employee Contribution (8%)</td>
                        <td>${selectedSalary.epfEmployeeContribution}</td>
                    </tr>
                    <tr>
                        <td>Gross Salary</td>
                        <td>${selectedSalary.grossSalary}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Over Time</td>
                        <td>${selectedSalary.overTime}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Reimbursements</td>
                        <td>${selectedSalary.reimbursements}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Bonus</td>
                        <td>${selectedSalary.bonus}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Salary Before Deduction</td>
                        <td>${selectedSalary.salaryBeforeDeduction}</td>
                        <td>Total Deductions</td>
                        <td>${selectedSalary.totalDeductions}</td>
                    </tr>
                    <tr>
                        <td colspan="3">Net Payable Salary</td>
                        <td>${selectedSalary.netPayableSalary}</td>
                    </tr>
                    <tr>
                        <td colspan="3">EPF Employer Contribution(12%)</td>
                        <td>${selectedSalary.epfEmployerContribution}</td>
                    </tr>
                    <tr>
                        <td colspan="3">ETF Employer Contribution (3%)</td>
                        <td>${selectedSalary.etfEmployerContribution}</td>
                    </tr>

                </tbody>

            </table>
            <br>

              <div class="labelContainer height">
                <label class="label">Prepared By :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>
              <div class="labelContainer height">
                <label class="label">Approved By :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>

              <div class="labelContainer height">
                <label class="label">Employer Signature :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>

        </div>

    </div>

</body>
</html>
    `;

    }

    printSalarySheet($event: any) {
        $event.preventDefault();

        const printRequestArray = [
            this.salarySheetSelectedYear,
            this.salarySheetSelectedMonth
        ];

        this.http.post<Array<any>>(`${environment.apiUrl2}/employee/printsalarysheet`, printRequestArray).subscribe(
            responseObject => {
                this.salarySheetList = responseObject;

                const salarySheetWindow = open("", `_blank`, "popup=true,width=600");

                // @ts-ignore
                salarySheetWindow.document.write(this.getSalarySheetDesignHTML(this.salarySheetList));
            },
            error => {
                console.error('Error fetching salary:', error);
            }
        );
    }


    getSalarySheetDesignHTML(salarySheetList: any) {

        const totalBasicSalary = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.basicSalary;
        }, 0);

        const totalSalaryIncrement = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.salaryIncrement;
        }, 0);

        const totalLivingAllowance = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.livingAllowance;
        }, 0);

        const totalFoodAllowance = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.foodAllowance;
        }, 0);

        const totalConveyanceAllowance = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.conveyanceAllowance;
        }, 0);

        const totalMedicalAllowance = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.medicalAllowance;
        }, 0);

        const totalGrossSalary = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.grossSalary;
        }, 0);

        const totalOverTime = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.overTime;
        }, 0);

        const totalReimbursements = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.reimbursements;
        }, 0);

        const totalBonus = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.bonus;
        }, 0);

        const totalSalaryBeforeDeduction = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.salaryBeforeDeduction;
        }, 0);

        const totalNoPayDeduction = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.noPayDeduction;
        }, 0);

        const totalSalaryAdvance = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.salaryAdvance;
        }, 0);

        const totalWelfareService = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.welfareService;
        }, 0);

        const totalInsurance = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.insurance;
        }, 0);

        const totalAPIT = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.apit;
        }, 0);

        const totalEpfEmployeeContribution = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.epfEmployeeContribution;
        }, 0);

        const totalOfTotalDeduction = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.totalDeductions;
        }, 0);

        const totalNetPayableSalary = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.netPayableSalary;
        }, 0);

        const totalEPFEmployerContribution = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.epfEmployerContribution;
        }, 0);

        const totalETFEmployerContribution = salarySheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.etfEmployerContribution;
        }, 0);


        return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salary Sheet</title>
    <style>
          *{
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      margin-bottom: 20px;
      background-color: grey;

    }
    #salarySheet{
      font-size: 10px;
      background-color: white;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: 10px;
      padding: 10px;
    }
    #salarySheetContainer{
      position: relative;
    }
     #headerElm{
      display: flex;
      width: 100%;
      justify-content: center;

    }
    #logo {
      width: 50px;
      height: 60px;

    }
    #logo >img{
       height: 100%;
       width: 100%;
    }
   h4{
    text-align: center;
   }
   #salarySheetTable{
    text-align: center;
        width: 100%;
        border: 1px solid black;
        font-size: 8px;
   }
   #salarySheetTable th , #salarySheetTable td{
    border: 1px solid black;
   }
   tfoot{
    font-weight: bold;
   }

   .labelContainer{
      display: flex;
      width: 100%;
    }
    .label {
      font-weight: bold;
      text-align: left;
      margin-bottom: 5px;
      width: 100%;
    }

    .data {
      margin-bottom: 5px;
      text-align: left;
      width: 100%;
    }
    </style>
</head>
<body>
    <div id="salarySheet">
        <div id="salarySheetContainer">
             <div id="headerElm">
                <div id="logo">
                    <img src="../../assets/images/noimage.jpg" alt="#">
                </div>
                <h2>ABC company pvt.Ltd</h2>
            </div>

            <h4>No 29, Goodshed Road, Rathnapura</h4>
            <h4>081-8527419 , 072-8527413</h4>
            <h4>Salary Sheet - <span>year : ${salarySheetList[0].year}</span> <span>month : ${salarySheetList[0].month}</span> </h4>
            <br>
            <table id="salarySheetTable">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Employee ID</th>
                        <th>Basic salary</th>
                        <th>Leave Alowed</th>
                        <th>Leave Taken</th>
                        <th>No-pay Leave</th>
                        <th>OT (rate - 1.5)</th>
                        <th>OT (rate - 2)</th>
                        <th>Salary Increment</th>
                        <th>Living Allowance</th>
                        <th>Food Allowance</th>
                        <th>Conveyance Allowance</th>
                        <th>Medical Allowance</th>
                        <th>Gross Salary</th>
                        <th>Overtime</th>
                        <th>Reimbursements</th>
                        <th>Bonus</th>
                        <th>Salary Before Deduction</th>
                        <th>No Pay Deduction</th>
                        <th>Salary Advance</th>
                        <th>Welfare Service</th>
                        <th>Insurance</th>
                        <th>APIT</th>
                        <th>EPF Employee Contribution</th>
                        <th>Total Deductions</th>
                        <th>Net Payable Salary</th>
                        <th>EPF Employer Contribution</th>
                        <th>ETF Employer Contribution</th>

                    </tr>

                </thead>
                <tbody>
                ${this.salarySheetRowGenerator(salarySheetList)}
                </tbody>
                <tfoot>
                    <tr>
                        <td>total : ${salarySheetList.length}</td>
                        <td></td>
                        <td>${totalBasicSalary}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>${totalSalaryIncrement}</td>
                        <td>${totalLivingAllowance}</td>
                        <td>${totalFoodAllowance}</td>
                        <td>${totalConveyanceAllowance}</td>
                        <td>${totalMedicalAllowance}</td>
                        <td>${totalGrossSalary}</td>
                        <td>${totalOverTime}</td>
                        <td>${totalReimbursements}</td>
                        <td>${totalBonus}</td>
                        <td>${totalSalaryBeforeDeduction}</td>
                        <td>${totalNoPayDeduction}</td>
                        <td>${totalSalaryAdvance}</td>
                        <td>${totalWelfareService}</td>
                        <td>${totalInsurance}</td>
                        <td>${totalAPIT}</td>
                        <td>${totalEpfEmployeeContribution}</td>
                        <td>${totalOfTotalDeduction}</td>
                        <td>${totalNetPayableSalary}</td>
                        <td>${totalEPFEmployerContribution}</td>
                        <td>${totalETFEmployerContribution}</td>

                    </tr>

                </tfoot>
            </table>
            <br>

              <div class="labelContainer height">
                <label class="label">Prepared By :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>
              <div class="labelContainer height">
                <label class="label">Approved By :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>

        </div>
    </div>
</body>
</html>`;
    }

    // @ts-ignore
    salarySheetRowGenerator(salarySheetList: Array<Salary>) {
        let i = 0;
        let tableRows = "";

        for (const salary of salarySheetList) {
            i = i + 1;
            tableRows += ` <tr>
                    <td>${i}</td>
                    <td>${salary.employeeID}</td>
                    <td>${salary.basicSalary}</td>
                    <td>${salary.leaveAllowed}</td>
                    <td>${salary.leaveTaken}</td>
                    <td>${salary.noPayLeave}</td>
                    <td>${salary.normalOverTimeHours}</td>
                    <td>${salary.specialOverTimeHours}</td>
                    <td>${salary.salaryIncrement}</td>
                    <td>${salary.livingAllowance}</td>
                    <td>${salary.foodAllowance}</td>
                    <td>${salary.conveyanceAllowance}</td>
                    <td>${salary.medicalAllowance}</td>
                    <td>${salary.grossSalary}</td>
                    <td>${salary.overTime}</td>
                    <td>${salary.reimbursements}</td>
                    <td>${salary.bonus}</td>
                    <td>${salary.salaryBeforeDeduction}</td>
                    <td>${salary.noPayDeduction}</td>
                    <td>${salary.salaryAdvance}</td>
                    <td>${salary.welfareService}</td>
                    <td>${salary.insurance}</td>
                    <td>${salary.apit}</td>
                    <td>${salary.epfEmployeeContribution}</td>
                    <td>${salary.totalDeductions}</td>
                    <td>${salary.netPayableSalary}</td>
                    <td>${salary.epfEmployerContribution}</td>
                    <td>${salary.etfEmployerContribution}</td>
                  </tr>`;
        }

        return tableRows;
    }

    printepfSheet($event: any) {
        $event.preventDefault();

        const printRequestArray = [
            this.epfSheetSelectedYear,
            this.epfSheetSelectedMonth
        ];

        this.http.post<Array<any>>(`${environment.apiUrl2}/employee/printepfsheet`, printRequestArray).subscribe(
            responseObject => {
                this.salaryEPFSheetList = responseObject[0];
                this.employeeEPFSheetList = responseObject[1];

                const salarySheetWindow = open("", `_blank`, "popup=true,width=600");

                // @ts-ignore
                salarySheetWindow.document.write(this.getEPFSheetDesignHTML(this.salaryEPFSheetList,this.employeeEPFSheetList));
            },
            error => {
                console.error('Error fetching salary:', error);
            }
        );


    }


    getEPFSheetDesignHTML(salaryEPFSheetList:any,employeeEPFSheetList:any){

        const totalEpfEmployeeContribution2 = salaryEPFSheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.epfEmployeeContribution;
        }, 0);

        const totalEPFEmployerContribution2 = salaryEPFSheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.epfEmployerContribution;
        }, 0);

        const totalETFEmployerContribution2 = salaryEPFSheetList.reduce((accumulator: number, salary: any) => {
            return accumulator + salary.etfEmployerContribution;
        }, 0);


        return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salary Sheet</title>
    <style>
          *{
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      margin-bottom: 20px;
      background-color: grey;

    }
    #salarySheet{
      font-size: 10px;
      background-color: white;
      width: 297mm;
      height: 210mm;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin: 10px;
      padding: 10px;
    }
    #salarySheetContainer{
      position: relative;
    }
     #headerElm{
      display: flex;
      width: 100%;
      justify-content: center;

    }
    #logo {
      width: 50px;
      height: 60px;

    }
    #logo >img{
       height: 100%;
       width: 100%;
    }
   h4{
    text-align: center;
   }
   #salarySheetTable{
    text-align: center;
    width: 100%;
    border: 1px solid black;
    font-size: 10px;
   }
   #salarySheetTable th , #salarySheetTable td{
    border: 1px solid black;
   }
   tfoot{
    font-weight: bold;
   }

   .labelContainer{
      display: flex;
      width: 100%;
    }
    .label {
      font-weight: bold;
      text-align: left;
      margin-bottom: 5px;
      width: 100%;
    }

    .data {
      margin-bottom: 5px;
      text-align: left;
      width: 100%;
    }
    </style>
</head>
<body>
    <div id="salarySheet">
        <div id="salarySheetContainer">
             <div id="headerElm">
                <div id="logo">
                    <img src="../../assets/images/noimage.jpg" alt="#">
                </div>
                <h2>ABC company pvt.Ltd</h2>
            </div>

            <h4>No 29, Goodshed Road, Rathnapura</h4>
            <h4>081-8527419 , 072-8527413</h4>
            <h4>EPF Sheet - <span>year : ${salaryEPFSheetList[0].year}</span> <span>month : ${salaryEPFSheetList[0].month}</span> </h4>
            <br>
            <table id="salarySheetTable">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>NIC</th>
                        <th>EPF NO</th>
                        <th>Basic salary</th>
                        <th>EPF Employee Contribution</th>
                        <th>EPF Employer Contribution</th>
                        <th>Total EPF Contribution</th>
                        <th>ETF Employer Contribution</th>
                        <th>Total Contribution</th>

                    </tr>

                </thead>
                <tbody>
                 ${this.epfSheetRowGenerator(salaryEPFSheetList, employeeEPFSheetList)}

                </tbody>
                <tfoot>
                    <tr>
                        <td>total : ${employeeEPFSheetList.length}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>${totalEpfEmployeeContribution2}</td>
                        <td>${totalEPFEmployerContribution2}</td>
                        <td>${totalEpfEmployeeContribution2 + totalEPFEmployerContribution2}</td>
                        <td>${totalETFEmployerContribution2}</td>
                        <td>${totalEpfEmployeeContribution2 + totalEPFEmployerContribution2 + totalETFEmployerContribution2}</td>
                    </tr>

                </tfoot>
            </table>
            <br>

              <div class="labelContainer height">
                <label class="label">Prepared By :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>
              <div class="labelContainer height">
                <label class="label">Approved By :</label>
                <div class="data">-------------------</div>
                <div class="label">date :</div>
                <div class="data">-------------------</div>
              </div>

        </div>
    </div>
</body>
</html>`;

    }


    epfSheetRowGenerator(salaryEPFSheetList:any,employeeEPFSheetList:any){

        let i = 0;
        let tableRows = "";

        for (const salary of salaryEPFSheetList) {
            i = i + 1;

            tableRows += `<tr>
                        <td>${i}</td>
                        <td>${salary.employeeID}</td>
                        <td>${this.findEmployeeName(salary.employeeID,employeeEPFSheetList)}</td>
                        <td>${this.findEmployeeNIC(salary.employeeID,employeeEPFSheetList)}</td>
                        <td>${this.findEmployeeEPFNO(salary.employeeID,employeeEPFSheetList)}</td>
                        <td>${salary.basicSalary}</td>
                        <td>${salary.epfEmployeeContribution}</td>
                        <td>${salary.epfEmployerContribution}</td>
                        <td>${salary.epfEmployeeContribution+salary.epfEmployerContribution}</td>
                        <td>${salary.etfEmployerContribution}</td>
                        <td>${salary.epfEmployeeContribution+salary.epfEmployerContribution+salary.etfEmployerContribution}</td>

                    </tr>`;
        }

        return tableRows;
    }

    findEmployeeName(employeeID:any,employeeEPFSheetList:any){
        const employee = this.employeeEPFSheetList.find(emp => emp.employeeID === employeeID);
        // @ts-ignore
        return employee.fullName;
    }

    findEmployeeNIC(employeeID:any,employeeEPFSheetList:any){
        const employee = this.employeeEPFSheetList.find(emp => emp.employeeID === employeeID);
        // @ts-ignore
        return employee.idNo;
    }

    findEmployeeEPFNO(employeeID:any,employeeEPFSheetList:any){
        const employee = this.employeeEPFSheetList.find(emp => emp.employeeID === employeeID);
        // @ts-ignore
        return employee.epfNumber;
    }
}
