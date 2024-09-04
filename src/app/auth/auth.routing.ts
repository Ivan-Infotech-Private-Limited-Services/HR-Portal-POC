import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path:'', pathMatch:'full', redirectTo:'login' },
      { path: 'login', component: LoginComponent }
    ],
  },
];

export const AuthRoutes = RouterModule.forChild(routes);
