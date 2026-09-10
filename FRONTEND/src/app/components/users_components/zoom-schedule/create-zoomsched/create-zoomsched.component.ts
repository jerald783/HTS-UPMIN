import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { ZoomEmailService } from '../../../../../services/notification-services/zoom-email.service';
import { AdmZoomScheduleService } from '../../../../../services/UserServices/zoom-schedule.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-create-zoomsched',
  standalone: false,
  templateUrl: './create-zoomsched.component.html',
  styleUrl: './create-zoomsched.component.scss',
})
export class CreateZoomschedComponent implements OnInit, OnChanges {
  @Output() scheduleSaved = new EventEmitter<string>();
  @Output() scheduleUpdated = new EventEmitter<void>();

  //  If this has value = EDIT MODE
  @Input() editData: any = null;
isSaving = false;
  requesterEmail: string | null = '';
  selectedFile: File | null = null;
  isSubmitted = false;
  isEditMode = false;

  formData: any = {
    id: 0,
    activityName: '',
    setupType: '',
    zoomDescription: '',
    startDate: '',
    endDate: '',
    timeStart: '',
    timeEnd: '',
    alternateHosts: '',
    requireRegistration: '',
    desiredPasscode: '',
    requesterName: '',
    requesterEmail: '',
    officeUnitProject: '',
    additionalDetails: '',
    configFile: '',
    status: 'Pending',
  };

  constructor(
    private zoomService: AdmZoomScheduleService,
    // private mailService: EmailService,
    private toastr: ToastrService,
    private zoomEmailService: ZoomEmailService,
  ) {}

  ngOnInit(): void {
    this.requesterEmail = localStorage.getItem('Email');
    if (this.requesterEmail) {
      this.formData.requesterEmail = this.requesterEmail;
    }
  }
// 1. Make sure this variable exists at the top of your class properties
isDragging = false;

// 2. Keep ONLY ONE instance of this method in your file
onFileSelected(event: any): void {
  // Check if the event is a standard input change event
  if (event.target && event.target.files && event.target.files.length > 0) {
    this.handleFileProcessing(event.target.files[0]);
  } 
  // Safety fallback check in case of custom events
  else if (event.currentTarget && event.currentTarget.files && event.currentTarget.files.length > 0) {
    this.handleFileProcessing(event.currentTarget.files[0]);
  }
}

// 3. Keep this for your drop zone
onFileDropped(event: DragEvent): void {
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const droppedFile = event.dataTransfer.files[0];
    this.handleFileProcessing(droppedFile);
  }
}

// 4. Place your actual file processing logic here
handleFileProcessing(file: File): void {
  // Your existing file saving / processing logic goes here
  console.log('File accepted:', file.name);
  
  // Example: assign to your form data object
  // this.formData.attachedFile = file;
}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData']) {
      if (this.editData) {
        this.isEditMode = true;
        this.patchForm(this.editData);
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  patchForm(data: any) {
    this.formData = {
      id: data.Id,
      activityName: data.ActivityName || '',
      setupType: data.SetupType || '',
      zoomDescription: data.ZoomDescription || '',
      startDate: data.StartDate || '',
      endDate: data.EndDate || '',
      timeStart: data.TimeStart || '',
      timeEnd: data.TimeEnd || '',
      alternateHosts: data.AlternateHosts || '',
      requireRegistration: data.RequireRegistration || '',
      desiredPasscode: data.DesiredPasscode || '',
      requesterName: data.RequesterName || '',
      requesterEmail: data.RequesterEmail || '',
      officeUnitProject: data.OfficeUnitProject || '',
      additionalDetails: data.AdditionalDetails || '',
      configFile: data.ConfigFile || '',
      status: data.Status || 'Pending',
    };

    this.selectedFile = null;
  }
saveSchedule(form: NgForm) {
  this.isSubmitted = true;

  if (form.invalid) {
    this.toastr.error('Please complete all required fields');
    return;
  }

  if (this.isSaving) return;

  this.isSaving = true;

  if (this.isEditMode) {
    this.updateSchedule();
    return;
  }

  const fd = new FormData();

  Object.keys(this.formData).forEach((key) => {
    fd.append(key, this.formData[key] ?? '');
  });

  if (this.selectedFile) {
    fd.append('file', this.selectedFile);
  }

  this.zoomService.addZoomSchedule(fd).subscribe({
    next: () => {
      this.toastr.success('Zoom Schedule Saved');

      this.zoomEmailService
        .sendZoomRequestEmail(this.formData)
        .subscribe();

      this.scheduleSaved.emit(this.formData.startDate);

      this.resetForm();
      form.resetForm(); // IMPORTANT

      this.selectedFile = null;
      this.isSubmitted = false;
      this.isSaving = false;
    },
    error: () => {
      this.toastr.error('Failed to save schedule');
      this.isSaving = false;
    },
  });
}

updateSchedule() {
  const fd = new FormData();

  Object.keys(this.formData).forEach((key) => {
    fd.append(key, this.formData[key] ?? '');
  });

  if (this.selectedFile) {
    fd.append('file', this.selectedFile);
  }

  this.zoomService
    .updateZoomSchedule(this.formData.id, fd)
    .subscribe({
      next: () => {
        this.toastr.success('Zoom Schedule Updated');

        this.scheduleUpdated.emit();
        this.selectedFile = null;
        this.isSaving = false;
      },
      error: () => {
        this.toastr.error('Update failed');
        this.isSaving = false;
      },
    });
}

  resetForm() {
    this.formData = {
      id: 0,
      activityName: '',
      setupType: '',
      zoomDescription: '',
      startDate: '',
      endDate: '',
      timeStart: '',
      timeEnd: '',
      alternateHosts: '',
      requireRegistration: '',
      desiredPasscode: '',
      requesterName: '',
      requesterEmail: this.requesterEmail || '',
      officeUnitProject: '',
      additionalDetails: '',
      configFile: '',
      status: 'Pending',
    };
  }
}
