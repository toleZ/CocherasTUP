import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthDataService } from "../services/auth-data.service";

export const onlyAdminGuard: CanActivateFn = (route, state) => {
  const authDataService = inject(AuthDataService);
  const router = inject(Router);

  if (authDataService.user?.esAdmin) return true;
  else return router.navigate(["/parking-state"]);
};
