import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdmAssetsService } from '../../../../../services/adminServices/adm-assets.service';
import { ToastrService } from 'ngx-toastr';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-spmo-show-assets',
  standalone: false,
  templateUrl: './spmo-show-assets.component.html',
  styleUrl: './spmo-show-assets.component.scss',
})
export class SpmoShowAssetsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'PPE',
    'Fund_Cluster',
    'CollCode',
    'Name',
    'Desc1',
    'SerialNumber',
    'AnDate',
    'MrNum',
    'PropNo',
    'Qty',
    'UM',
    'UCost',
    'TCost',
    'Location',
    'UserName',
    'EqStatus',
    'Options',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ModalTitle: string | undefined;
  ActivateAddEditAssetsComp: boolean = false;
  events: any;
  selection = new SelectionModel<any>(true, []);
  constructor(
    private service: AdmAssetsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.refreshAssetsList();
  }

  ngAfterViewInit(): void {
    // Apply paginator and sort to dataSource once the view is initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addClick(): void {
    this.events = {
      Id: 0,
      PPE: '',
      Fund_Cluster: '',
      CollCode: '',
      Name: '',
      Desc1: '',
      SerialNumber: '',
      AnDate: '',
      MrNum: '',
      PropNo: '',
      Qty: '',
      UM: '',
      UCost: '',
      TCost: '',
      Locatio: '',
      EqStatus: '',
    };
    this.ModalTitle = 'Add Assets';
    this.ActivateAddEditAssetsComp = true;
  }

  editClick(item: any): void {
    console.log(item);
    this.events = item;
    this.ModalTitle = 'Edit Assets';
    this.ActivateAddEditAssetsComp = true;
    console.log(item);
  }

  deleteSelected(): void {
    if (this.selection.selected.length === 0) {
      this.toastr.warning('No tickets selected for deletion.');
      return;
    }

    if (
      confirm(
        `Delete ${this.selection.selected.length} tickets (and their messages)?`,
      )
    ) {
      const idsToDelete = this.selection.selected.map((item) => item.Id);

      idsToDelete.forEach((Id) => {
        this.service.deleteAssets(Id).subscribe({});
      });

      // Refresh after all deletions
      setTimeout(() => {
        this.refreshAssetsList();
        this.selection.clear();
      }, 500);
    }
  }
  closeClick(): void {
    this.ActivateAddEditAssetsComp = false;
    this.refreshAssetsList();
  }

  refreshAssetsList(): void {
    this.service.getAssets().subscribe((data) => {
      this.dataSource.data = data.sort((a, b) => b.Id - a.Id); // Sort descending by ID
      // Ensure paginator and sort are updated after data is assigned to dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  filterUserName: string = '';

  applyFilter() {
    const search = this.filterUserName.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return (
        data.UserName?.toLowerCase().includes(filter) ||
        data.Fund_Cluster?.toLowerCase().includes(filter)
      );
    };
    this.dataSource.filter = search;
  }

  getFilteredData(): any[] {
    const search = this.filterUserName.trim().toLowerCase();
    if (!search) return this.dataSource.data;

    return this.dataSource.data.filter(
      (item) =>
        item.UserName?.toLowerCase().includes(search) ||
        item.Fund_Cluster?.toLowerCase().includes(search),
    );
  }
  exportType: 'pdf' | 'excel' | '' = '';
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assets');
    // Title rows
    worksheet.mergeCells('A1:N1');
    worksheet.getCell('A1').value = 'Assets List Report - 2025';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.mergeCells('A2:N2');
    worksheet.getCell('A2').value = 'Inventory Ticketing System';
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = { size: 14, italic: true };
    worksheet.addRow([]); // spacer

    const filteredData = this.dataSource.data.filter((item) => {
      if (!this.filterUserName) return true;

      const search = this.filterUserName.toLowerCase();
      return (
        item.UserName?.toLowerCase().includes(search) ||
        item.Fund_Cluster?.toLowerCase().includes(search)
      );
    });

    if (filteredData.length === 0) {
      this.toastr.warning('No assets found for that filter.', 'Filter Result');
      return;
    }

    const filterText = this.filterUserName || 'ALL';
    const fundClusterText = this.filterUserName
      ? filteredData[0]?.Fund_Cluster || 'N/A'
      : 'ALL';

    worksheet.addRow([`FILTER: ${filterText}`]);
    worksheet.addRow([`FUND CLUSTER: ${fundClusterText}`]);
    worksheet.addRow([]); // spacer

    // Header
    const header = [
      'PPE',
      'Fund_Cluster',
      'CollCode',
      'Name',
      'Description',
      'SerialNumber',
      'AnDate',
      'MR',
      'PAR',
      'Quantity',
      'Unit Measure',
      'Unit Cost',
      'Total Cost',
      'Location',
      'User',
      'Email',
      'Current User',
      'Status',
    ];
    const headerRow = worksheet.addRow(header);

    // Header styling
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA0A0A0' }, // Gray
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      worksheet.getColumn(colNumber).width = header[colNumber - 1].length + 5;
    });

    if (filteredData.length === 0) {
      this.toastr.warning('No assets found for that user.', 'Filter Result');
      return;
    }

    // Add Data
    filteredData.forEach((item) => {
      const row = worksheet.addRow([
        item.PPE,
        item.Fund_Cluster,
        item.CollCode,
        item.Name,
        item.Desc1,
        item.SerialNumber,
        item.AnDate,
        item.MrNum,
        item.PropNo,
        item.Qty,
        item.UM,
        item.UCost,
        item.TCost,
        item.Location,
        item.UserName,
        item.Email,
        item.CurrentUser,
        item.EqStatus,
      ]);

      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', wrapText: true };
        const currentWidth = worksheet.getColumn(colNumber).width || 10;
        worksheet.getColumn(colNumber).width = Math.max(
          currentWidth,
          (cell.value?.toString().length || 0) + 5,
        );
      });
    });

    // Footer
    const footerRow = worksheet.addRow([]);
    worksheet.mergeCells(`A${footerRow.number + 1}:N${footerRow.number + 1}`);
    const footerCell = worksheet.getCell(`A${footerRow.number + 1}`);
    footerCell.value =
      'Confidential Document - Supply Procurement Management Office';
    footerCell.alignment = { horizontal: 'center' };
    footerCell.font = { italic: true, size: 10 };

    // Save Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `Asset_List_${this.filterUserName || 'All'}.xlsx`);
    });
  }

  exportToPDF(): void {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'legal', // cleaner than custom [936,612]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const imgSize = 60;

    const leftLogo = 'assets/img/UPM_LOGO.png';
    const rightLogo = 'assets/img/ITO.png';

    // ================================
    // LOAD LOGOS (SAFE VERSION)
    // ================================
    const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d')?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = reject;
      });
    };

    // ================================
    // FILTER DATA (UserName OR Fund)
    // ================================
    const filteredData = this.dataSource.data.filter((item) => {
      if (!this.filterUserName) return true;
      const search = this.filterUserName.toLowerCase();
      return (
        item.UserName?.toLowerCase().includes(search) ||
        item.Fund_Cluster?.toLowerCase().includes(search)
      );
    });

    if (filteredData.length === 0) {
      this.toastr.warning('No assets found.', 'Filter Result');
      return;
    }

    // ================================
    // LOAD IMAGES THEN BUILD PDF
    // ================================
    Promise.all([loadImage(leftLogo), loadImage(rightLogo)])
      .then(([leftImg, rightImg]) => {
        // ================================
        // HEADER
        // ================================
        doc.addImage(leftImg, 'PNG', margin, 20, imgSize, imgSize);
        doc.addImage(
          rightImg,
          'PNG',
          pageWidth - margin - imgSize,
          20,
          imgSize,
          imgSize,
        );

        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        doc.text('UNIVERSITY OF THE PHILIPPINES MINDANAO', pageWidth / 2, 45, {
          align: 'center',
        });

        doc.setFontSize(13);
        doc.text(
          'PROPERTY, PLANT AND EQUIPMENT INVENTORY REPORT',
          pageWidth / 2,
          65,
          { align: 'center' },
        );

        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        doc.text(`Fund Cluster: ${this.filterUserName || 'ALL'}`, margin, 100);

        const today = new Date().toLocaleDateString();
        doc.text(`Generated on: ${today}`, pageWidth - margin, 100, {
          align: 'right',
        });

        // ================================
        // TABLE HEADERS
        // ================================
        const headers = [
          [
            'PPE',
            'Cluster',
            'Code',
            'Item',
            'Description',
            'Serial No.',
            'Acq Date',
            'MR',
            'PAR',
            'Qty',
            'Unit',
            'Unit Cost',
            'Total Cost',
            'Location',
            'User',
            'Status',
          ],
        ];

        let grandTotal = 0;

        const body = filteredData.map((item) => {
          const unitCost = Number(item.UCost || 0);
          const totalCost = Number(item.TCost || 0);
          grandTotal += totalCost;

          return [
            item.PPE || '',
            item.Fund_Cluster || '',
            item.CollCode || '',
            item.Name || '',
            item.Desc1 || '',
            item.SerialNumber || '',
            item.AnDate || '',
            item.MrNum || '',
            item.PropNo || '',
            item.Qty || '',
            item.UM || '',
            unitCost.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            item.Location || '',
            item.UserName || '',
            item.EqStatus || '',
          ];
        });

        // ================================
        // TABLE
        // ================================
        autoTable(doc, {
          head: headers,
          body: body,
          startY: 120,
          theme: 'grid',
          styles: {
            font: 'times',
            fontSize: 8,
            cellPadding: 4,
            valign: 'middle',
          },
          headStyles: {
            fillColor: [60, 60, 60],
            textColor: 255,
            halign: 'center',
          },
          columnStyles: {
            9: { halign: 'center' },
            11: { halign: 'right' },
            12: { halign: 'right' },
          },
          didDrawPage: (data) => {
            // Footer
            doc.setFontSize(9);
            doc.text(
              `Page ${doc.getNumberOfPages()}`,
              pageWidth - margin,
              pageHeight - 20,
              { align: 'right' },
            );

            doc.text(
              'Confidential Document - Supply Procurement Management Office',
              pageWidth / 2,
              pageHeight - 20,
              { align: 'center' },
            );
          },
        });

        // ================================
        // GRAND TOTAL
        // ================================
        const finalY = (doc as any).lastAutoTable.finalY + 20;

        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.text(
          `GRAND TOTAL: ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          pageWidth - margin,
          finalY,
          { align: 'right' },
        );
        // ================================
        // SIGNATURE SECTION
        // ================================
        const signatureStartY = finalY + 40;

        doc.setFont('times', 'normal');
        doc.setFontSize(10);

        // Prepared by (Left side)
        doc.text('Prepared by:', margin, signatureStartY);

        // Line for signature
        doc.line(
          margin,
          signatureStartY + 25,
          margin + 250,
          signatureStartY + 25,
        );

        doc.setFontSize(8);
        doc.text(
          'Signature over Printed Name of Concerned Inventory Committee Member',
          margin,
          signatureStartY + 38,
        );

        // // Date (Left bottom)
        // doc.setFontSize(10);
        // doc.text('Date:', margin, signatureStartY + 60);

        doc.line(
          margin + 40,
          signatureStartY + 60,
          margin + 200,
          signatureStartY + 60,
        );

        // Reviewed by (Right side)
        doc.setFontSize(10);
        doc.text('Reviewed by:', pageWidth - margin - 300, signatureStartY);

        // Line for reviewed by
        doc.line(
          pageWidth - margin - 300,
          signatureStartY + 25,
          pageWidth - margin,
          signatureStartY + 25,
        );
        // ================================
        // SAVE FILE
        // ================================
        const fileName = this.filterUserName
          ? `Asset_List_${this.filterUserName}.pdf`
          : 'Asset_List_Report.pdf';

        doc.save(fileName);
      })
      .catch(() => {
        this.toastr.error('Error loading logos.');
      });
  }

}
