import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../model/service.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { ServiceTableComponent } from '../../components/service-table/service-table.component';
import { ServiceAssembler } from '../../services/service.assembler';
import { ServiceApiService } from '../../services/services-api.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateServiceDialogComponent } from '../../components/service-dialog/service-dialog.component';
import { ServiceResponse } from '../../services/service.response';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

type LoadStatus = 'loading' | 'success' | 'empty' | 'failure';

@Component({
  selector: 'app-services-tab',
  imports: [
    CommonModule,
    TranslatePipe,
    ServiceTableComponent,
    MatButton,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './services-tab.component.html',
  styleUrl: './services-tab.component.css'
})
export class ServicesTabComponent implements OnInit {
  service: Service[] = [];
  newService: ServiceResponse | null = null;
  status: LoadStatus = 'loading';
  errorMessage: string | null = null;

  private serviceService = inject(ServiceApiService);
  private dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
    this.loadServices();
  }

  retry(): void {
    this.loadServices();
  }

  openCreateServiceDialog() {
    const dialogRef = this.dialog.open(CreateServiceDialogComponent);

    dialogRef.afterClosed().subscribe((result: ServiceResponse | undefined) => {
      if (result) {
        const providerId = localStorage.getItem('providerId');
        if (!providerId) return;
        const newService: ServiceResponse = { ...result, providerId: parseInt(providerId, 10) };

        this.serviceService.post(newService).subscribe({
          next: () => this.loadServices(),
          error: () => {
            this.status = 'failure';
            this.errorMessage = 'No pudimos crear el servicio. Inténtalo de nuevo.';
          }
        });
      }
    });
  }

  loadServices(): void {
    this.status = 'loading';
    this.errorMessage = null;

    const providerIdString = localStorage.getItem('providerId');
    if (!providerIdString) {
      this.status = 'failure';
      this.errorMessage = 'No se encontró tu sesión activa. Vuelve a iniciar sesión.';
      return;
    }

    const providerId = Number(providerIdString);

    this.serviceService.getAll().subscribe({
      next: raw => {
        const filtered = ServiceAssembler
          .toEntitiesFromResponse(raw)
          .filter(s => s.providerId == providerId);
        this.service = filtered;
        this.status = filtered.length === 0 ? 'empty' : 'success';
      },
      error: err => {
        this.status = 'failure';
        this.errorMessage = err?.message || 'No pudimos cargar tus servicios.';
      }
    });
  }
}
