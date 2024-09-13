import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DetalleCompraRequest, RegistrarCompraRequest } from 'src/app/models/Compra-request';
import { Entidad } from 'src/app/models/entidad-response';
import { ProductoResponse } from 'src/app/models/producto-response';
import { ProductoSerieRequest } from 'src/app/models/producto-serie-request';
import { ProductoSerieResponse } from 'src/app/models/producto-serie-response';
import { TipadoDocumentos, TipoComprobante, TipoCondicion, TipoMoneda, TipoPago } from 'src/app/models/tipado-documentos';
import { EntidadService } from 'src/app/services/entidad';
import { ProductoService } from 'src/app/services/producto';
import { RegistroCompraService } from 'src/app/services/registro-compra.service';
import { TipadoService } from 'src/app/services/tipado';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ingreso-compra',
  templateUrl: './ingreso-compra.component.html',
  styleUrls: ['./ingreso-compra.component.scss']
})
export class IngresoCompraComponent implements OnInit {
  fechaEmision?: NgbDateStruct;
  fechaVencimiento?: NgbDateStruct;
  fechaPago?: NgbDateStruct;

  producto: ProductoSerieResponse[] = [];
  //nuevos datos PAUL
  filtrolistaProductos: ProductoResponse[] =[];
  listaProductos: ProductoResponse[] =[];
  SeriesProducto: string[] = [];
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

  

  nota: string = '';
  tipoCambio: number = 3;
  formaPago: string = '1';
  RegistroVentaService: any;

  documento: string ='F001-0000';
  tpSeleccionado: string = '' ;
  nSeleccionado: number = 1;

  serie: string = '';
  entidad: string = '';
  productoselect: ProductoResponse | null = null;
  selectedProducto: string = '';
  selectedEntidad: string = '';

  tipoCondSelec: number = 0;
  tipoPagoSelec: number = 0;

  productoSerie: ProductoResponse [] = [];

  constructor(
    private productoService: ProductoService, 
    private tipadoService: TipadoService,
    private entidadService: EntidadService,
    private registroCompraService: RegistroCompraService,
    private modalService: NgbModal) { }

  detalleCompra: DetalleCompraRequest[] = [];
  ventaData : RegistrarCompraRequest = {
      documento: this.documento,
      documento_cliente: this.entidad,
      usuario_id: '',
      id_tipocondicion: this.tipoCondSelec,
      id_tipopago: this.tipoPagoSelec,
      id_tipomoneda: this.tipoMonedaSelec,
      tipo_cambio: this.tipoCambio,
      fecha_emision: '2024-06-01T15:30:00.000',
      fecha_vencimiento: '2024-06-01T15:30:00.000',
      nota: this.nota,
      gravada: this.totalGravada,
      impuesto: this.igv,
      total: this.totalPagar,

      fechapago: '2024-06-01T15:30:00.000',
      formapago: this.formaPago,

      detalles: this.detalleCompra
  };


  guardarDatos(){
    this.ventaData.documento = this.documento;
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

    this.ventaData.detalles = this.detalleCompra;
    this.ventaData.fecha_emision = this.fechaEmision?.year +'-'+ this.fechaEmision?.month.toString().padStart(2, '0')+'-'+this.fechaEmision?.day.toString().padStart(2, '0') + 'T00:00:00.00';
    this.ventaData.fecha_vencimiento= this.fechaVencimiento?.year +'-'+ this.fechaVencimiento?.month.toString().padStart(2, '0')+'-'+this.fechaVencimiento?.day.toString().padStart(2, '0')+ 'T00:00:00.00';
    this.ventaData.fechapago= this.fechaPago?.year +'-'+ this.fechaPago?.month.toString().padStart(2, '0')+'-'+this.fechaPago?.day.toString().padStart(2, '0') + 'T00:00:00.00';
  }

  guardarProductos() {
    
    this.guardarDatos();
    console.log(this.ventaData);
    this.registroCompraService.registrar(this.ventaData).subscribe({
      next: () => {
        //actualizar productos
        
        Swal.fire({
          icon: 'success',
          title: 'Resultado',
          text: 'Registro de la Compra realizada correctamente.',
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
          text: 'Error al realizar el registro.',
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
      this.detalleCompra = this.detalleCompra.filter(detalle => detalle.id_producto !== producto.id);
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

  agregarProductoDetalle(): void {

    const index = this.ventaData.detalles.findIndex(p => p.id_producto == this.idproductoSeleccionado);

    console.log('Index:', index);

    if (index !== -1) {
      this.ventaData.detalles[index].series.push(this.serie);
      const cant = this.ventaData.detalles[index].cantidad + 1;
      this.ventaData.detalles[index].cantidad = cant;
      this.ventaData.detalles[index].precio_total = this.ventaData.detalles[index].precio_unitario * cant;
      this.SeriesProducto = this.ventaData.detalles[index].series;
    } else {

      const producto = {
        id_producto: this.selectedProducto,
        nombre: this.nombreproductoSeleccionado,
        cantidad: 1, //1 porque asi empieza
        series: [this.serie],
        precio_unitario: this.preciounitproductoSeleccionado,
        precio_total: this.preciounitproductoSeleccionado * 1
      };
      this.ventaData.detalles.push(producto);
      this.SeriesProducto = [this.serie];
    }
  
    console.log('Detalle de venta:', this.ventaData.detalles);
  }

  //buscar producto: serie pertenece
  buscarProducto(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.toLowerCase();
    this.filtrolistaProductos = this.listaProductos;
    if (searchText) {
      this.listaProductos = this.listaProductos.filter(pro =>
        //cambiar busqueda (id/nombre/marca) para buscar
        pro.nombre.toLowerCase().includes(searchText)|| pro.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.listaProductos = this.filtrolistaProductos;
    }
  }
  
  entidades: Entidad [] = [];
  filtroEntidad: Entidad[] = [];
  
  ngOnInit(): void {
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
      this.idproductoSeleccionado = idProducto;
      let detalle = this.ventaData.detalles.find(detalle => {detalle.id_producto ==idProducto});
      if(detalle){
        this.SeriesProducto = detalle?.series;
      }else{
        this.SeriesProducto =[];
      }
      let producto = this.listaProductos.find(product => product.id == idProducto);
      if(producto){
        this.nombreproductoSeleccionado = producto.nombre;
        this.preciounitproductoSeleccionado = producto.precio;
        this.abrirModal(content);
      }
    }
  }
  SeleccionarSeriesProducto(sn: string){
    let detalleProducto = this.ventaData.detalles.find(detalle => detalle.id_producto == this.idproductoSeleccionado);

    if (detalleProducto) {
      if(detalleProducto.cantidad == 1){
        this.ventaData.detalles = this.ventaData.detalles.filter(detalle=>detalle!=detalleProducto);
        this.SeriesProducto = [];
      }else{
        detalleProducto.series = detalleProducto.series.filter(serie => serie!=sn);
        const cant = detalleProducto.cantidad-1;
        detalleProducto.cantidad = cant;
        detalleProducto.precio_total = detalleProducto.precio_unitario * cant;
        this.SeriesProducto = detalleProducto.series;
      }
    }
  }
  //clientes
  ElegirEntidad(){
    this.entidad = this.selectedEntidad;
    this.filtroEntidad = this.entidades;
  }
  ElegirProducto(){
    this.entidad = this.selectedEntidad;

  }

  //total dinero
  get totalGravada(): number {
    return this.totalPagar / 1.18;
  }

  get igv(): number {
    return this.totalGravada * 0.18;
  }

  get totalPagar(): number {
    return this.detalleCompra.reduce((total, producto) => total + (producto.precio_total), 0);
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
