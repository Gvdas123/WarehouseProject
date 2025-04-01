import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProjectsComponent } from './projects/projects.component';
import { ScanProductComponent } from './scan-product/scan-product.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { MasterProjectsComponent } from './master-projects/master-projects.component';
import { UsersComponent } from './users/users.component';
import { SetProductComponent } from './set-product/set-product.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'auth', component: AuthComponent },
      { path: 'projects', component: ProjectsComponent },
     { path: 'scan/:projectId', component: ScanProductComponent },
     {path: 'master-login', component: LoginComponent },

     {path: 'Main', component: MainComponent, canActivate: [authGuard]  },
     {path: 'master-projects', component: MasterProjectsComponent, canActivate: [authGuard]  },
     {path: 'users', component: UsersComponent, canActivate: [authGuard]  },
     {path:'project/:projectId', component: SetProductComponent, canActivate: [authGuard]  },
];
