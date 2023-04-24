import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  cargarMedicos() {
    const url = `${baseUrl}/medicos`;
    return this.http
      .get<{ ok: boolean; medicos: Medico[] }>(url, this.headers)
      .pipe(map((resp: { ok: boolean; medicos: Medico[] }) => resp.medicos));
  }

  obtenerMedicoById( id: string ){
    const url = `${baseUrl}/medicos/${ id }`;
    return this.http
      .get<{ ok: boolean; medico: Medico }>(url, this.headers)
      .pipe(map((resp: { ok: boolean; medico: Medico }) => resp.medico));
  }

  crearMedicos(medico: { nombre: string, hospital: string }) {
    const url = `${baseUrl}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedicos(medico: Medico) {
    const url = `${baseUrl}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  eliminarMedicos(_id: string) {
    const url = `${baseUrl}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
