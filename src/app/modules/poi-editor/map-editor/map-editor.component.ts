import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LngLat, Map } from 'maplibre-gl';
import { FeatureCollection, Point } from 'geojson';

import { BannerInstructionsComponent, EditPanelComponent } from '../components';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

import { EditingPoint, MapPointClickEvent, ValidationResult } from '@interfaces/index';
import { PoiManagerService } from '@services/index';
import { MapCustomComponent } from '@shared/components';
import { COLLECTION_VOID } from '@constants/index';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MapCustomComponent,
    EditPanelComponent,
    BannerInstructionsComponent,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    FileUploadModule
  ],
})
export default class MapEditorComponent implements OnInit, OnDestroy {
  data = signal<FeatureCollection<Point>>({ ...COLLECTION_VOID });

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  editingPoint: EditingPoint | null = null;
  validationMessage: string = '';
  errorMessage: string = '';

  reFitBounds = 0;

  private destroy$ = new Subject<void>();

  constructor(public poiService: PoiManagerService) {}

  ngOnInit(): void {
    this.poiService.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.data.set(data);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUpdatePoi($event: EditingPoint) {
    this.editingPoint = { ...$event };
    this.poiService.updatePoint(this.editingPoint.index, {
      name: this.editingPoint.name,
      category: this.editingPoint.category,
    });
    this.messageService.add({
      summary: 'Punto de interés actualizado',
      severity: 'success',
      life: 3000,
    });
  }

  onMapReady(map: Map): void {
    console.log('Map loaded and ready');
  }

  onMapClick(lngLat: LngLat): void {
    if (this.editingPoint) {
      return;
    }

    this.poiService.addPoint(lngLat.lng, lngLat.lat);
    this.clearMessages();
  }

  onPointClick(event: MapPointClickEvent): void {
    this.startEditing(event.index);
  }

  startEditing(index: number): void {
    const feature = this.data().features[index];
    this.editingPoint = {
      index,
      name: feature.properties['name'],
      category: feature.properties['category'],
    };
    this.clearMessages();
  }

  deletePoint(): void {
    if (!this.editingPoint) {
      return;
    }
    this.poiService.deletePoint(this.editingPoint.index);
    this.messageService.add({
      severity: 'info',
      summary: 'Punto de interés eliminado',
    });
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingPoint = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const result = this.poiService.importGeoJson(data);
        this.showValidationResult(result);

        if (result.validFeatures.length > 0) {
          setTimeout(() => {
            this.reFitBounds += 1;
          }, 200);
        }
      } catch (error) {
        this.showError('Invalid JSON file');
      }
    };

    reader.readAsText(file);
    input.value = '';
  }

  private showValidationResult(result: ValidationResult): void {
    const total = result.validFeatures.length + result.invalidCount;

    let message = `Importado ${result.validFeatures.length} de ${total} puntos`;

    if (result.invalidCount > 0) {
      const details: string[] = [];
      if (result.errors.invalidCoordinates > 0) {
        details.push(`${result.errors.invalidCoordinates} con coordenadas inválidas`);
      }
      if (result.errors.invalidGeometry > 0) {
        details.push(`${result.errors.invalidGeometry} con geometría inválida`);
      }
      if (result.errors.missingProperties > 0) {
        details.push(`${result.errors.missingProperties} sin propiedades`);
      }
      if (result.errors.other > 0) {
        details.push(`${result.errors.other} otros errores`);
      }

      message += `. Se descartaron ${result.invalidCount} (${details.join(', ')})`;
    }

    this.validationMessage = message;
    setTimeout(() => this.clearMessages(), 8000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.clearMessages(), 5000);
  }

  private clearMessages(): void {
    this.validationMessage = '';
    this.errorMessage = '';
  }

  exportData(): void {
    this.poiService.export();
    this.clearMessages();
  }

  clearAll(): void {
    this.confirmationService.confirm({
      message: '¿Desea borrar todos los puntos?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Confirmar',
      accept: () => {
        this.poiService.clear();
        this.cancelEdit();
        this.clearMessages();
        this.messageService.add({
          severity: 'info',
          summary: 'Datos borrados',
        });
      },
    });
  }
}
