import { Component, OnInit } from '@angular/core';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null ;

  constructor( public modalImagenService: ModalImagenService, public fileUploadService :FileuploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal( ) {
    this.imgTemp = null; 
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen( file: File ) {
    this.imagenSubir = file;

    if( !file ){ 
      return this.imgTemp; 
    }

    const reader = new FileReader();  
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo , id )
      .then( img => { 
        Swal.fire('Guardado', 'Imagen de usuario actualizada','success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })

 }

}
