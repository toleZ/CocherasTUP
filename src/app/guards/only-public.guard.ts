import { CanActivateFn, Router } from "@angular/router";
import { AuthDataService } from "../services/auth-data.service";
import { inject } from "@angular/core";

export const onlyPublicGuard: CanActivateFn = (route, state) => {
  const authDataService = inject(AuthDataService);
  const router = inject(Router);

  if (!authDataService.user) return true;
  else return router.navigate(["/login"]);
};
