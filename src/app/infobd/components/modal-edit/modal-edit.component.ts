import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BdserviceService } from '../../services/bdservice.service';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styles: [
  ]
})
export class ModalEditComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private bdService: BdserviceService
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Envía los datos actualizados y el ID del componente a tu endpoint
    const id = this.data.componente.id; // Supongamos que el ID está en data.componente.id
    const updatedData = this.data.componente;

    this.bdService.actualizarDatos(id, updatedData)
      .subscribe(response => {
        console.log('Datos actualizados correctamente:', response);
        // Cierra el modal después de que los datos se hayan guardado exitosamente
        this.dialogRef.close();
      }, error => {
        console.error('Error al actualizar los datos:', error);
        // Puedes manejar el error de alguna manera, por ejemplo, mostrar un mensaje al usuario
      });
  }
}
