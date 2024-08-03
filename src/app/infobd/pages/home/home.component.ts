import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { BdserviceService } from '../../services/bdservice.service';
import { NavigationEnd, Router } from '@angular/router';
import { ComponentsService } from '../../services/components.service';

import * as L from 'leaflet';
import proj4 from 'proj4';
import { BehaviorSubject, merge } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit{

  paqueteId: number = 0;

  map?: L.Map;


  constructor(  private router: Router,
                private bdService: BdserviceService,
                private componentsService: ComponentsService) {}

  ngOnInit(): void {

    this.map = L.map('map2', {
      dragging: false,
      zoomControl: false,      // Elimina el control de zoom
      attributionControl: false, // Elimina la atribución
      scrollWheelZoom: false, // Desactiva el zoom con rueda de ratón
      doubleClickZoom: false, // Desactiva el zoom con doble clic
      boxZoom: false,         // Desactiva el zoom con cuadro
      keyboard: false,        // Desactiva el control con teclado
      touchZoom: false        // Desactiva el zoom táctil
    }).setView([0, 0], 2);

    L.tileLayer(
      'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      {
        maxZoom: 19,
        attribution: 'Data by <a href="https://openstreetmap.org">OpenStreetMap contributors</a>'
      }
    ).addTo(this.map)

    proj4.defs('EPSG:32717', '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs');


    this.bdService.getSectores().subscribe( data => {
      const sectores = L.Proj.geoJson( data, {

      }).addTo(this.map!);

      const bounds = sectores.getBounds();

      this.map?.fitBounds(bounds);

      sectores.on('click', (e) => {
        this.componentsService.actualizarSectorClicado(e.layer.feature.properties.Nombre.toLowerCase().replace(/ /g, ""));

        this.componentsService.getSectorClicado().subscribe( sector => {
          this.router.navigate([`talara/${sector}`])
        })
      });
    });


  }




}
