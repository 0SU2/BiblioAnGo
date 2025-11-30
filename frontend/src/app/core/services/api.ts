import { Injectable } from '@angular/core';
import axios, { Axios, AxiosInstance, AxiosStatic } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class Api {
  api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080/api"
    });
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(err)
      }
    )
  }

}
