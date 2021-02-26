import {Component, OnInit} from '@angular/core';
import {UploadServiceService} from "../services/upload-service.service";
import {HttpResponse} from "@angular/common/http";
import {EmployeeService} from "../services/employee.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Router} from "@angular/router";
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  active_employe: any;
  userData: any = {};
  constructor(private uploadService: UploadServiceService,
              private employeeService: EmployeeService,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    let userString = localStorage.getItem('session');
    if(userString) {
      this.userData = JSON.parse(userString);
      if (this.userData.type !== 1) {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate([''])
    }
    this.active_employe = JSON.parse(localStorage.getItem("session"));
  }

  fileList = FileList;
  newPwd: any = '';
  oldPwd: string = '';

  save_profile() {
      if (this.active_employe.name === '' ||
          this.active_employe.surname === '' ||
          this.active_employe.employee_data.address === '' ||
          this.active_employe.employee_data.office === '' ) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Obavezna polja su polja za ime, prezime, adresu, kontakt i kancelariju/kabinet!',
        });
        return;
      }

      if(this.newPwd !== '' && this.oldPwd !== '') {
        if (this.oldPwd !== this.active_employe.password) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Stare sifre se ne poklapaju!',
          });
        } else {
          if (this.newPwd === '') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Nova sifra ne moze da bude prazna!',
            });
          } else {
            this.active_employe.password = this.newPwd;
          }
        }
      } else {

      }

      this.employeeService.updateEmployeeData(this.active_employe).subscribe( (response:any) => {
          if (response.message === 'ok') {
            Swal.fire({
              icon: 'success',
              title: 'Super!',
              text: 'Uspesno azuriran profil!',
            });
            localStorage.setItem('session', JSON.stringify(this.active_employe));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Doslo je do greske, profil nije azuriran!',
            });
          }
      });

  }

  upload_image($event) {
    var _URL = window.URL || window.webkitURL;
    this.fileList = $event.target.files;
    var file, img;
    let skip = false;
    if ((file = this.fileList[0])) {
      img = new Image();
      var objectUrl = _URL.createObjectURL(file);
      img.onload = function () {
        if (this.width > 300 || this.height > 300) {
          skip = true;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Slika prevazilazi velicinu od 300x300!',
          });
        }
        _URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
    if ( skip === false && this.fileList[0] != undefined) {
      this.uploadService.upload(this.fileList[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore
          let file_data = res.body.file_data;
          let download_link = file_data.filename;
          this.active_employe.employee_data.profilePicture = download_link;
          this.employeeService.updateEmployeePicture(this.active_employe.id, download_link).subscribe((doc: any) => {

          });
          localStorage.setItem('session', JSON.stringify(this.active_employe));
        }
      });

    }
  }
}
