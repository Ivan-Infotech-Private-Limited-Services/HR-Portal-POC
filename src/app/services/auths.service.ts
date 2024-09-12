import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class AuthsService {
  constructor(private httpService:HttpsService) {}

  async login(body:any){
    try {
      let response = await this.httpService.post("auths/login", body);
      localStorage.setItem("x-access-token", response.body["x-access-token"]);
      // if(body.haveToRemember){
      // }else{
      //   sessionStorage.setItem("x-access-token", response.body["x-access-token"])
      // }
      delete response.body["x-access-token"];
      localStorage.setItem("user-data", JSON.stringify(response.body));
      return response;
    } catch (e) {
      throw e
    }
  }
}
