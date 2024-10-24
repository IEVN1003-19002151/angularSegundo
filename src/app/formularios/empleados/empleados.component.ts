import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Empleado {
  matricula: number;
  nombre: string;
  email: string;
  edad: number;
  horasT: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export default class EmpleadosComponent implements OnInit {
  formEmpleado!: FormGroup;
  empleados: Empleado[] = [];
  totalGeneral: number = 0;
  empleadoSelec: Empleado | null = null;
  modoEdicion: boolean = false;
  actualizarTabla: boolean = false;
  mostrarTabla: boolean = false;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.formEmpleado = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      horasT: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.formEmpleado.valid) {
      const empleado = this.formEmpleado.value;
      this.modoEdicion ? this.actualizarEmpleado(empleado) : this.guardarEmpleado(empleado);
      this.formEmpleado.reset();
      this.modoEdicion = false;
      this.empleadoSelec = null;
      this.actualizarTabla = true;
    }
  }

  guardarEmpleado(empleado: Empleado): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    const empleadosArray: Empleado[] = empleadosGuardados ? JSON.parse(empleadosGuardados) : [];
    empleadosArray.push(empleado);
    localStorage.setItem('empleados', JSON.stringify(empleadosArray));
    alert('Empleado guardado con éxito');
  }

  actualizarEmpleado(empleado: Empleado): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    let empleadosArray: Empleado[] = empleadosGuardados ? JSON.parse(empleadosGuardados) : [];
    const dato = empleadosArray.findIndex(emp => emp.matricula === empleado.matricula);
    if (dato !== -1) {
      empleadosArray[dato] = empleado;
      localStorage.setItem('empleados', JSON.stringify(empleadosArray));
      alert('Empleado actualizado con éxito');
    }
  }

  cargarEmpleados(): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    this.empleados = empleadosGuardados ? JSON.parse(empleadosGuardados) : [];
  }

  seleccionarEmpleado(empleado: Empleado): void {
    this.empleadoSelec = empleado;
  }

  modificarEmpleado(): void {
    if (this.empleadoSelec) {
      this.formEmpleado.patchValue(this.empleadoSelec);
      this.modoEdicion = true;
    }
  }

  eliminarEmpleado(): void {
    if (this.empleadoSelec) {
      const empleadosGuardados = localStorage.getItem('empleados');
      let empleadosArray: Empleado[] = empleadosGuardados ? JSON.parse(empleadosGuardados) : [];
      
      empleadosArray = empleadosArray.filter(emp => emp.matricula !== this.empleadoSelec!.matricula);
      localStorage.setItem('empleados', JSON.stringify(empleadosArray));
      this.empleadoSelec = null;
      this.actualizarTabla = true;
      alert('Empleado eliminado con éxito');
    }
  }

  imprimirTabla(): void {
    this.cargarEmpleados();
    this.calcularTotalGeneral();
    this.actualizarTabla = false;
    this.mostrarTabla = true;
  }

  calcularPagoNormal(horas: number): number {
    return Math.min(horas, 40) * 70;
  }

  calcularHorasExtras(horas: number): number {
    return Math.max(horas - 40, 0);
  }

  calcularPagoHorasExtras(horas: number): number {
    return this.calcularHorasExtras(horas) * 140;
  }

  calcularTotalPago(horas: number): number {
    const pagoNormal = this.calcularPagoNormal(horas);
    const pagoExtras = this.calcularPagoHorasExtras(horas);
    return pagoNormal + pagoExtras;
  }

  calcularTotalGeneral(): void {
    this.totalGeneral = this.empleados.reduce((total, empleado) => {
      return total + this.calcularTotalPago(empleado.horasT);
    }, 0);
  }

  cancelarEdicion(): void {
    this.formEmpleado.reset();
    this.modoEdicion = false;
    this.empleadoSelec = null;
  }
}
