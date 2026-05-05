import { Component, inject, OnInit } from '@angular/core';
import { Service } from '../../model/service.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { ServiceTableComponent } from '../../components/service-table/service-table.component';
import { ServiceAssembler } from '../../services/service.assembler';
import { ServiceApiService } from '../../services/services-api.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateServiceDialogComponent } from '../../components/service-dialog/service-dialog.component';
import { ServiceResponse } from '../../services/service.response';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-services-tab',
  imports: [
    TranslatePipe,
    ServiceTableComponent,
    MatButton,
  ],
  templateUrl: './services-tab.component.html',
  styleUrl: './services-tab.component.css'
})
export class ServicesTabComponent implements OnInit {
  service: Service[] = [];
  newService: ServiceResponse | null = null;
  private serviceService = inject(ServiceApiService);
  private dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
    this.loadServices(); // Llamamos al cargar
  }

  openCreateServiceDialog() {
    const dialogRef = this.dialog.open(CreateServiceDialogComponent);

    dialogRef.afterClosed().subscribe((result: ServiceResponse | undefined) => {
      if (result) {
        const providerId = localStorage.getItem('providerId');
        if (!providerId) return;
        const newService: ServiceResponse = { ...result, providerId: parseInt(providerId, 10) };

        this.serviceService.post(newService).subscribe(() => {
          this.loadServices(); // Recarga la lista después del POST
        });
      }
    });
  }

  private loadServices(): void {
    const providerIdString = localStorage.getItem('providerId');

    if (!providerIdString) {
      console.error('No providerId found in localStorage');
      return;
    }

    const providerId = Number(providerIdString);
    console.log('[DEBUG] providerId desde localStorage:', providerId);

    this.serviceService.getAll().subscribe(service => {
      console.log('[DEBUG] Respuesta cruda del GET /services:', service);
      this.service = ServiceAssembler.toEntitiesFromResponse(service)
        .filter(s => s.providerId == providerId);
      console.log('[DEBUG] Después de filtrar por salonId:', this.service);

    });

  }
}
