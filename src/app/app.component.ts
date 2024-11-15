import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet ,RouterModule} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'auth-client';
  text : string = "Giriş yap home sayfasını görmek için";
}
