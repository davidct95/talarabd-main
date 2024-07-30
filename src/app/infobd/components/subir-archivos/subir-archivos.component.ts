import { Component } from '@angular/core';
import { BdserviceService } from '../../services/bdservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-subir-archivos',
  templateUrl: './subir-archivos.component.html',
  styles: [
  ]
})
export class SubirArchivosComponent {

  archivoSubido: boolean = false;

  constructor(private bdService: BdserviceService, private componentsService: ComponentsService) { }

  subirArchivo(fileInput: any) {
    
    this.bdService.upload(fileInput).subscribe(
      response => {
        console.log('Archivo subido correctamente:', response);
        this.archivoSubido = true; // Actualiza el estado para mostrar el mensaje de archivo subido
        this.componentsService.notificarArchivoSubido();
        fileInput.value = null;
      },
      error => {
        console.error('Error al subir el archivo:', error);
        // Maneja el error según sea necesario
      }
    );
  }
}
