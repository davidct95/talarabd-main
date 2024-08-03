import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  private archivoSubidoSubject = new Subject<void>();
  private paqueteId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private debouncer: Subject<string> = new Subject<string>();

  $sectorClicado: BehaviorSubject<string> = new BehaviorSubject<string>('');

  archivoSubido$ = this.archivoSubidoSubject.asObservable();

  constructor() { }

  notificarArchivoSubido() {
    this.archivoSubidoSubject.next();
  }

  actualizarPaqueteId( paqueteId: number ) {
    this.paqueteId.next(paqueteId);
  }

  actualizarDebouncer( termino:string ) {
    this.debouncer.next( termino );
  }

  actualizarSectorClicado( sector: string ) {
    this.$sectorClicado.next( sector )
  }

  getValueDebouncer(): Observable<string> {
    return this.debouncer.asObservable();
  }

  getSectorClicado(): Observable<string> {
    return this.$sectorClicado.asObservable();
  }

  getPaqueteId(): Observable<number> {
    return this.paqueteId.asObservable();
  }
}
