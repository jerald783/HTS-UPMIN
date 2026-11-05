/* =========================
   IMPORTS
========================= */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExtraFieldService } from '../../../../../services/UserServices/extra-field.service';

/* =========================
   COMPONENT
========================= */
@Component({
  selector: 'app-ito-admin-extra-fields',
  standalone: false,
  templateUrl: './ito-admin-extra-fields.component.html',
  styleUrl: './ito-admin-extra-fields.component.scss',
})
export class ItoAdminExtraFieldsComponent implements OnInit {
  /* =========================
     FORM
  ========================= */
  fieldForm!: FormGroup;

  /* =========================
     DATA
  ========================= */
  fields: any[] = [];

  /* =========================
     CONSTRUCTOR
  ========================= */
  constructor(
    private fb: FormBuilder,
    private extraFieldService: ExtraFieldService,
  ) {}

  /* =========================
     LIFECYCLE
  ========================= */
  ngOnInit() {
    this.fieldForm = this.fb.group({
      FieldName: [''],
      FieldLabel: [''],
      FieldType: ['text'],
      Options: [''],
    });

    this.loadFields();
  }

  /* =========================
     LOAD DATA
  ========================= */
  loadFields() {
    this.extraFieldService.getFields().subscribe((res: any) => {
      this.fields = res;
    });
  }

  /* =========================
     ACTIONS
  ========================= */
  addField() {
    let data = this.fieldForm.value;

    if (data.FieldType === 'select') {
      data.Options = JSON.stringify(data.Options.split(','));
    }

    this.extraFieldService.addField(data).subscribe(() => {
      this.loadFields();
      this.fieldForm.reset();
    });
  }

  deleteField(id: number) {
    this.extraFieldService.deleteField(id).subscribe(() => {
      this.loadFields();
    });
  }
}