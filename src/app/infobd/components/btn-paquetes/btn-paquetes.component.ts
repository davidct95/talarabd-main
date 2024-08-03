import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BdserviceService } from '../../services/bdservice.service';
import { ComponentsService } from '../../services/components.service';
import { PaqueteSector } from '../../interface/paquete.inteface';

@Component({
  selector: 'app-btn-paquetes',
  templateUrl: './btn-paquetes.component.html',
  styles: [
  ]
})
export class BtnPaquetesComponent implements OnInit{

  public sector: number = 0;
  public paquetes: PaqueteSector[] = [];

  constructor( private activatedRoute: ActivatedRoute,
                private bdService: BdserviceService,
                private cdr: ChangeDetectorRef,
                private componentsService: ComponentsService,
                private router: Router,
   ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const rutaSector = params.get('sector')
      this.sector = parseInt(rutaSector!.slice(rutaSector!.length - 1, rutaSector!.length));

      console.log('Sector actualizado:', this.sector);
    })

    this.cargarPaquetes();

    this.componentsService.archivoSubido$.subscribe(() => {
      this.cargarPaquetes(); // Actualiza la lista de paquetes cuando se sube un archivo
    });
  }

  navegarPaquete( paqueteId: number ) {
    this.componentsService.getSectorClicado().subscribe(sector => {
      const url = this.router.navigate([`pq/${paqueteId}`], {queryParams: {sc: sector}, queryParamsHandling: 'merge'});
    })

  }

  cargarPaquetes() {
    this.bdService.getComponente().subscribe(data => {
      this.paquetes = []; // Reinicia la lista de paquetes

      console.log(data)
      for (let obj of data) {

        const exists = this.paquetes.find(p => p.paquete === obj.paquete && p.sector === obj.sector);

        if (!exists) {
          this.paquetes.push({paquete: obj.paquete, sector: obj.sector});
          this.paquetes.sort((a,b) => a.paquete - b.paquete)
        }

      }

      console.log(this.paquetes)
      this.cdr.detectChanges(); // Forzar la detección de cambios si es necesario
    });
  }

}
