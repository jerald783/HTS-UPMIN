

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MaintenanceItem, Signatures, ItoPmsLogService, PmLogPayload } from '../../../../services/UserServices/ito-pms-log.service';
export interface SessionDetails {
  department: string;
  buildingRoom: string;
  custodian: string;
  servicingDate: string;
  maintenanceClass: string;
}
@Component({
  selector: 'app-ito-pms-log',
  standalone: false,
  templateUrl: './ito-pms-log.component.html',
  styleUrls: ['./ito-pms-log.component.scss']
})
export class ItoPmsLogComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() recordId: number = 0;
  @Output() backToList = new EventEmitter<void>();

  logId: number = 0;
  documentCode: string = 'UPMin-ITO-PMS-2026-V1-FM02';

  session: SessionDetails = {
    department: 'College of Science and Mathematics - CS Lab',
    buildingRoom: 'CS Building / Room 102',
    custodian: 'Prof. Juan Dela Cruz',
    servicingDate: '2026-11-05',
    maintenanceClass: 'Academic / Lab Tech (Bi-Annual)'
  };

  maintenanceClasses: string[] = [
    'Academic / Lab Tech (Bi-Annual)',
    'End-User (Annual)',
    'IT Patrol (Monthly)'
  ];

  items: MaintenanceItem[] = [];

  signatures: Signatures = {
    techName: 'Engr. Alex Reyes',
    techDate: '2026-11-05',
    custodianName: 'Prof. Juan Dela Cruz',
    custodianDate: '2026-11-05'
  };

  @ViewChild('techCanvas') techCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('custodianCanvas') custodianCanvasRef!: ElementRef<HTMLCanvasElement>;

  private isDrawingTech = false;
  private isDrawingCustodian = false;

  constructor(private pmsLogService: ItoPmsLogService) {}

  ngOnInit(): void {
    if (this.recordId === 0) {
      this.seedInitialData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordId'] && changes['recordId'].currentValue > 0) {
      this.loadLog(changes['recordId'].currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.initCanvas(this.techCanvasRef.nativeElement);
    this.initCanvas(this.custodianCanvasRef.nativeElement);
  }

  // seedInitialData(): void {
  //   this.logId = 0;
  //   const initial: MaintenanceItem[] = [
  //     { propertyTag: 'UPMin-2024-PC-001', serialNumber: 'ABC123XYZ01', deviceModel: 'Dell OptiPlex 3080', hw: true, os: true, sec: true, status: 'P', remarks: 'All checks passed.' },
  //     { propertyTag: 'UPMin-2024-PC-002', serialNumber: 'ABC123XYZ02', deviceModel: 'Dell OptiPlex 3080', hw: true, os: true, sec: true, status: 'P', remarks: 'Replaced noisy fan.' },
  //     { propertyTag: 'UPMin-2024-PC-003', serialNumber: 'ABC123XYZ03', deviceModel: 'Dell OptiPlex 3080', hw: false, os: true, sec: true, status: 'J', remarks: 'Dead PSU - Issued Job Order' }
  //   ];

  //   for (let i = 4; i <= 10; i++) {
  //     initial.push({
  //       propertyTag: '',
  //       serialNumber: '',
  //       deviceModel: '',
  //       hw: false,
  //       os: false,
  //       sec: false,
  //       status: '',
  //       remarks: ''
  //     });
  //   }
  //   this.items = initial;
  // }

  get totalInspected(): number {
    return this.items.filter(i => i.propertyTag.trim() !== '' || i.serialNumber.trim() !== '' || i.deviceModel.trim() !== '').length;
  }

  get totalPassed(): number {
    return this.items.filter(i => i.status === 'P').length;
  }

  get totalWarranty(): number {
    return this.items.filter(i => i.status === 'W').length;
  }

  get totalJobOrder(): number {
    return this.items.filter(i => i.status === 'J').length;
  }

  get totalUnserviceable(): number {
    return this.items.filter(i => i.status === 'U').length;
  }

  addRow(): void {
    this.items.push({
      propertyTag: '',
      serialNumber: '',
      deviceModel: '',
      hw: false,
      os: false,
      sec: false,
      status: '',
      remarks: ''
    });
  }

  removeRow(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  autoPassAll(): void {
    this.items.forEach(item => {
      if (item.propertyTag.trim() !== '' || item.deviceModel.trim() !== '') {
        item.hw = true;
        item.os = true;
        item.sec = true;
        item.status = 'P';
        if (!item.remarks) {
          item.remarks = 'All checks passed.';
        }
      }
    });
  }

  saveLog(): void {
    const techCanvas = this.techCanvasRef.nativeElement;
    const custodianCanvas = this.custodianCanvasRef.nativeElement;

    const payload: PmLogPayload = {
      id: this.logId,
      documentCode: this.documentCode,
      department: this.session.department,
      buildingRoom: this.session.buildingRoom,
      custodian: this.session.custodian,
      servicingDate: this.session.servicingDate,
      maintenanceClass: this.session.maintenanceClass,
      signatures: {
        techName: this.signatures.techName,
        techDate: this.signatures.techDate,
        techSignatureBase64: techCanvas ? techCanvas.toDataURL() : '',
        custodianName: this.signatures.custodianName,
        custodianDate: this.signatures.custodianDate,
        custodianSignatureBase64: custodianCanvas ? custodianCanvas.toDataURL() : ''
      },
      items: this.items
    };

    if (this.logId === 0) {
      this.pmsLogService.postLog(payload).subscribe({
        next: (res) => {
          this.logId = res.id;
          alert(`Batch PM Log saved successfully! (Record ID: ${res.id})`);
        },
        error: (err) => {
          console.error('Error saving log:', err);
          alert(`Failed to save PM Log: ${err.error || err.message}`);
        }
      });
    } else {
      this.pmsLogService.putLog(payload).subscribe({
        next: (res) => {
          alert('Batch PM Log updated successfully!');
        },
        error: (err) => {
          console.error('Error updating log:', err);
          alert(`Failed to update PM Log: ${err.error || err.message}`);
        }
      });
    }
  }

loadLog(id: number): void {
  this.pmsLogService.getLogById(id).subscribe({
    next: (data: any) => {
      if (!data) return;

      this.logId = data.id || data.Id || id;
      this.documentCode = data.documentCode || data.DocumentCode || 'UPMin-ITO-PMS-2026-V1-FM02';

      // 1. Safe Session Mapping (Handles flat API structure or nested object)
      this.session = {
        department: data.department || data.Department || '',
        buildingRoom: data.buildingRoom || data.BuildingRoom || '',
        custodian: data.custodian || data.Custodian || '',
        servicingDate: (data.servicingDate || data.ServicingDate || '').substring(0, 10),
        maintenanceClass: data.maintenanceClass || data.MaintenanceClass || 'Academic / Lab Tech (Bi-Annual)'
      };

      // 2. Safe Signatures Mapping (Handles nested signatures or flat response)
      const sig = data.signatures || data.Signatures || data;
      this.signatures = {
        techName: sig.techName || sig.TechName || '',
        techDate: (sig.techDate || sig.TechDate || '').substring(0, 10),
        custodianName: sig.custodianName || sig.CustodianName || '',
        custodianDate: (sig.custodianDate || sig.CustodianDate || '').substring(0, 10)
      };

      // 3. Normalize Items Array Property Names
      const rawItems = data.items || data.Items || [];
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        this.items = rawItems.map((item: any) => ({
          propertyTag: item.propertyTag || item.PropertyTag || '',
          serialNumber: item.serialNumber || item.SerialNumber || '',
          deviceModel: item.deviceModel || item.DeviceModel || '',
          hw: Boolean(item.hw ?? item.Hw),
          os: Boolean(item.os ?? item.Os),
          sec: Boolean(item.sec ?? item.Sec),
          status: item.status || item.Status || '',
          remarks: item.remarks || item.Remarks || ''
        }));
      }

      // 4. Deferred Canvas Signature Rendering (Ensures ViewChild DOM is ready)
      const techSig = sig.techSignatureBase64 || sig.TechSignatureBase64;
      const custodianSig = sig.custodianSignatureBase64 || sig.CustodianSignatureBase64;

      setTimeout(() => {
        if (techSig && this.techCanvasRef?.nativeElement) {
          this.renderCanvasBase64(techSig, this.techCanvasRef.nativeElement);
        }
        if (custodianSig && this.custodianCanvasRef?.nativeElement) {
          this.renderCanvasBase64(custodianSig, this.custodianCanvasRef.nativeElement);
        }
      }, 50);
    },
    error: (err) => {
      console.error('Error loading log:', err);
      alert('Could not fetch specified PM Log details.');
    }
  });
}

  goBack(): void {
    this.backToList.emit();
  }

  private initCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
    }
  }

  private renderCanvasBase64(base64: string, canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = base64;
  }

  startDrawing(event: MouseEvent | TouchEvent, type: 'tech' | 'custodian'): void {
    const isTech = type === 'tech';
    if (isTech) this.isDrawingTech = true;
    else this.isDrawingCustodian = true;

    const canvas = isTech ? this.techCanvasRef.nativeElement : this.custodianCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const pos = this.getEventPos(event, rect);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  draw(event: MouseEvent | TouchEvent, type: 'tech' | 'custodian'): void {
    const isTech = type === 'tech';
    if ((isTech && !this.isDrawingTech) || (!isTech && !this.isDrawingCustodian)) return;

    const canvas = isTech ? this.techCanvasRef.nativeElement : this.custodianCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const pos = this.getEventPos(event, rect);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  stopDrawing(type: 'tech' | 'custodian'): void {
    if (type === 'tech') this.isDrawingTech = false;
    else this.isDrawingCustodian = false;
  }

  clearCanvas(type: 'tech' | 'custodian'): void {
    const canvas = type === 'tech' ? this.techCanvasRef.nativeElement : this.custodianCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private getEventPos(event: MouseEvent | TouchEvent, rect: DOMRect) {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  exportCSV(): void {
    let csv = 'ID,Property Tag,Serial Number,Device Model,HW,OS,SEC,Status,Remarks\n';
    this.items.forEach((item, index) => {
      csv += `"${index + 1}","${item.propertyTag}","${item.serialNumber}","${item.deviceModel}","${item.hw ? 'PASS' : 'FAIL'}","${item.os ? 'PASS' : 'FAIL'}","${item.sec ? 'PASS' : 'FAIL'}","${item.status}","${item.remarks.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${this.documentCode}_Log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printForm(): void {
    window.print();
  }
  // --- 1. Unique Document Code Generator ---
generateDocumentCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`; // e.g., 20261105
  const random4Digits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number (1000-9999)

  return `UPMin-ITO-PMS-${dateStr}-${random4Digits}`;
}

generateUniqueDocCode(): void {
  const candidateCode = this.generateDocumentCode();

  // If your service has a check endpoint (e.g., checkDocCodeExists)
  if (typeof (this.pmsLogService as any).checkDocCodeExists === 'function') {
    (this.pmsLogService as any).checkDocCodeExists(candidateCode).subscribe({
      next: (exists: boolean) => {
        if (exists) {
          // If code exists, regenerate recursively until a unique one is found
          this.generateUniqueDocCode();
        } else {
          this.documentCode = candidateCode;
        }
      },
      error: () => {
        this.documentCode = candidateCode;
      }
    });
  } else {
    // Direct assignment fallback
    this.documentCode = candidateCode;
  }
}

// --- 2. Update seedInitialData for New Forms ---
seedInitialData(): void {
  this.logId = 0;
  this.generateUniqueDocCode(); // <-- Automatically generates candidate code for new records

  const initial: MaintenanceItem[] = [
    { propertyTag: '', serialNumber: '', deviceModel: '', hw: false, os: false, sec: false, status: '', remarks: '' }
  ];

  for (let i = 2; i <= 10; i++) {
    initial.push({
      propertyTag: '',
      serialNumber: '',
      deviceModel: '',
      hw: false,
      os: false,
      sec: false,
      status: '',
      remarks: ''
    });
  }
  this.items = initial;
}
}