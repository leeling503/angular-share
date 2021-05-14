import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login.routing';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginValiateDirective } from './login-valiate.directive';

@NgModule({
  declarations: [LoginComponent, LoginValiateDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
