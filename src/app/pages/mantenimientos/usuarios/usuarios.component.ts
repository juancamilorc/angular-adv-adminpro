import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  // public mailUser: string = this.usuarioService.usuario.email;

  constructor( private usuarioService: UsuarioService, private busquedasService: BusquedasService, private modalImagenService: ModalImagenService ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
      .subscribe( ( { total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;

      });
  }

  cambiarPagina ( valor: number ) {
    this.desde += valor;

    if( this.desde < 0 ){
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar ( termino: string ) {

    if( termino.length === 0 ){
      return this.usuarios = this.usuariosTemp;
    }

     this.busquedasService.buscar( 'usuarios', termino )
      .subscribe( resp => {
        this.usuarios = resp;
      });

      return [];
  }

  eliminarUsuario( usuario:Usuario ) {

    if( usuario.uid === this.usuarioService.usuario.uid ){
      return Swal.fire('Error','No puede eliminarse a si mismo', 'error');
    }

    Swal.fire({
      title: 'Eliminar Usuario',
      text: `Esta seguro de eliminar a ${ usuario.nombre }`,
      icon: 'question',
      confirmButtonColor: '#3b8bf3',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
            .subscribe( resp => {

              this.cargarUsuarios();
              Swal.fire(
              'Eliminado',
              `El usuario '${ usuario.nombre }' ha sido eliminado.`,
              'success'
            );
          });
      }
    })
    return true;
  }

  cambiarRole( usuario: Usuario) {
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        
      })
  }

  abrirModal( usuario: Usuario) {
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid!, usuario.img );
  }

}
