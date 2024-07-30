import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { ComponentsService } from 'src/app/infobd/services/components.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit{

  public titulo: string = '';

  public paqueteId: any;

  constructor( private router: Router,
                private activateRoute: ActivatedRoute,
                private componentsService: ComponentsService) {}

  ngOnInit(): void {




    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('/talara')) {
          this.titulo = 'INICIO';
        } else if (this.router.url.includes('/bd')) {
          this.componentsService.getPaqueteId().subscribe( paqueteId => {
            this.titulo = `ENTREGA DEL DRENAJE PLUVIAL INTEGRAL DE LA CIUDAD DE TALARA (PAQUETE D0${paqueteId})`;
          })
        }
      }
    });
  }

}
