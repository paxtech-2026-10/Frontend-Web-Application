import {Component, inject, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource,
  MatTableModule
} from '@angular/material/table';
import { Service } from '../../model/service.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ServiceApiService } from '../../services/services-api.service';
import { ServiceAssembler } from '../../services/service.assembler';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceResponse } from '../../services/service.response';
import {CreateServiceDialogComponent} from '../service-dialog/service-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-service-table',
  imports: [
    MatTable,
    MatIcon,
    TranslatePipe,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatButton
  ],
  templateUrl: './service-table.component.html',
  styleUrl: './service-table.component.css'
})
export class ServiceTableComponent implements OnChanges {

  dataSource = new MatTableDataSource<Service>();

  displayedColumns: string[] = ['name', 'duration', 'price', 'status', 'actions'];
  @Input() services: Service[] = [];
  @Input() newService: ServiceResponse | null = null;


  private servicesService: ServiceApiService = inject(ServiceApiService);

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnChanges() {
    console.log('[DEBUG] Tabla recibe services:', this.services);
    if (this.newService) {
      console.log('[DEBUG] Se recibió newService para postear:', this.newService);
      this.servicesService.post(this.newService).subscribe({
        next: (response) => {
          const entity = ServiceAssembler.toEntityFromResource(response);
          this.services.push(entity);
          this.snackBar.open('✅ Servicio creado con éxito.', 'Cerrar', { duration: 2000 });
        },
        error: (err) => {
          this.snackBar.open('❌ Error al crear el servicio.', 'Cerrar', { duration: 2000 });
          console.error(err);
        }
      });
    }
  }

  public createService(service: ServiceResponse): void {
    this.servicesService.post(service).subscribe({
      next: (response) => {
        const created = ServiceAssembler.toEntityFromResource(response);
        this.services = [...this.services, created]; // actualiza la lista
        this.snackBar.open('✅ Servicio creado con éxito.', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('❌ Error al crear el servicio:', err);
        this.snackBar.open('❌ Error al crear el servicio.', 'Cerrar', { duration: 2000 });
      }
    });
  }

  public deleteService(id: number): void {
    console.log('Deleting from endpoint:', this.servicesService.resourcePath());
    console.log('🔧 Service API Instance:', this.servicesService);
    console.log('DELETE URL:', `${this.servicesService.resourcePath()}/${id}`);


    this.servicesService.delete(id).subscribe(() => {
      this.services = this.services.filter(s => s.id !== id);
      this.dataSource.data = this.dataSource.data.filter(s => s.id !== id);  // ④
      this.snackBar.open('🗑️ Servicio eliminado.', 'Cerrar', { duration: 2000 });
    });
  }

  updateService(original: Service) {
    // 1. Abrimos el diálogo precargando los datos
    const dialogRef = this.dialog.open(CreateServiceDialogComponent, {
      data: {                        // el dialog usa esta data para “modo edición”
        ...original,
        isEdit: true
      }
    });

    // 2. Esperamos la respuesta del dialog
    dialogRef.afterClosed().subscribe((result?: ServiceResponse) => {
      if (!result) return;           // usuario canceló

      // 3. Llamamos al backend
      this.servicesService.update(original.id, result).subscribe({
        next: res => {
          // Convierte el recurso a entidad
          const updated = ServiceAssembler.toEntityFromResource(res);

          // 4A. Opción 1 – refrescar tabla localmente
          this.services = this.services.map(s =>
            s.id === updated.id ? updated : s
          );

          /* 4B. Opción 2 – avisar al padre para recargar desde BD
             this.refresh.emit();
          */

          this.snackBar.open('✏️ Servicio actualizado.', 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('❌ Error al actualizar.', 'Cerrar', { duration: 2000 });
        }
      });
    });
  }

  editService(service: Service) {
    const dialogRef = this.dialog.open(CreateServiceDialogComponent, {
      data: service // ← pasamos el servicio a editar
    });

    dialogRef.afterClosed().subscribe((result: ServiceResponse | undefined) => {
      if (result) {
        this.servicesService.update(result.id, result).subscribe({
          next: (updated) => {
            const index = this.services.findIndex(s => s.id === updated.id);
            if (index > -1) {
              this.services[index] = { ...updated };
            }
            this.snackBar.open('✏️ Servicio actualizado con éxito.', 'Cerrar', { duration: 2000 });
          },
          error: (err) => {
            console.error('❌ Error al actualizar el servicio:', err);
            this.snackBar.open('❌ Error al actualizar.', 'Cerrar', { duration: 2000 });
          }
        });
      }
    });
  }


}
