import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutenticacionComponent } from './autenticacion/autenticacion.component';

import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { AccountgoogleComponent } from './accountgoogle/accountgoogle.component';
import { RedirectaccountgoogleComponent } from './redirectaccountgoogle/redirectaccountgoogle.component';
import { FormsModule } from '@angular/forms';
import { RegistrarComponent } from './registrar/registrar.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    AutenticacionComponent,
    AccountgoogleComponent,
    RedirectaccountgoogleComponent,
    RegistrarComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatTabsModule,
    FormsModule,
    MatProgressSpinnerModule
  ]
})

export class AutenticacionModule { }
