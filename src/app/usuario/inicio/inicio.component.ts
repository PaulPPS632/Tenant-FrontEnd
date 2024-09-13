import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_solidgauge from 'highcharts/modules/solid-gauge';
import { CookieService } from 'ngx-cookie-service';
import { ReportesService } from 'src/app/services/reportes.service';
import { UserInfo } from 'src/app/models/UserInfo';
import { VentaReporteDto } from 'src/app/models/VentaReporteDto';
interface GroupedData {
  [usuario_id: string]: {
    name: string;
    data: {
      [date: string]: number;
    };
  };
}
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: any;// required
  //chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  user: UserInfo = {
    id: '',
    sub: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
    email: '',
    email_verified: false,
    locale: '',
    password:'',
    tenantId : '',
    tenantName:'',
    regist: false,
    tiponegocio: '',
    rol: null,
  };
  privilegios: string[] =[];
  constructor(private reporteService: ReportesService, private cookieService: CookieService){}
  ventas: VentaReporteDto []=[];

  ngOnInit(): void {
    const userString = this.cookieService.get('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }
      this.reporteService.getVentasReporte().subscribe(
        (data: VentaReporteDto[]) => {
          this.ventas = data;
          const groupedData = this.groupDataByUserAndDate(this.ventas);
          if(this.buscaprivilegio('usuarios')){
            this.chartOptions = this.getChartOptions(groupedData);
          }else{
            this.chartOptions = this.getChartOptionsUser(groupedData, this.user.name);
          }
          
        }
      );
    
  }
  buscaprivilegio(privilegeName: string): boolean {
    return this.user.rol?.privilegios?.some(privilegio => privilegio.nombre === privilegeName) ?? false;
  }
  private groupDataByUserAndDate(data: VentaReporteDto[]): GroupedData {
    const grouped: GroupedData = data.reduce((acc: GroupedData, venta: VentaReporteDto) => {
      const dateArray = venta.fecha;
      const date = `${dateArray[0]}-${dateArray[1].toString().padStart(2, '0')}-${dateArray[2].toString().padStart(2, '0')}`;
      // Assuming fecha is an ISO string
      if (!acc[venta.usuario_id]) {
        acc[venta.usuario_id] = {
          name: venta.usuario_name,
          data: {}
        };
      }
      if (!acc[venta.usuario_id].data[date]) {
        acc[venta.usuario_id].data[date] = 0;
      }
      acc[venta.usuario_id].data[date] += venta.monto;
      return acc;
    }, {});

    return grouped;
  }

  private getChartOptions(groupedData: GroupedData): any {
    const series = Object.keys(groupedData).map(usuario_id => {
      const usuarioData = groupedData[usuario_id];
      const data = Object.entries(usuarioData.data).map(([date, monto]) => ({
        x: new Date(date).getTime(),
        y: monto
      }));

      return {
        name: usuarioData.name,
        data: data.sort((a, b) => a.x - b.x), // Ensure data is sorted by date
        type: 'line'
      };
    });

    return {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Reporte Ventas Empleados'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Monto'
        }
      },
      series: series
    };
  }
  private getChartOptionsUser(groupedData: GroupedData, usuario: string): any {
    const series = Object.keys(groupedData).map(usuario_id => {
      const usuarioData = groupedData[usuario_id];
      const data = Object.entries(usuarioData.data).map(([date, monto]) => ({
        x: new Date(date).getTime(),
        y: monto
      }));

      return {
        name: usuarioData.name,
        data: data.sort((a, b) => a.x - b.x), // Ensure data is sorted by date
        type: 'line'
      };
    });

    return {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Reporte Ventas Empleados'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Monto'
        }
      },
      series: series.filter(serie => serie.name == usuario)
    };
  }
}
