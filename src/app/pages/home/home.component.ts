// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { Observable, firstValueFrom } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { signal } from'@angular/core';
// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'] // "styleUrl" yerine "styleUrls" olmalı
// })
// export class HomeComponent implements OnInit {
//   //userName: string = "";

//   constructor(private http: HttpClient) {}

//   getCurrentUser(): Observable<any> {
//     return this.http.get<any>(`${environment.apiUrl}/User`);
//   }

//   // async ngOnInit(): Promise<void> {
//   //   try {
//   //     const response = await firstValueFrom(this.getCurrentUser());
//   //     console.log("res", response);
//   //     this.userName = response.name; // "name" alanını kullanarak ayarlama yapıyoruz
//   //   } catch (error) {
//   //     console.error("Kullanıcı bilgisi alınamadı:", error);
//   //   }
//   // }


  
 



 
//   userName = signal<string>("");
  
//   ngOnInit(): void {
//     this.getCurrentUser().subscribe({
//   next: (response) =>this.userName.set(response), // response.name ile kullanıcı adını ayarlayınerror: (error) =>console.error("Kullanıcı bilgisi alınamadı:", error),
//     });
//   }

// }



import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // environment dosyasının yolunu doğru ayarlayın
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true, // Eğer standalone bileşen kullanıyorsanız
  imports: [], // standalone bileşenlerde modül içe aktarma
})
export class HomeComponent implements OnInit {
  userName = signal<string>(""); // `userName` sinyali tanımlandı
 
  constructor(private http: HttpClient) {}
 
  getCurrentUser(): Observable<any> {
    // API'den kullanıcı bilgilerini alacak HTTP GET isteği
    return this.http.get<any>(`${environment.apiUrl}/User`);
  }
 
  ngOnInit(): void {
    this.getCurrentUser().subscribe({
      next: (response) => {
        console.log("response" , response);
        this.userName.set(response.userName); // `name` alanı üzerinden kullanıcı adını ayarlama
      },
      error: (error) => {
        console.log("Kullanıcı bilgisi alınamadı:", error);
      }
    });
  }
}