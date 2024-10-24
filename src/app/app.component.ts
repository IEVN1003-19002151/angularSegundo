import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
/* import { Ejemplo1Component } from "./formularios/ejemplo1/ejemplo1.component";
import { ZodiacoComponent } from "./formularios/zodiaco/zodiaco.component"; */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule /* Ejemplo1Component, ZodiacoComponent */
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularSegundo';
}
