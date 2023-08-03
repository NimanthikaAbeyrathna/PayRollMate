import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavComponent} from './nav/nav.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {NgOptimizedImage} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {NewEmployeeComponent} from './new-employee/new-employee.component';
import {SallaryGenerateComponent} from './sallary-generate/sallary-generate.component';
import {PaySheetPrintComponent} from './pay-sheet-print/pay-sheet-print.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";

const routes: Routes = [{
    path: '',
    component: NavComponent
  },
  {
    path: 'new-employee',
    component: NewEmployeeComponent
  },
  {
    path: 'salary-generate',
    component: SallaryGenerateComponent
  },
  {
    path: 'pay-sheet-print',
    component: PaySheetPrintComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NewEmployeeComponent,
    SallaryGenerateComponent,
    PaySheetPrintComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgOptimizedImage,
    RouterModule.forRoot(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    FormsModule,
    ToastrModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
