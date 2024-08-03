import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Router } from '@angular/router';
import { BdserviceService } from '../../services/bdservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';
import { ComponentsService } from '../../services/components.service';


@Component({
  selector: 'app-tabla-componentes',
  templateUrl: './tabla-componentes.component.html'
})
export class TablaComponentesComponent implements OnInit {

  @Output() datoEmitido = new EventEmitter<string>();
  @Output() registroEliminado = new EventEmitter<void>();

  componentes!: any[];
  filteredComponentes!: any[];

  seccion: any = {
    dai_01: { rangoIndices: [14, 15, 16, 17, 18, 19, 20, 21, 22] }
  }

  maxPagination: number = 10;
  mostrarModal: boolean = false;

  selectedComponentId: string | null = null;

  paqueteId: number = 0;

  constructor(private bdservices: BdserviceService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private componetsService: ComponentsService,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {


    this.componetsService.getValueDebouncer().subscribe( value => {
      this.filteredComponentes = this.componentes.filter(componente =>
        componente.componente.toLowerCase().includes(value.toLowerCase()) ||
        componente.nombre.toLowerCase().includes(value.toLowerCase())
      )
    })

    this.activatedRoute.paramMap.subscribe(params => {
        this.paqueteId =  parseInt(params.get('paqueteId')!);
        this.componetsService.actualizarPaqueteId(parseInt(params.get('paqueteId')!));
        console.log(params)
    })

    this.componetsService.archivoSubido$.subscribe(() => {
      this.getListComponents();
    })


    this.getListComponents();


    this.route.params.subscribe((params: Params) => {
      this.activarTablaPropiedades();
    })

  }

  getListComponents(){
    this.bdservices.getComponente()
      .subscribe((resp) => {
        this.componentes = resp;
        this.filteredComponentes = [...this.componentes];

        const jsonOrdenado = this.filteredComponentes.sort(function (a, b) {
          const componenteA = a.componente.toLowerCase();
          const componenteB = b.componente.toLowerCase();

          if (componenteA < componenteB) { return -1; }
          if (componenteA > componenteB) { return 1; }
          return 0;
        });
        console.log(this.componentes)
      });
  }

  activarTablaPropiedades() {
    //Emito el valor para que se active los valores de la tabla de propiedades
    this.datoEmitido.emit(this.seccion['dai_01']);
  }

  actualizarURL(nuevoValor: string) {
    // Obtiene la URL actual y agrega el parámetro 'id' con el nuevo valor
    const url = this.router.url.split('?')[0]; // Obtiene la URL sin los parámetros actuales
    console.log(url);
    this.router.navigate([url], { queryParams: { id: nuevoValor }, queryParamsHandling: 'merge' });
  }

  openModal(componente: any): void {
    const dialogRef = this.dialog.open(ModalEditComponent, {
      width: '550px',
      height: '400px',
      data: { componente: componente }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  selectComponent(componentId: string) {
    this.selectedComponentId = componentId;
  }

  eliminarRegistro(id: string) {
    this.bdservices.delete(id)
      .subscribe(() => {
        console.log('El registro se eliminó correctamente');
        // Eliminar el componente de la lista después de la eliminación
        this.componentes = this.componentes.filter(componente => componente.id !== id);
        this.filteredComponentes = [...this.componentes];
        this.registroEliminado.emit(); // Emitir evento de registro eliminado
      },
      error => {
        console.log('Error al eliminar el registro', error);
      })
  }
}
