import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'cenit-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  mainSchema = {
    type: 'object',
    required: ['first_name', 'gender'],
    properties: {
      first_name: {
        title: 'First Name',
        description: 'Your first name',
        type: 'string'
      },
      last_name: {
        title: 'Last Name',
        description: 'Your last name',
        type: 'string'
      }
      // gender: {
      //   title: 'Gender',
      //   description: 'Your gender',
      //   type: 'string',
      //   enum: ['male', 'female'],
      //   enumNames: ['Male', 'Female']
      // },
      // married: {
      //   type: 'boolean',
      //   description: 'Are you married?'
      // },
      // contacts: {
      //   type: 'array',
      //   items: {
      //     type: 'object',
      //     properties: {
      //       name: {
      //         type: 'string'
      //       },
      //       phones: {
      //         type: 'array',
      //         items: {
      //           title: 'Phone',
      //           description: 'A phone number',
      //           type: 'string'
      //         }
      //       },
      //       address: {
      //         type: 'object',
      //         properties: {
      //           street: {
      //             type: 'string'
      //           },
      //           city: {
      //             type: 'string'
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      // arrarray: {
      //   type: 'array',
      //   items: {
      //     type: 'array',
      //     items: {
      //       type: 'string'
      //     }
      //   }
      // }
    }
  };

  formGroup: FormGroup;
  dataGroup: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.dataGroup = new FormGroup({});
    this.formGroup = new FormGroup({data: this.dataGroup});

    console.log('FORM INITIALIZED');
  }

  onSubmit() {
    console.log('SUBMITTING: ', JSON.stringify(this.dataGroup.value));
  }
}
