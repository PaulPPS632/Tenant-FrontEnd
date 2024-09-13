import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginasComponent } from './paginas.component';

import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PaginasComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ]
})
export class PaginasModule { }
