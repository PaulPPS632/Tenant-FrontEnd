import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Entidad } from 'src/app/models/entidad-response';
import { ProductoResponse } from 'src/app/models/producto-response';
import { ProductoSerieRequest } from 'src/app/models/producto-serie-request';
import { ProductoSerieResponse } from 'src/app/models/producto-serie-response';
import { TipadoDocumentos, TipoComprobante, TipoCondicion, TipoMoneda, TipoPago } from 'src/app/models/tipado-documentos';
import { DetalleVentaRequest, RegistrarVentaRequest } from 'src/app/models/venta-request';
import { CorrelativoService } from 'src/app/services/correlativo';
import { EntidadService } from 'src/app/services/entidad';
import { ProductoService } from 'src/app/services/producto';
import { ProductoSerieService } from 'src/app/services/producto-serie';
import { RegistroVentaService } from 'src/app/services/registro-venta';
import { TipadoService } from 'src/app/services/tipado';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario-venta',
  templateUrl: './usuario-venta.component.html',
  styleUrls: ['./usuario-venta.component.scss'],
})

export class UsuarioVentaComponent implements OnInit {

  fechaEmision?: NgbDateStruct;
  fechaVencimiento?: NgbDateStruct;
  fechaPago?: NgbDateStruct;

  producto: ProductoSerieResponse[] = [];
  //nuevos datos PAUL
  listaProductos: ProductoResponse[] =[];
  SeriesProducto: ProductoSerieResponse[] = [];
  idproductoSeleccionado: string = '';
  nombreproductoSeleccionado: string ='';
  preciounitproductoSeleccionado: number = 0;
  modalRef: NgbModalRef | null = null;
  //fin nuevos paul
  tipadoDocumentos: TipadoDocumentos | undefined;
  tipoComprobante: TipoComprobante[] = [];
  tipoCondicion: TipoCondicion[] = [];
  tipoPago: TipoPago[] = [];
  tipoMoneda: TipoMoneda[] = [];

  tipoMonedaSelec:number = 0;

  productosSeleccionados: ProductoSerieRequest[] = [];

  detalleVenta: DetalleVentaRequest[] = [];

  nota: string = '';
  tipoCambio: number = 3;
  formaPago: string = '1';
  RegistroVentaService: any;

  prefijo:  string = '';
  numeracion: number = 0;
  correlativo: number = 0;

  tpSeleccionado: string = '' ;
  nSeleccionado: number = 1;

  serie: string = '';
  entidad: string = '';
  selectedProducto: string = '';
  selectedEntidad: string = '';

  tipoCondSelec: number = 0;
  tipoPagoSelec: number = 0;

  productoSerie: ProductoResponse [] = [];

  constructor(
    private productoService: ProductoService, 
    private productoSerieService: ProductoSerieService,
    private tipadoService: TipadoService,
    private entidadService: EntidadService,
    private correlativoService: CorrelativoService,
    private registroVentaService: RegistroVentaService,
    private modalService: NgbModal) { }


  ventaData : RegistrarVentaRequest = {
      prefijo: this.tpSeleccionado,
      numeracion: this.nSeleccionado,
      documento_cliente: this.entidad,
      usuario_id: '',
      id_tipocondicion: this.tipoCondSelec,
      id_tipopago: this.tipoPagoSelec,
      id_tipomoneda: this.tipoMonedaSelec,
      tipo_cambio: this.tipoCambio,
      fecha_emision: new Date().toISOString(),
      fecha_vencimiento: new Date().toISOString(),
      nota: this.nota,
      gravada: this.totalGravada,
      impuesto: this.igv,
      total: this.totalPagar,
      fechapago: new Date().toISOString(),
      formapago: this.formaPago,
      detalles: this.detalleVenta
  };


  guardarDatos(){
    this.ventaData.prefijo = this.tpSeleccionado;
    this.ventaData.numeracion = this.nSeleccionado;
    this.ventaData.documento_cliente = this.entidad;
    this.ventaData.id_tipocondicion = this.tipoCondSelec;
    this.ventaData.id_tipopago = this.tipoPagoSelec;
    this.ventaData.id_tipomoneda= this.tipoMonedaSelec;
    this.ventaData.tipo_cambio = this.tipoCambio;
    this.ventaData.nota = this.nota;
    this.ventaData.gravada = this.totalGravada;
    this.ventaData.impuesto=  this.igv;
    this.ventaData.total= this.totalPagar;
    this.ventaData.formapago = this.formaPago;
    this.ventaData.detalles = this.detalleVenta;
    this.ventaData.fecha_emision = this.fechaEmision?.year +'-'+ this.fechaEmision?.month.toString().padStart(2, '0')+'-'+this.fechaEmision?.day.toString().padStart(2, '0') + 'T00:00:00.00';
    this.ventaData.fecha_vencimiento= this.fechaVencimiento?.year +'-'+ this.fechaVencimiento?.month.toString().padStart(2, '0')+'-'+this.fechaVencimiento?.day.toString().padStart(2, '0')+ 'T00:00:00.00';
    this.ventaData.fechapago= this.fechaPago?.year +'-'+ this.fechaPago?.month.toString().padStart(2, '0')+'-'+this.fechaPago?.day.toString().padStart(2, '0') + 'T00:00:00.00';
  }

  guardarProductos() {
    
    this.guardarDatos();
    this.registroVentaService.registrar(this.ventaData).subscribe({
      next: () => {
        //actualizar productos
        
        Swal.fire({
          icon: 'success',
          title: 'Resultado',
          text: 'Venta realizada correctamente.',
          confirmButtonText:"OK"
        }).then((result) => {
          if (result.isConfirmed) {
            this.ventaData.detalles = []
          }
        });
        
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Resultado',
          text: 'Error al vender realizar la venta.',
        });
        console.error('Error al realizar la venta:', error);
      }
    });
    
  }

  //arreglar
  removerProducto(producto: ProductoResponse): void {
    const index = this.productoSerie.findIndex(p => p.id === producto.id);
    
    if (index !== -1) {
      if (this.productoSerie[index].cantidad > 1) {
        this.productoSerie[index].cantidad--;
      } else {
        this.productoSerie.splice(index, 1);
      }
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado de la lista.',
      });
  
      // Eliminar la entrada correspondiente en detalleVenta
      this.detalleVenta = this.detalleVenta.filter(detalle => detalle.id_producto !== producto.id);
    }
  }
  

  cargarProductos() {
    this.productoService.getListaProductos().subscribe((response: ProductoResponse[] )=> {
      this.listaProductos = response;
    }, error => {
      console.error('Error al obtener los productos:', error);
    });
  }

  cargarTipado(){
    this.tipadoService.getTipadoDocumentos().subscribe(
      data => {
        this.tipadoDocumentos = data;
        this.tipoComprobante = data.tipocomprobantes;
        this.tipoCondicion = data.tipocondiciones;
        this.tipoPago = data.tipopagos;
        this.tipoMoneda = data.tipomonedas;

        if (this.tipoComprobante.length > 0) {
          this.tpSeleccionado = this.tipoComprobante[0].prefijo;
        }
        if (this.tipoCondicion.length > 0) {
          this.tipoCondSelec = this.tipoCondicion[0].id;
        }
        if (this.tipoPago.length > 0) {
          this.tipoPagoSelec = this.tipoPago[0].id;
        }
        if (this.tipoMoneda.length > 0) {
          this.tipoMonedaSelec = this.tipoMoneda[0].id;
        }

      },
      error => {
        console.error('Error al obtener los tipos de documentos:', error);
      }
    );
  }

  cargarClientes(){
    this.entidadService.getEntidades().subscribe(data => {
      this.entidades = data;
      this.filtroEntidad = data;
    });
  }

  agregarProductoDetalle(productoId: string, precioId: number): void {

    const index = this.detalleVenta.findIndex(p => p.id_producto === productoId);

    console.log('Index:', index);

    if (index !== -1) {
      this.detalleVenta[index].series.push(this.serie);
      this.detalleVenta[index].cantidad++;

    } else {

      const producto = {
        id_producto: productoId,
        nombre: this.nombreproductoSeleccionado,
        cantidad: 1, //1 porque asi empieza
        series: [this.serie],
        precio_unitario: precioId
      };

      //this.detalleVenta.push(producto);
    }
  
    console.log('Detalle de venta:', this.detalleVenta);
  }

  //buscar producto: serie pertenece
  buscarProducto(): void {
    this.productoSerieService.getProductoSerie(this.serie).subscribe(
      data => {
        if(data == null) return;
        this.idproductoSeleccionado = data.id;
        const productoSeleccionado = this.listaProductos.find(item => item.id === data.id);
            if (productoSeleccionado) {
              this.nombreproductoSeleccionado = productoSeleccionado.nombre;
              this.preciounitproductoSeleccionado = productoSeleccionado.precio;
            }

            let detalleProducto = this.ventaData.detalles.find(detalle => detalle.id_producto == this.idproductoSeleccionado);

            if (!detalleProducto) {
              detalleProducto = {
                id_producto: this.idproductoSeleccionado,
                nombre: this.nombreproductoSeleccionado,
                cantidad: 0, // Puedes ajustar según tus necesidades
                series: [],
                precio_unitario: this.preciounitproductoSeleccionado, // Puedes ajustar según tus necesidades
                precio_total: 0
              };
              this.ventaData.detalles.push(detalleProducto);
            }
        
            const serieIndex = detalleProducto.series.indexOf(this.serie);
              
            if (serieIndex < 0)  {
              // Si la serie no está en el array, agrégala
              detalleProducto.series.push(this.serie);
              detalleProducto.cantidad += 1;
              detalleProducto.precio_total = detalleProducto.cantidad * detalleProducto.precio_unitario;
            }
            this.ventaData.total = this.totalPagar;
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Producto no encontrado',
          text: 'No se encontró el producto con la serie ingresada.',
        });
        console.log('No encontrado', error);
      }
    );
  }
  
  entidades: Entidad [] = [];
  filtroEntidad: Entidad[] = [];
  
  ngOnInit(): void {
    console.log(new Date().toISOString());
    this.setFechaEmision();
    this.cargarProductos();
    this.cargarTipado();
    this.cargarClientes();
  }

  buscarCliente(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();

    if (searchText) {
      this.filtroEntidad = this.filtroEntidad.filter(pro =>
        //cambiar busqueda (id/nombre/marca) para buscar
        pro.documento.toLowerCase().includes(searchText)|| pro.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filtroEntidad = this.entidades;
    }
  }

  setFechaEmision(): void {
    const now = new Date();
    this.fechaEmision = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() }
    // Inicializa las fechas de vencimiento y pago con la fecha actual
    this.fechaVencimiento = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
    this.fechaPago = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear()};
  }
  ElegirSeries(idProducto: string | null, content: any){
    if(idProducto){
      this.productoSerieService.getSeriesByProductoId(idProducto).subscribe(
        (res: ProductoSerieResponse[]) =>{
          this.SeriesProducto = res;
          this.idproductoSeleccionado = idProducto;
          const productoSeleccionado = this.listaProductos.find(item => item.id === idProducto);
            if (productoSeleccionado) {
              this.nombreproductoSeleccionado = productoSeleccionado.nombre;
              this.preciounitproductoSeleccionado = productoSeleccionado.precio;
            }
          this.abrirModal(content);
        },
        (error) => {
          console.error('Error al obtener las series del producto:', error);
          // Manejo de errores según sea necesario
        }
      )
    }
  }
  SeleccionarSeriesProducto(sn: string){
    let detalleProducto = this.ventaData.detalles.find(detalle => detalle.id_producto == this.idproductoSeleccionado);

    if (!detalleProducto) {
      detalleProducto = {
        id_producto: this.idproductoSeleccionado,
        nombre: this.nombreproductoSeleccionado,
        cantidad: 0, // Puedes ajustar según tus necesidades
        series: [],
        precio_unitario: this.preciounitproductoSeleccionado, // Puedes ajustar según tus necesidades
        precio_total: 0
      };
      this.ventaData.detalles.push(detalleProducto);
    }

    const serieIndex = detalleProducto.series.indexOf(sn);
      
    if (serieIndex > -1) {
      // Si la serie ya está en el array, elimínala
      detalleProducto.series.splice(serieIndex, 1);
      detalleProducto.cantidad -= 1;
      detalleProducto.precio_total = detalleProducto.cantidad * detalleProducto.precio_unitario;
      if (detalleProducto.cantidad === 0) {
        this.ventaData.detalles = this.ventaData.detalles.filter(detalle => detalle !== detalleProducto);
      }
      
    } else {
      // Si la serie no está en el array, agrégala
      detalleProducto.series.push(sn);
      detalleProducto.cantidad += 1;
      detalleProducto.precio_total = detalleProducto.cantidad * detalleProducto.precio_unitario;
    }
    this.ventaData.total = this.totalPagar;
    this.detalleVenta = this.ventaData.detalles;
  }
  isSerieSeleccionada(sn: string): boolean {
    const detalleProducto = this.ventaData.detalles.find(detalle => detalle.id_producto == this.idproductoSeleccionado);
    return detalleProducto ? detalleProducto.series.includes(sn) : false;
  }
  //clientes
  ElegirEntidad(){
    this.entidad = this.selectedEntidad;
  }
  ElegirProducto(){
    this.entidad = this.selectedEntidad;

  }
  obtenerCorrelativo(): void {

    if(this.tpSeleccionado !== null && this.nSeleccionado !== null){

      this.prefijo = this.tpSeleccionado;
      this.numeracion = this.nSeleccionado;

      this.correlativoService.getCorrelativoSiguiente(this.prefijo, this.numeracion).subscribe(data => {
        this.correlativo = data;
      }, error => {
        console.error('Error al obtener el correlativo:', error);  // Agrega este log para depuración
      });
    }
  }

  //total dinero
  get totalGravada(): number {
    return this.totalPagar / 1.18;
  }

  get igv(): number {
    return this.totalGravada * 0.18;
  }

  get totalPagar(): number {
    return this.detalleVenta.reduce((total, producto) => total + (producto.precio_total), 0);
  }


  //pop up
  closeResult='';

  abrirModal(content: any) {
    /*this.modalService.open(content, { ariaLabelledBy: 'modal-header modal-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    */
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-header modal-title' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalRef = null;  // Reset the modalRef when the modal is closed
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalRef = null;  // Reset the modalRef when the modal is dismissed
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
