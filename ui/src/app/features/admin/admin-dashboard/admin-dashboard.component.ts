import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  readonly routes = AppRoutes;
}
