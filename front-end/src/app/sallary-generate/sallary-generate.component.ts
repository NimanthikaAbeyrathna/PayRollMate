import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Year} from "../dto/year";
import {Salary} from "../dto/salary";


@Component({
    selector: 'app-sallary-generate',
    templateUrl: './sallary-generate.component.html',
    styleUrls: ['./sallary-generate.component.scss']
})
export class SallaryGenerateComponent {
    private breakpointObserver = inject(BreakpointObserver);
    employeeIDsArray: string[] = [];
    selectedEmployeeID: string = '';
    selectedYear: number = 0;
    selectedMonth: string = '';
    isPopupVisible: boolean = false;
    yearList: Array<Year> = [];
    salaryList: Array<Salary> = [];
    basicSalary: number = 0;
    leaveAllowed: number = 0;
    leaveTaken: number = 0;
    noPayLeave: number = 0;
    medicalAllowance: number = 0;
    salaryIncrement: number = 0;
    livingAllowance: number = 0;
    foodAllowance: number = 0;
    conveyanceAllowance: number = 0;
    grossSalary: number = 0;
    normalOverTimeHours: any = 0;
    specialOverTimeHours: any = 0;
    overTime: number = 0;
    reimbursements: number = 0;
    bonus: number = 0;
    salaryBeforeDeduction: number = 0;
    noPayDeduction: number = 0;
    epfEmployeeContribution: number = 0;
    salaryAdvance: number = 0;
    welfareService: number = 0;
    insurance: number = 0;
    apit: number = 0;
    totalDeductions: number = 0;
    epfEmployerContribution: number = 0;
    etfEmployerContribution: number = 0;
    netPayableSalary: number = 0;
    selectedSalary: any = {};
    id:number=0;

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
        this.getSalaries();


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


    showPopup() {
        this.isPopupVisible = true;
    }

    hidePopup() {
        this.isPopupVisible = false;
    }

  saveYear($event: Event, yearInputElm: HTMLInputElement) {
      $event.preventDefault();

        const year = new Year(
            0,
            +yearInputElm.value
        );

        this.http.post<Year>(`${environment.apiUrl2}/employee/year`, year)
            .subscribe((response: any) => {
                    // Success handling here
                    this.yearList.push(year);
                    this.getYears();
                    yearInputElm.value = '';
                    yearInputElm.focus();
                },
                (error) => {
                    console.error('Error occurred when saving year', error);
                });
    }

    deleteYear(year: Year) {
        this.http.delete(`${environment.apiUrl2}/employee/year/${year.id}`).subscribe(data => {
            const index = this.yearList.indexOf(year);
            this.yearList.splice(index, 1);
        });

    }

    onSelectChange($event: Event) {
        // @ts-ignore
        const selectedValue = event.target.value;


        this.http.get<number>(`${environment.apiUrl2}/employee/getBasicSalary/${selectedValue}`).subscribe(
            getBasicSalary => {
                this.basicSalary = getBasicSalary;
                this.epfEmployeeContribution = this.basicSalary * 8 / 100;
                this.epfEmployerContribution = this.basicSalary * 12 / 100;
                this.etfEmployerContribution = this.basicSalary * 3 / 100;
                this.updateTotalDeduction()
                this.updateGrossSalary();
                this.netPayableSalaryCalculation();

            },
            error => {
                console.log('no employeeID found', error);
            }
        );


    }

    updateNoPayLeave() {
        this.noPayLeave = Math.max(this.leaveTaken - this.leaveAllowed, 0);
        this.noPayDeduction = (this.basicSalary / 30) * this.noPayLeave;
        this.updateTotalDeduction();
        this.netPayableSalaryCalculation();
    }

    updateGrossSalary() {
        this.grossSalary = this.salaryIncrement + this.livingAllowance + this.foodAllowance
            + this.conveyanceAllowance + this.medicalAllowance + this.basicSalary;

        this.updateBeforeSalaryDeduction();
        this.netPayableSalaryCalculation();
    }

    updateOverTime() {

        const totalWorkMinutesPerMonth = 30 * 8 * 60;

        const basicSalaryPerMinute = this.basicSalary / totalWorkMinutesPerMonth;

        const salaryForNormalOverTime = basicSalaryPerMinute * 1.5 * parseFloat(this.normalOverTimeHours + "") * 60;

        const salaryForSpecialOverTime = basicSalaryPerMinute * 2 * parseFloat(this.specialOverTimeHours + "") * 60;

        this.overTime = salaryForNormalOverTime + salaryForSpecialOverTime;
        this.updateBeforeSalaryDeduction();
        this.netPayableSalaryCalculation();

    }

    updateBeforeSalaryDeduction() {
        this.salaryBeforeDeduction = this.grossSalary + this.overTime + this.reimbursements + this.bonus
        this.netPayableSalaryCalculation();
    }

    updateTotalDeduction() {

        this.totalDeductions = this.noPayDeduction + this.epfEmployeeContribution + this.salaryAdvance +
            this.welfareService + this.insurance + this.apit;

        this.netPayableSalaryCalculation();
    }

    netPayableSalaryCalculation() {
        this.netPayableSalary = this.salaryBeforeDeduction - this.totalDeductions;
    }

    saveSalary($event: any, saveBtn: HTMLButtonElement, employeeIDSelect: HTMLSelectElement) {

        $event.preventDefault();


        const salary = new Salary(
            0,
            this.selectedEmployeeID,
            this.selectedYear,
            this.selectedMonth,
            this.basicSalary,
            this.leaveAllowed,
            this.leaveTaken,
            this.noPayLeave,
            this.convertNumberFormat(this.normalOverTimeHours + ""),
            this.convertNumberFormat(this.specialOverTimeHours + ""),
            this.salaryIncrement,
            this.livingAllowance,
            this.foodAllowance,
            this.conveyanceAllowance,
            this.medicalAllowance,
            this.grossSalary,
            this.overTime,
            this.reimbursements,
            this.bonus,
            this.salaryBeforeDeduction,
            this.noPayDeduction,
            this.salaryAdvance,
            this.welfareService,
            this.insurance,
            this.apit,
            this.epfEmployeeContribution,
            this.totalDeductions,
            this.netPayableSalary,
            this.epfEmployerContribution,
            this.etfEmployerContribution
        );

        // @ts-ignore
        const saveButtonText = saveBtn.textContent.toLowerCase();
        if (saveButtonText === 'save') {

            this.http.post<Salary>(`${environment.apiUrl1}/salary`, salary)
                .subscribe((response: any) => {

                        this.salaryList.push(salary);
                        this.getSalaries();
                        this.clearForm(saveBtn);
                        employeeIDSelect.focus();
                    },
                    (error) => {
                        console.error('Error occurred when saving salary:', error);
                    });

        }

        /*update*/
        if (saveButtonText === 'update') {

            const updateSalary = new Salary(
                this.id,
                this.selectedEmployeeID,
                this.selectedYear,
                this.selectedMonth,
                this.basicSalary,
                this.leaveAllowed,
                this.leaveTaken,
                this.noPayLeave,
                this.convertNumberFormat(this.normalOverTimeHours + ""),
                this.convertNumberFormat(this.specialOverTimeHours + ""),
                this.salaryIncrement,
                this.livingAllowance,
                this.foodAllowance,
                this.conveyanceAllowance,
                this.medicalAllowance,
                this.grossSalary,
                this.overTime,
                this.reimbursements,
                this.bonus,
                this.salaryBeforeDeduction,
                this.noPayDeduction,
                this.salaryAdvance,
                this.welfareService,
                this.insurance,
                this.apit,
                this.epfEmployeeContribution,
                this.totalDeductions,
                this.netPayableSalary,
                this.epfEmployerContribution,
                this.etfEmployerContribution
            );
            this.updateSalary(updateSalary, saveBtn);
        }

    }

    convertNumberFormat(inputTime: string): number {
        // @ts-ignore
        if (inputTime === "0" || inputTime.trim() === "") {
            return 0;
        } else {
            const [hours, minutes] = inputTime.split(':');
            const formattedTime = hours + '.' + minutes;
            return +formattedTime;
        }
    }


    // @ts-ignore
    private clearForm(saveBtn) {
        const inputElements = document.querySelectorAll('.form-control');
        inputElements.forEach((inputElement: Element) => {
            const input = inputElement as HTMLInputElement;
            input.value = '';
        });

        const selectElements = document.querySelectorAll('.form-select');
        selectElements.forEach((selectElement: Element) => {
            const select = selectElement as HTMLSelectElement;
            select.selectedIndex = -1;
        });
        location.reload();

        saveBtn.textContent = 'Save';

    }


    getSalaries() {
        this.http.get<Array<Salary>>(`${environment.apiUrl1}/salary`).subscribe(
            salaries => {
                this.salaryList = salaries;
            },
            error => {
                console.error('Error fetching salaries:', error);
            }
        );
    }

    deleteSalary(salary: Salary) {
        this.http.delete(`${environment.apiUrl1}/salary/${salary.id}`).subscribe(data => {
            const index = this.salaryList.indexOf(salary);
            this.salaryList.splice(index, 1);
        });
    }

    editSalary(salary: Salary, saveBtn: HTMLButtonElement) {
        this.selectedSalary = {...salary};
        saveBtn.textContent = 'Update';

        this.id = salary.id;
        this.selectedEmployeeID = salary.employeeID;
        this.selectedYear = salary.year;
        this.selectedMonth = salary.month;
        this.basicSalary = salary.basicSalary;
        this.leaveAllowed = salary.leaveAllowed;
        this.leaveTaken = salary.leaveTaken;
        this.noPayLeave = salary.noPayLeave;
        this.normalOverTimeHours = this.convertTimeFormat(salary.normalOverTimeHours);
        this.specialOverTimeHours = this.convertTimeFormat(salary.specialOverTimeHours);
        this.salaryIncrement = salary.salaryIncrement;
        this.livingAllowance = salary.livingAllowance;
        this.foodAllowance = salary.foodAllowance;
        this.conveyanceAllowance = salary.conveyanceAllowance;
        this.medicalAllowance = salary.medicalAllowance;
        this.grossSalary = salary.grossSalary;
        this.overTime = salary.overTime;
        this.reimbursements = salary.reimbursements;
        this.bonus = salary.bonus;
        this.salaryBeforeDeduction = salary.salaryBeforeDeduction;
        this.noPayDeduction = salary.noPayDeduction;
        this.salaryAdvance = salary.salaryAdvance;
        this.welfareService = salary.welfareService;
        this.insurance = salary.insurance;
        this.apit = salary.apit;
        this.totalDeductions = salary.totalDeductions;
        this.netPayableSalary = salary.netPayableSalary;
        this.epfEmployeeContribution = salary.epfEmployeeContribution;
        this.epfEmployerContribution = salary.epfEmployerContribution;
        this.etfEmployerContribution = salary.etfEmployerContribution;

    }
    convertTimeFormat(timeAsNumber:any): string {

        const splitNumber = timeAsNumber.toString().split(".");
        const hours = parseInt(splitNumber[0]);
        const minutes = parseInt(splitNumber[1]);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }


    // @ts-ignore
    updateSalary(salary, saveBtn) {

        this.http.patch<Salary>(`${environment.apiUrl1}/salary/${salary.id} `, salary)
            .subscribe(() => {
                    console.log(`successfully update ${salary.id}`);
                    saveBtn.textContent = 'Save';
                    this.clearForm(saveBtn);
                    this.getSalaries();
                },
                (error) => {

                    console.error('Error updating salary:', error);
                }
            );


    }
}
