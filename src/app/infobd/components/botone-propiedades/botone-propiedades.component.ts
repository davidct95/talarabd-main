import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

interface Seccion {
  rangoIndices: number[];
}

@Component({
  selector: 'app-botone-propiedades',
  templateUrl: './botone-propiedades.component.html',
  styles: [
  ]
})
export class BotonePropiedadesComponent {

  @Output() registroSeleccionado: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog){
  }

   // Definir el objeto secciones con la estructura especificada
   secciones: { [key: string]: Seccion } = {
    dai_01: { rangoIndices: [14, 15, 16, 17, 18, 19, 20, 21, 22] },
    dai_02: { rangoIndices: [23, 24, 25, 26, 27] },
    dai_03: { rangoIndices: [28, 29, 30, 31, 32, 33] },
    dai_04: { rangoIndices: [34, 35, 36, 37, 38, 39, 40] },
    dai_05: { rangoIndices: [41, 42, 43, 44, 45, 46] },
    // Define más secciones según sea necesario
  };

  mostrarSeccion(seccion: string) {
    this.registroSeleccionado.emit(this.secciones[seccion]);
  }
}
