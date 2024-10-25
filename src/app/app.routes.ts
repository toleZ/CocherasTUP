import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { ParkingStateComponent } from "./pages/parking-state/parking-state.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { DashboardContainerComponent } from "./pages/dashboard-container/dashboard-container.component";
import { onlyPublicGuard } from "./guards/only-public.guard";
import { ReportsComponent } from "./pages/reports/reports.component";
import { onlyAdminGuard } from "./guards/only-admin.guard";
import { onlyLoggedGuard } from "./guards/only-logged.guard";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import { RatesComponent } from "./pages/rates/rates.component";

export const routes: Routes = [
  {
    path: "",
    component: DashboardContainerComponent,
    canActivate: [onlyLoggedGuard],
    children: [
      {
        path: "parking-state",
        component: ParkingStateComponent,
      },
      {
        path: "reports",
        component: ReportsComponent,
        canActivate: [onlyAdminGuard],
      },
      {
        path: "rates",
        component: RatesComponent,
        canActivate: [onlyAdminGuard],
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [onlyPublicGuard],
  },
  {
    path: "sign-up",
    component: SignUpComponent,
    canActivate: [onlyPublicGuard],
  },
  {
    path: "not-found",
    component: NotFoundComponent,
  },
  {
    path: "**",
    redirectTo: "not-found",
    pathMatch: "full",
  },
];
