import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { BdserviceService } from '../../services/bdservice.service';
import { Router } from '@angular/router';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit{

  paqueteId: number = 0;

  public paquetes: number[] = [];

  constructor( private bdService: BdserviceService,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private componentsService: ComponentsService) {}

  ngOnInit(): void {
    this.cargarPaquetes();

    this.componentsService.archivoSubido$.subscribe(() => {
      this.cargarPaquetes(); // Actualiza la lista de paquetes cuando se sube un archivo
    });
  }

  cargarPaquetes() {
    this.bdService.getComponente().subscribe(data => {
      this.paquetes = []; // Reinicia la lista de paquetes
      for (let obj of data) {
        if (!this.paquetes.includes(obj.paquete)) {
          this.paquetes.push(obj.paquete);
          this.paquetes.sort((a: any, b: any) => a - b);
        }
      }
      this.cdr.detectChanges(); // Forzar la detección de cambios si es necesario
    });
  }

  navegarPaquete( paqueteId: number ) {
    const url = this.router.navigate([`bd/${paqueteId}`]);
  }
}
