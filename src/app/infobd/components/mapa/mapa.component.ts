import { Component, OnInit, AfterViewInit } from '@angular/core';

import 'proj4leaflet';
import * as Proj from 'proj4leaflet';
import * as L from 'leaflet';
import proj4 from 'proj4';
import { BdserviceService } from '../../services/bdservice.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styles: [
  ]
})
export class MapaComponent implements OnInit {

  map: any;
  poligonos: any;
  id!: string;

  constructor(private route: ActivatedRoute, private bdService: BdserviceService, private componentsService: ComponentsService) { }

  ngOnInit(): void {

    this.initMap();

    this.loadPoligonos();

    this.componentsService.archivoSubido$.subscribe(() => {
      this.loadPoligonos();
    })
  }

  initMap(): void {
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer(
      'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      {
        maxZoom: 19,
        attribution: 'Data by <a href="https://openstreetmap.org">OpenStreetMap contributors</a>'
      }
    )
      .addTo(this.map);
  }

  loadPoligonos(): void {
    proj4.defs('EPSG:32717', '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs');

    this.bdService.getPoligonos().subscribe((resp) => {
      this.poligonos = resp;
      const geoJsonLayer = L.Proj.geoJson(this.poligonos, {
        style: function (feature) {
          return {
            fillColor: 'yellow', // Color de relleno
            weight: 2,          // Grosor del borde
            opacity: 1,         // Opacidad del borde
            color: 'white',     // Color del borde
            fillOpacity: 0.5    // Opacidad del relleno
          };
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.NOMBRE);
        }
      }).addTo(this.map);

      const bounds = geoJsonLayer.getBounds();
      this.map.fitBounds(bounds);

      this.route.queryParams.subscribe(params => {
        this.id = params['id'];
        this.getPolygonId(this.id, this.poligonos, this.map);
      });
    });
  }

  getPolygonId(id: string, poligonos: any, map: any): void {
    for (let i = 0; i < poligonos.length; i++) {
      if (id == poligonos[i].features[0].properties.gid) {
        const poligonoSeleccionado = poligonos[i];
        const layer = L.Proj.geoJson(poligonoSeleccionado, {
          style: function (feature) {
            return {
              fillColor: 'blue', // Color de relleno
              weight: 2,          // Grosor del borde
              opacity: 1,         // Opacidad del borde
              color: 'white',     // Color del borde
              fillOpacity: 0.5    // Opacidad del relleno
            };
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.NOMBRE);
          }
        });

        const bounds = layer.getBounds();
        map.fitBounds(bounds);
      }
    }
  }

  actualizarMapa(): void {
    if (this.map) {
      this.map.remove(); // Eliminar el mapa de Leaflet y todos sus elementos
      this.initMap(); // Volver a crear el mapa
      this.loadPoligonos(); // Volver a cargar los polígonos
    }
  }
}