import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BdserviceService } from '../../services/bdservice.service';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-tabla-propiedades',
  templateUrl: './tabla-propiedades.component.html',
  styles: [
  ]
})
export class TablaPropiedadesComponent implements OnInit {

  id!: string;
  propiedades!: any[];
  claves!: any;
  valores!: any[];
  seccionActual: any;

  buttonUpd: boolean = false;
  objeto: any = {};

  constructor(private route: ActivatedRoute, private bdserviceService: BdserviceService, private componentsService: ComponentsService) { }

  ngOnInit(): void {

    this.componentsService.archivoSubido$.subscribe(() => {
      this.getProperties();
    })

    this.getProperties();

  }

  onRegistroSeleccionado(seccionActual: any) {
    this.seccionActual = seccionActual
  }

  getProperties() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.bdserviceService.getPropiedades(this.id)
        .subscribe(resp => {
          this.propiedades = resp;
          this.claves = Object.keys(this.propiedades);
          this.valores = Object.values(this.propiedades);
        });
    });
  }

  actualizarPropiedades(claves: string[], valores: any[]) {
    const id: string = valores[0]; // Suponiendo que el ID es el primer valor
    const componenteActualizado: any = {}; // Crear un objeto para enviar
  
    // Asignar los valores de claves y valores al objeto
    for (let i = 0; i < claves.length; i++) { // Empezando desde 1 para evitar el ID
      const clave = claves[i];
      const valor = valores[i];
      componenteActualizado[clave] = valor;
    }

    this.objeto = componenteActualizado;

    this.buttonUpd = false;
  
    // Hacer la solicitud PUT
     this.bdserviceService.actualizarDatos(id, this.objeto).subscribe(response => {
       console.log('Datos actualizados correctamente:', response);
     }, error => {
       console.error('Error al actualizar los datos:', error);
     });
  }

  changeValueButton() {
    this.buttonUpd = !this.buttonUpd;
  }
}
