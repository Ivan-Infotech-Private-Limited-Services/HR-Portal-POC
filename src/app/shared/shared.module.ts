import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field/form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule],
  declarations: [FormFieldComponent, SideMenuComponent, NoDataFoundComponent],
  exports: [FormFieldComponent, FormsModule, ReactiveFormsModule, SideMenuComponent, RouterModule, NoDataFoundComponent],
})
export class SharedModule {}
