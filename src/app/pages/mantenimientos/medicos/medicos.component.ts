import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicoTemp: Medico[] = [];
  private imgSubs!: Subscription;

  public cargando: boolean = true;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.medicos = this.medicoTemp);
    }

    this.busquedaService.buscar('medicos', termino).subscribe((resp) => {
      this.medicos = resp;
    });

    return [];
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicoTemp = medicos;
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: 'Eliminar Medico',
      text: `Esta seguro de eliminar a ${medico.nombre}`,
      icon: 'question',
      confirmButtonColor: '#3b8bf3',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedicos(medico._id!).subscribe((resp) => {
          this.cargarMedicos();
          Swal.fire(
            'Eliminado',
            `El medico: '${medico.nombre}' ha sido eliminado.`,
            'success'
          );
        });
      }
    });
  }
}
