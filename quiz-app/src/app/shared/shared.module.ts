import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SortablejsModule } from 'angular-sortablejs';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,

    SortablejsModule,
  ],
  declarations: [],
})
export class SharedModule { }
