import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Worker } from '../../models/worker.entity';
import { WorkerApiService } from '../../services/worker-api.service';
import { WorkerResource } from '../../services/worker.resource';
import { StaffListComponent } from '../../components/staff-list/staff-list.component';
import { WorkerDialogComponent } from '../../components/worker-dialog/worker-dialog.component';

type LoadStatus = 'loading' | 'success' | 'empty' | 'failure';

@Component({
  selector: 'app-workers-tab',
  imports: [
    CommonModule,
    TranslatePipe,
    StaffListComponent,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './workers-tab.component.html',
  styleUrl: './workers-tab.component.css'
})
export class WorkersTabComponent implements OnInit {
  workers: Worker[] = [];
  status: LoadStatus = 'loading';
  errorMessage: string | null = null;

  private workerService = inject(WorkerApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.loadWorkers();
  }

  retry(): void {
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.status = 'loading';
    this.errorMessage = null;

    const providerIdString = localStorage.getItem('providerId');
    if (!providerIdString) {
      this.status = 'failure';
      this.errorMessage = 'No se encontró tu sesión activa. Vuelve a iniciar sesión.';
      return;
    }
    const providerId = Number(providerIdString);

    this.workerService.getWorkers().subscribe({
      next: workers => {
        this.workers = workers.filter(w => w.providerId === providerId);
        this.status = this.workers.length === 0 ? 'empty' : 'success';
      },
      error: err => {
        this.status = 'failure';
        this.errorMessage = err?.message || 'No pudimos cargar tu personal.';
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(WorkerDialogComponent);

    dialogRef.afterClosed().subscribe((result: WorkerResource | undefined) => {
      if (!result) return;

      this.workerService.post(result).subscribe({
        next: () => {
          this.snackBar.open('✅ ' + this.instant('workers.created'), 'Cerrar', { duration: 2500, panelClass: 'u-snack-success' });
          this.loadWorkers();
        },
        error: () => {
          this.snackBar.open('❌ ' + this.instant('workers.createError'), 'Cerrar', { duration: 3000, panelClass: 'u-snack-error' });
        }
      });
    });
  }

  openEditDialog(worker: Worker): void {
    const resource: WorkerResource = { ...worker };
    const dialogRef = this.dialog.open(WorkerDialogComponent, { data: resource });

    dialogRef.afterClosed().subscribe((result: WorkerResource | undefined) => {
      if (!result) return;

      this.workerService.update(result.id, result).subscribe({
        next: () => {
          this.snackBar.open('✏️ ' + this.instant('workers.updated'), 'Cerrar', { duration: 2500, panelClass: 'u-snack-success' });
          this.loadWorkers();
        },
        error: () => {
          this.snackBar.open('❌ ' + this.instant('workers.updateError'), 'Cerrar', { duration: 3000, panelClass: 'u-snack-error' });
        }
      });
    });
  }

  deleteWorker(worker: Worker): void {
    const confirmed = window.confirm(
      `${this.instant('workers.deleteConfirmTitle')} "${worker.name}". ${this.instant('workers.deleteConfirmText')}`
    );
    if (!confirmed) return;

    this.workerService.delete(worker.id).subscribe({
      next: () => {
        this.workers = this.workers.filter(w => w.id !== worker.id);
        if (this.workers.length === 0) this.status = 'empty';
        this.snackBar.open('🗑️ ' + this.instant('workers.deleted'), 'Cerrar', { duration: 2500, panelClass: 'u-snack-success' });
      },
      error: () => {
        this.snackBar.open('❌ ' + this.instant('workers.deleteError'), 'Cerrar', { duration: 3000, panelClass: 'u-snack-error' });
      }
    });
  }

  /** Pequeño helper para traducir mensajes fuera de plantillas (snackbars). */
  private instant(key: string): string {
    return this.translate.instant(key);
  }
}
