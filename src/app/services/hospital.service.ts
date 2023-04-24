import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  cargarHospitales() {
    const url = `${baseUrl}/hospitales`;
    return this.http
      .get<{ ok: boolean; hospitales: Hospital[] }>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
      );
  }

  crearHospitales(nombre: string) {
    const url = `${baseUrl}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospitales(_id: string, nombre: string) {
    const url = `${baseUrl}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  eliminarHospitales(_id: string) {
    const url = `${baseUrl}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
