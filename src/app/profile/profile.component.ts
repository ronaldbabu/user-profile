import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonService } from '../common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options, ChangeContext } from 'ng5-slider';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('myInput', { static: false })
  myInputVariable: ElementRef;
  submitted = false;
  interests: any = [];
  registerForm: FormGroup;
  userData: any;
  userAge: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  userState: string;
  userInterests: any = [];
  editInterests: any = [];
  newsLetter: boolean;
  userPhone: number;
  profileEditMode: boolean = false;
  imageEditMode: boolean = false;
  value: number = 1;
  imageSrc: string;
  ageChanged: boolean = false;
  changedAgeVal: number;
  imageSource: string;
  saved: boolean = false;
  updatedInterests: any = [];

  options: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: '13-19' },
      { value: 2, legend: '20-29' },
      { value: 3, legend: '30-45' },
      { value: 4, legend: '45 & Above' }
    ]
  };

  stateList = [
    { name: 'Alabama', value: 1 },
    { name: 'Alaska', value: 2 },
    { name: 'Hawaii', value: 3 },
    { name: 'California', value: 4 },
    { name: 'Florida', value: 5 }
  ];


  constructor(private commonservice: CommonService, private formBuilder: FormBuilder) {
    this.commonservice.userVal.subscribe(val => this.userData = val);
  }

  ngOnInit(): void {
    this.firstName = this.userData.firstName;
    this.lastName = this.userData.lastName;
    this.userEmail = this.userData.email;
    this.userState = this.userData.state;

    this.newsLetter = this.userData.newsLetter;
    this.userPhone = this.userData.phone;
    this.imageSource = this.userData.fileSource;
    this.userInterests = this.userData.interests;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.userData.interests.length; i++) {
      this.editInterests.push({ display: this.userData.interests[i], value: this.userData.interests[i] });
    }

    const ageRange: number = this.userData.age;

    switch (ageRange) {
      case 1:
        this.userAge = 'above 13 years';
        break;
      case 2:
        this.userAge = 'above 20 years';
        break;
      case 3:
        this.userAge = 'above 30 years';
        break;
      case 4:
        this.userAge = 'above 45 years';
        break;
      default:
        console.log('Age not added');
        break;
    }

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]*$/)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      newsLetter: [false, '']
    });
  }

  get f() { return this.registerForm.controls; }


  onUserChange(changeContext: ChangeContext): void {
    this.ageChanged = true;
    this.changedAgeVal = changeContext.value;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }


  clearImage() {
    this.imageSrc = null;
    this.myInputVariable.nativeElement.value = '';
  }


  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    } else {
      const temp = [];
      this.editInterests = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.interests.length; i++) {
        temp.push(this.interests[i].value);
        this.updatedInterests = temp;

        this.editInterests.push(
          { display: this.interests[i].display, value: this.interests[i].value }
        );
      }

      if (this.ageChanged === true) {
        this.changedAgeVal = this.changedAgeVal;
      } else {
        this.changedAgeVal = 1;
      }

      this.firstName = this.f.firstName.value;
      this.lastName = this.f.lastName.value;
      this.userEmail = this.f.email.value;
      this.userState = this.f.state.value;
      this.userInterests = this.updatedInterests;
      this.newsLetter = this.f.newsLetter.value;
      this.userPhone = this.f.phone.value;

      const ageRange: number = this.changedAgeVal;

      switch (ageRange) {
        case 1:
          this.userAge = 'above 13 years';
          break;
        case 2:
          this.userAge = 'above 20 years';
          break;
        case 3:
          this.userAge = 'above 30 years';
          break;
        case 4:
          this.userAge = 'above 45 years';
          break;
        default:
          console.log('Age not added');
          break;
      }

      this.saved = true;
      this.profileEditMode = false;
    }
  }


  editProfile() {

    if (this.saved !== true) {
      this.registerForm = this.formBuilder.group({
        firstName: [this.userData.firstName, [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]*$/)]],
        lastName: [this.userData.lastName, Validators.required],
        email: [this.userData.email, [Validators.required, Validators.email]],
        phone: [this.userData.phone, Validators.required],
        state: [this.userData.state, Validators.required],
        newsLetter: [this.userData.newsLetter, '']
      });

      this.interests = this.editInterests;
      this.value = this.userData.age;
    } else {
      this.registerForm = this.formBuilder.group({
        firstName: [this.firstName, [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]*$/)]],
        lastName: [this.lastName, Validators.required],
        email: [this.userEmail, [Validators.required, Validators.email]],
        phone: [this.userPhone, Validators.required],
        state: [this.userState, Validators.required],
        newsLetter: [this.newsLetter, '']
      });

      this.interests = this.editInterests;
      this.value = this.changedAgeVal;
    }

    this.profileEditMode = true;
    this.imageEditMode = false;
  }

  editPhoto() {
    this.imageEditMode = true;
    this.profileEditMode = false;
  }


  saveImage() {
    this.imageSource = this.imageSrc;
    this.imageEditMode = false;
  }

  cancelImage() {
    this.clearImage();
    this.imageEditMode = false;
  }

  cancelProfileEdit() {
    this.profileEditMode = false;
  }
}
