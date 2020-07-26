import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options, ChangeContext } from 'ng5-slider';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  @ViewChild('myInput', { static: false })
  myInputVariable: ElementRef;

  registerForm: FormGroup;
  submitted = false;
  interests: any = [];
  value: number = 1;
  imageSrc: string;
  showCompanyAddress: boolean = false;
  showHomeAddress: boolean = false;
  ageChanged: boolean = false;
  changedAgeVal: number;

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

  countrylist = [
    { name: 'USA', value: 1 },
    { name: 'India', value: 2 },
    { name: 'Germany', value: 3 },
    { name: 'Poland', value: 4 },
    { name: 'China', value: 5 }
  ];

  addresslist = [
    { name: 'Home', value: 1 },
    { name: 'Company', value: 2 }
  ];

  constructor(private formBuilder: FormBuilder, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]*$/)]],
      lastName: ['', Validators.required],
      age: ['', ''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      homeAddress1:  ['', ''],
      homeAddress2: ['', ''],
      companyAddress1:  ['', ''],
      companyAddress2: ['', ''],
      interests: ['', ''],
      newsLetter: [false, ''],
      file: ['', Validators.required],
      fileSource: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      const temp = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.interests.length; i++) {
        temp.push(this.interests[i].value);
        this.registerForm.patchValue({
          interests: temp
        });
      }

      if (this.ageChanged === true) {
        this.registerForm.patchValue({
          age: this.changedAgeVal
        });
      } else {
        this.registerForm.patchValue({
          age: 1
        });
      }

      this.commonservice.getUserData(this.registerForm.value);

      this.router.navigate(['/profile']);
    }
  }

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
        this.registerForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }


  clearImage() {
    this.imageSrc = null;
    this.myInputVariable.nativeElement.value = '';
  }

  addressChange(event: any) {
    const selectedAddress = event.target.value;
    if (selectedAddress === '1') {
      this.showHomeAddress = true;
      this.showCompanyAddress = false;
    } else {
      this.showCompanyAddress = true;
      this.showHomeAddress = false;
    }
  }
}
