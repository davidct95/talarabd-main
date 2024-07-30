import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit{

  constructor(private componentsService: ComponentsService) {}

  ngOnInit(): void {
  }

  onKeyPress( termino: string ) {
    this.componentsService.actualizarDebouncer(termino);
  }

}
