import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-dashboard-container",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./dashboard-container.component.html",
  styleUrl: "./dashboard-container.component.scss",
})
export class DashboardContainerComponent {
  isAdmin = true;
}
