import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user-model';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  loading: boolean
  collection = [];
  userData: User[];
  pagination: any;
  submitted: Boolean = false;
  userRegistrationForm: FormGroup;
  gender = ['Male', 'Female'];
  errorMsg: any;

  constructor(private userSvc: UserService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toast: ToastrService) { }

  ngOnInit() {
    this.userRegistrationForm = this.formBuilder.group({
      name: ["", Validators.required],
      gender: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(/.+\@.+\..+/)]]
    });
    let pageNumber = 1;
    this.getUserData(pageNumber)
  }

  //Get user data by page number
  getUserData(pageNumber: Number) {
    this.userSvc.getUserDataByPage(pageNumber)
      .subscribe(res => {
        this.userData = []
        this.pagination = res.meta.pagination
        res.data.map(data => {
          let temp = {
            id: data.id,
            name: data.name,
            email: data.email,
            gender: data.gender
          }
          this.userData.push(temp);
        })
      })
  }
  //Delete user by Id
  deleteUserById(id) {
    this.loading = true;
    this.userSvc.deleteUserById(id)
      .subscribe(data => {
        this.loading = false;
        this.toast.clear()
        this.toast.success("User deleted successfully")
        let pageNumber = 1;
        this.getUserData(pageNumber)
      })
  }

  //Submit user details
  submitUserDetails() {
    this.submitted = true;
    if (this.userRegistrationForm.invalid) {
      this.toast.clear()
      this.toast.error("Invalid form")
    } else {
      this.loading = true;
      let user = {
        name: this.userRegistrationForm.get('name').value,
        gender: this.gender,
        email: this.userRegistrationForm.get('email').value,
        status: 'Active'
      }
      this.userSvc.addUser(user)
        .subscribe(data => {
          if (data.code == 422) {
            this.loading = false;
            this.errorMsg = 'Email has already been taken'
          } else {
            this.loading = false;
            this.errorMsg = '';
            let pageNumber = 1;
            this.getUserData(pageNumber)
            this.toast.clear()
            this.toast.success("Successfully added user")
            this.userRegistrationForm.reset()
            this.submitted = false;
            this.closeModal()
          }
        })

    }
  }

  // Method to change gender on selection
  changeGender(e) {
    this.getGender.setValue(e.target.value, {
      onlySelf: true
    })
    this.gender = this.userRegistrationForm.get('gender').value
  }

  // Getter method to access formcontrols
  get getGender() {
    return this.userRegistrationForm.get('gender');
  }

  //Open modal
  openModal(content) {
    this.modalService.open(content);
  }

  //Close modal
  closeModal() {
    this.modalService.dismissAll();
  }

}
