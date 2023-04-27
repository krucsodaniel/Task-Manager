import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'new-list',
    component: NewListComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lists',
    component: TaskViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lists/:listId',
    component: TaskViewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lists/:listId/new-task',
    component: NewTaskComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'home', component: HomeComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
