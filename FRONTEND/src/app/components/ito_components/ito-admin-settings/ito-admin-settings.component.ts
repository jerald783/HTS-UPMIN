/* =========================
   IMPORTS
========================= */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService } from '../../../../services/UserServices/settings.service';
import { ExtraFieldService } from '../../../../services/UserServices/extra-field.service';

/* =========================
   COMPONENT
========================= */
@Component({
  selector: 'app-ito-admin-settings',
  standalone: false,
  templateUrl: './ito-admin-settings.component.html',
  styleUrl: './ito-admin-settings.component.scss',
})
export class ItoAdminSettingsComponent implements OnInit {
  /* =========================
     FORMS
  ========================= */
  smtpForm!: FormGroup;
  googleForm!: FormGroup;
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
    private settingsService: SettingsService,
    private extraFieldService: ExtraFieldService,
  ) {}

  /* =========================
     LIFECYCLE
  ========================= */
  ngOnInit(): void {
    /* ---------- FIELD FORM ---------- */
    this.fieldForm = this.fb.group({
      FieldName: [''],
      FieldLabel: [''],
      FieldType: ['text'],
      Options: [''],
    });

    /* ---------- SMTP FORM ---------- */
    this.smtpForm = this.fb.group({
      server: [''],
      port: [''],
      senderName: [''],
      senderEmail: [''],
      username: [''],
      password: [''],
      enableSsl: [''],
    });

    /* ---------- GOOGLE FORM ---------- */
    this.googleForm = this.fb.group({
      clientId: [''],
    });

    /* ---------- LOAD DATA ---------- */
    this.loadSmtpSettings();
    this.loadGoogleSettings();
    this.loadFields();
  }

  /* =========================
     EXTRA FIELDS
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

  loadFields() {
    this.extraFieldService.getFields().subscribe((res: any) => {
      this.fields = res;
    });
  }

  /* =========================
     LOAD SETTINGS
  ========================= */
  loadSmtpSettings() {
    this.settingsService.getSmtpSettings().subscribe((res) => {
      console.log('SMTP API Response:', res);

      this.smtpForm.patchValue({
        server: res.server,
        port: res.port,
        senderName: res.senderName,
        senderEmail: res.senderEmail,
        username: res.username,
        password: res.password,
        enableSsl: res.enableSsl,
      });
    });
  }

  loadGoogleSettings() {
    this.settingsService.getGoogleClientId().subscribe((res) => {
      console.log('Google API Response:', res);

      this.googleForm.patchValue({
        clientId: res.clientId,
      });
    });
  }

  /* =========================
     UPDATE SETTINGS
  ========================= */
  updateSmtp() {
    const data = this.smtpForm.value;

    this.settingsService.updateSmtp(data).subscribe((res) => {
      alert('SMTP settings updated successfully');
    });
  }

  updateGoogle() {
    const data = this.googleForm.value;

    this.settingsService.updateGoogle(data).subscribe((res) => {
      alert('Google settings updated successfully');
    });
  }
}