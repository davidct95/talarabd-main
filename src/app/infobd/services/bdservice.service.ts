import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BdserviceService {

  //https://katydid-fond-fish.ngrok-free.app/talara/home
  //https://romantic-wise-dingo.ngrok-free.app/talara/home

  private apiUrl: string = 'http://localhost:8080/home'

  constructor( private http: HttpClient){ }

  getComponente(){
    const url = `${this.apiUrl}/componentesbd`;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get<any>(url, { headers: headers });
  }

  getPropiedades(id: string){
    const url = `${this.apiUrl}/p/${id}`
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get<any>(url, { headers: headers });
  }

  getPoligonos(){
    const url = `${this.apiUrl}/allJson`
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get<any>(url, { headers: headers });
  }

  delete(id: string){
    const url = `${this.apiUrl}/delete/${id}`
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.delete<any>(url, { headers: headers });
  }

  actualizarDatos(id: string, updatedData: any) {
    const url = `${this.apiUrl}/actualizar/${id}`;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.put(url, updatedData, { headers: headers });
  }

  upload(file: any){

    const formData = new FormData();
    formData.append('file', file.files[0]);

    const url = `${this.apiUrl}/subir`;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
    });

    headers.append('Content-Type', 'multipart/form-data')

    return this.http.post(url, formData, {headers: headers, responseType: 'text'})
  }

  getSectores(): Observable<any> {
    return this.http.get<any>('assets/geojson/sectores.geojson')
  }
}
