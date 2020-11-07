import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string = 'Bearer b77fb14b2cd2436348d31873878f1f9755d7ac8ff334d660a527cd540ef4309e'
  constructor(private http: HttpClient) {
  }

  getUserDataByPage(page): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/public-api/users?page=${page}`)
      .pipe(map((res) => res));
  }

  deleteUserById(id): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}/public-api/users/${id}`, {
        headers: new HttpHeaders({
          Authorization: this.token,
        }),
      })
      .pipe(map((res) => res));
  }

  addUser(data): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/public-api/users/`, data, {
        headers: new HttpHeaders({
          Authorization: this.token,
        }),
      })
      .pipe(map((res) => res));
  }
}
