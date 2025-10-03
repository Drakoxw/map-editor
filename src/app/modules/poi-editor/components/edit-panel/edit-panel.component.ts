import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { EditingPoint } from '@interfaces/index';
import { FormControlErrorPipe } from '@shared/pipes';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.css'],
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    FormControlErrorPipe,
    ConfirmDialogModule,
  ],
})
export class EditPanelComponent implements OnInit {
  @Output() onClosePanel = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<EditingPoint>();
  @Output() deletePoi = new EventEmitter<number>();

  private confirmationService = inject(ConfirmationService);
  form: FormGroup;

  @Input() editingPoint!: EditingPoint;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [this.editingPoint.name, [Validators.required]],
      category: [this.editingPoint.category, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { name, category } = this.form.value;
      const data = {
        index: this.editingPoint.index,
        name,
        category,
      };
      this.onUpdate.emit(data);
    }
  }

  onDelete() {
    this.confirmationService.confirm({
      message: 'Esta seguro que desea eliminar el punto de interés?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Confirmar',
      accept: () => {
        this.deletePoi.emit(this.editingPoint.index);
        this.onClose();
      },
    });
  }

  onClose() {
    this.onClosePanel.emit();
  }
}
