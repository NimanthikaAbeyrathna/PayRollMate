import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Employee} from "../dto/employee";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Year} from "../dto/year";
import {Bank} from "../dto/bank";


@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent {
  private breakpointObserver = inject(BreakpointObserver);
  previewImageUrl: string | ArrayBuffer | null = null;
  employeeList: Array<Employee> = [];
  file = null;
  selectedEmployee: any = {};
  isEditMode = false;
  isPopupVisible: boolean = false;
  bankList: Array<Bank> = [];
  selectedBank: string='';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay());


  handleImageUpload(event: any): void {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImageUrl = e.target.result;
    };
    // @ts-ignore
    reader.readAsDataURL(this.file);
  }

  constructor(private http: HttpClient) {

    http.get<Array<Employee>>(`${environment.apiUrl1}/employee`).subscribe(employeeList => {
      this.employeeList = employeeList;
    });

    this.getBanks();
  }


  onFormSubmit(event: any, employeeIDElm: HTMLInputElement, fullNameElm: HTMLInputElement,
               idNoElm: HTMLInputElement, genderElm: HTMLInputElement, dobElm: HTMLInputElement,
               addressElm: HTMLInputElement, contactNumberElm: HTMLInputElement,
               emailElm: HTMLInputElement, departmentElm: HTMLInputElement,
               postElm: HTMLInputElement, epfNumberElm: HTMLInputElement,
               basicSalaryElm: HTMLInputElement,
               branchNameElm: HTMLInputElement, accNumberElm: HTMLInputElement,
               submit: HTMLButtonElement, previewImage: HTMLDivElement) {
    event.preventDefault();

    const employee = new Employee(
      employeeIDElm.value,
      fullNameElm.value,
      idNoElm.value,
      genderElm.value,
      new Date(dobElm.value),
      addressElm.value,
      contactNumberElm.value,
      emailElm.value,
      departmentElm.value,
      postElm.value,
      epfNumberElm.value,
      +basicSalaryElm.value,
      this.selectedBank,
      branchNameElm.value,
      +accNumberElm.value,
      ""
    );
    // @ts-ignore
    const saveButtonText = submit.textContent.toLowerCase();

    if (saveButtonText === 'submit') {

      this.http.post<Employee>(`${environment.apiUrl1}/employee`, employee)
        .subscribe((response: any) => {
            // Success handling here
            this.employeeList.push(employee);

            this.clearFormInputs(submit, previewImage);
            employeeIDElm.focus();
          },
          (error) => {
            console.error('Error occurred:', error);
          });

      this.sendFiles(employee);
    }

    /*update*/
    if (saveButtonText === 'update') {
      this.updateEmployee(employee, submit);
    }

  }

  // @ts-ignore
  private clearFormInputs(submit, previewImage) {
    const inputElements = document.querySelectorAll('.form-control');
    inputElements.forEach((inputElement: Element) => {
      const input = inputElement as HTMLInputElement;
      input.value = '';
    });
    submit.textContent = 'Save';
    previewImage.style.backgroundImage = `url("")`;
  }

  // @ts-ignore
  private sendFiles(employee) {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('files', this.file);
    formData.append('employee', JSON.stringify(employee));


    this.http.post<any>(`${environment.apiUrl1}/employee`, formData).subscribe(
      (response: any) => {
        location.reload();
        // Success handling here
        console.log('success');

      },
      (error) => {
        console.error('Cant send Form data', error);
      }
    );

  }


  deleteEmployee(employee: Employee) {
    this.http.delete(`${environment.apiUrl1}/employee/${employee.employeeID}`).subscribe(data => {
      const index = this.employeeList.indexOf(employee);
      this.employeeList.splice(index, 1);
    });

  }

  edit(employee: Employee, previewImage: any, submit: HTMLButtonElement) {
    /*spread syntax in JavaScript/TypeScript. This syntax is used to create a shallow copy of the employee object*/
    this.selectedEmployee = {...employee};
    previewImage.style.backgroundImage = `url(${employee.imageUrl})`;
    this.selectedBank=employee.bankName;
    submit.textContent = 'Update';
    this.isEditMode = true;

  }


  // @ts-ignore
  updateEmployee(employee, submit) {

    this.http.patch<Employee>(`${environment.apiUrl1}/employee/${employee.employeeID} `, employee)
      .subscribe(
        () => {
          console.log(`successfully update ${employee.employeeID}`);
          submit.textContent = 'Save';
          this.isEditMode = false;
          this.sendFiles(employee);
          location.reload();
        },
        (error) => {

          console.error('Error updating employee:', error);
        }
      );


  }

  clearForm(submit: HTMLButtonElement, previewImage: HTMLDivElement) {
    submit.textContent = 'Save';
    previewImage.style.backgroundImage = `url("")`;
  }


  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  getBanks() {
    this.http.get<Array<Bank>>(`${environment.apiUrl2}/employee/bank`).subscribe(
      formattedBanks => {
        this.bankList = formattedBanks;
      },
      error => {
        console.error('Error fetching banks:', error);
      }
    );
  }

  saveBank($event: MouseEvent, bankNameInputElm: HTMLInputElement) {
    $event.preventDefault();

    const bank = new Bank(
      0,
      bankNameInputElm.value
    );

    this.http.post<Bank>(`${environment.apiUrl2}/employee/bank`, bank)
      .subscribe((response: any) => {
          // Success handling here
          this.bankList.push(bank);
          this.getBanks();
          bankNameInputElm.value = '';
          bankNameInputElm.focus();
        },
        (error) => {
          console.error('Error occurred when saving bank', error);
        });
  }

  deleteBank(bank: Bank) {
    this.http.delete(`${environment.apiUrl2}/employee/bank/${bank.id}`).subscribe(data => {
      const index = this.bankList.indexOf(bank);
      this.bankList.splice(index, 1);
    });

  }
}









