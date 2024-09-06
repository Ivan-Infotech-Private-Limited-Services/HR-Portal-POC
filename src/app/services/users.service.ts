import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpService: HttpsService) {}

  async search(query:any){
    try {
      return await this.httpService.get('users', query)
    } catch (e) {
      throw e
    }
  }
  async create(query:any){
    try {
      return await this.httpService.post('users/create', query)
    } catch (e) {
      throw e
    }
  }
  async getById(userId:any){
    try {
      return await this.httpService.get(`users/${userId}`,{})
    } catch (e) {
      throw e
    }
  }
  async update(userId:string, body:any){
    try {
      return await this.httpService.post(`users/update/${userId}`, body)
    } catch (e) {
      throw e
    }
  }
}
