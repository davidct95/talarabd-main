import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { BdserviceService } from '../../services/bdservice.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
export class HomeComponent implements OnInit {

  map?: L.Map | undefined;
  miniMap?: L.Map | undefined;

  existeSector: boolean = false

  constructor(private router: Router,
              private bdService: BdserviceService,
              private componentsService: ComponentsService) { }

  ngOnInit(): void {

    this.existeSector =  localStorage.getItem('existeSector') === 'true' ? true : false

    console.log(this.router.url)

    if( this.router.url === '/talara' ) {
      this.existeSector = false;
      localStorage.setItem('existeSector', JSON.stringify(this.existeSector));
    }

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


    this.bdService.getSectores().subscribe(data => {
      const sectores = L.Proj.geoJson(data, {

        style: this.styleFeature,
        onEachFeature: ( feature, layer ) => {
          layer.bindTooltip( feature.properties.Nombre, {permanent: true, direction: 'center', className: 'etiqueta-tooltip-map2'} )
        }

      }).addTo(this.map!);

      //Crear leyenda

      this.addLegend(this.map!)


      const bounds = sectores.getBounds();

      //Agregando miniMapa


      this.bdService.getProvincias().subscribe( provincias => {

        this.addMiniMap(this.miniMap!, bounds, provincias)
      })


      // ================

      this.map?.fitBounds(bounds);

      sectores.eachLayer((layer: any) => {
        layer.on('click', (e: any) => {

          this.existeSector = true;

          localStorage.setItem('existeSector', JSON.stringify(this.existeSector));

          const sectorLayer = e.target.feature.properties.Nombre
          const sectorLayerNumber = parseInt(sectorLayer.slice(sectorLayer.length - 1, sectorLayer.length))

          this.componentsService.actualizarSectorClicado(sectorLayer.toLowerCase().replace(/ /g, ""));
          this.componentsService.getSectorClicado().subscribe(sector => {
            this.router.navigate([`talara/${sector}`])
          })

          this.componentsService.getSectorClicado().subscribe( sectorClicado => {
            const sectorClicadoNumber = parseInt(sectorClicado.slice(sectorClicado.length - 1, sectorClicado.length))

            if( sectorLayerNumber === sectorClicadoNumber ) {

              sectores.setStyle(this.styleFeature)

              layer.setStyle({
                color: 'red'
              })
            }
          })
        });
      });
    });
  };

  getColor(sector: string): string {
    switch( sector ) {
      case 'Sector 01': return 'green';
      case 'Sector 02': return 'blue';
      case 'Sector 03': return 'red';
      default : return 'gray'
    }
  }

  styleFeature = ( feature: any ) => {
    return {
      fillColor: this.getColor(feature.properties.Nombre),
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.6
    }
  }

  addLegend(map: L.Map): void {
    const legend = new L.Control({position: 'bottomleft'});

    legend.onAdd = (map: L.Map) => {
      const div = L.DomUtil.create('div', 'legend');
      const sectors = ['Sector 01', 'Sector 02', 'Sector 03'];

      div.innerHTML += '<strong>SECTORES</strong><br>';
      for (const sector of sectors) {
        div.innerHTML += `<div><i style="background:${this.getColor(sector)}"></i> ${sector}</div>`;
      }

      return div;
    };

    legend.addTo(map);
  }

  addMiniMap(map: L.Map, boundZoom: L.LatLngBounds, layer: any ): void {

    map = L.map('mini-map', {
      dragging: false,
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      scrollWheelZoom: false

    }).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    map?.fitBounds(boundZoom, {maxZoom: 8, paddingBottomRight: [130 ,-60] });

    L.geoJson(layer, {
      style: (feature) => {
        return {
          fillColor: feature?.properties.PROVINCIA === 'TALARA' ? 'red' : 'rgba(0,0,0,0)',
          fillOpacity: 0.5,
          color: feature?.properties.PROVINCIA === 'TALARA'? 'red' : 'black',
          weight: 1
        }
      },
      onEachFeature: (feature, layer) => {
        if( feature.properties && feature.properties.PROVINCIA ) {
          layer.bindTooltip(feature.properties.PROVINCIA, {permanent: true, direction: 'center', className: 'etiqueta-tooltip'})
        }
      }
    }).addTo(map)

  }

};
