import { Component, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ValidatorsServiceService } from 'src/app/core/services/ValidatorsService.service';

@Component({
  selector: 'form-field',
  template: `
    <div class="block mb-2 text-sm font-medium text-gray-900"><ng-content select=".f-label"></ng-content></div>
    <div
      class="form-group bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
      [ngClass]="radius ? 'radius' : ''"
      [ngClass]="{'b-red' :control?.['touched'] && control?.['invalid']  }"
    >
      <div class="f-prefix">
        <ng-content select=".f-prefix"></ng-content>
      </div>
      <div class="form-control-wapper">
        <ng-content select=".f-control"></ng-content>
        <ng-content select=".f-select"></ng-content>
      </div>
      <div class="form-append">
        <ng-content select=".f-append"></ng-content>
      </div>
    </div>
    <div
      class="text-xs text-red-500"
      *ngIf="control?.['touched'] && control?.['invalid']"
    >
      {{ error }}
    </div>
  `,
  styles:[
    `:host {
      display: block;
      margin-top: 2px;
      &.search{
        .form-group{
          background: #F7F4F6 !important;
          border: 1px solid #E8DEE6 !important;
          border-radius: 10px !important;
        }
      }
      &.auth{ 
        .error  {
          color: rgb(0, 0, 0);
          text-align: left;
          font-size: 12px;
          font-weight: 500;
        }
      }
      .form-group {
        display: flex;
        width: 100%;
        margin-bottom: 7px;
        position: relative;
        &.b-red{
          border: 2px solid red !important;
        }
        
        &.radius {
          border-radius: 30px;
          padding: 10px 10px;
        }
    
        .form-control-wapper {
          flex: 1;
        }
    
        .f-prefix,
        .f-append {
          display: flex;
          align-items: center;
    
          img {
            padding-right: 0.5rem;
            vertical-align: middle;
          }
        }
      }
    
    }
    
    :host ::ng-deep {
    
      input,
      textarea {
        border: none;
        outline: none;
        width: 100%;
        background-color: transparent;
        resize: none;
      }
    
      textarea {
        height: auto !important;
      }
    }
    .b-red{
      border: 2px solid red;
    }`
  ],
})
export class FormFieldComponent implements OnInit {
  @Input('errorControl') control: ValidationErrors | null = null;
  @Input('name') name?: string = '';
  @Input('radius') radius?: boolean;
  @Input('select') select?: boolean = false;

  constructor() {}

  ngOnInit() {}

  get error() {
    return 
    // return ValidatorsServiceService.ngControlError(
    //   this.control?.['errors'],
    //   this.name
    // );
  }
}
