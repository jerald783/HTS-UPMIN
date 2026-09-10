import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AdmAssetsService } from '../../../../services/adminServices/adm-assets.service';
@Component({
  selector: 'app-user-assets-view',
  standalone: false,
  templateUrl: './user-assets-view.component.html',
  styleUrl: './user-assets-view.component.scss',
})
export class UserAssetsViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ModalTitle: string | undefined;

  events: any;

  displayedColumns: string[] = [
    'Fund_Cluster',
    'CollCode',
    'Name',
    'Desc1',
    'AnDate',
    'MrNum',
    'PropNo',
    'Qty',
    'UM',
    'UCost',
    'TCost',
    'UserName',
    'Email',
    'CurrentUser',
    'EqStatus',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private service: AdmAssetsService,
    private toastr: ToastrService,
  ) {}

  // ngOnInit(): void {
  //     this.currentUserRole = localStorage.getItem('userRole') || '';
  //   this.refreshAssetsList();
  // }

  currentUserRole: string = ''; // e.g. 'Regular' or 'COS'

  ngOnInit(): void {
    this.currentUserRole = localStorage.getItem('userRole') || '';
    if (this.currentUserRole === 'Regular') {
      this.displayedColumns = ['select', ...this.displayedColumns];
    }

    // 🔍 Configure filter to search across all properties
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = Object.values(data).join('◬').toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };

    this.refreshAssetsList();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    // Apply paginator and sort to dataSource once the view is initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openBulkTransfer() {
    const newUser = prompt('Enter Accountable User email:');
    if (!newUser) return;

    const selectedIds = this.selection.selected.map((item) => item.Id);

    this.service.bulkTransferAssets(selectedIds, newUser).subscribe({
      next: () => {
        this.toastr.success('Assets transferred successfully', 'Updated');
        this.refreshAssetsList();
        this.selection.clear();
      },
      error: (err) => {
        console.error('❌ Error bulk transferring:', err);
        this.toastr.error('Failed to transfer assets', 'Error');
      },
    });
  }

  selection = new SelectionModel<any>(true, []);

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

  deleteClick(item: any): void {
    if (confirm('Are you sure you want to delete this repository?')) {
      this.service.deleteAssets(item.Id).subscribe(() => {
        this.toastr.error('Deleted Successfully', 'Deleted');
        this.refreshAssetsList();
      });
    }
  }

  refreshAssetsList(): void {
    const loggedInEmail = localStorage.getItem('Email');
    const currentUser = localStorage.getItem('CurrentUser');
    const userIdentifier = loggedInEmail || currentUser;

    if (!userIdentifier) {
      console.error('❌ No Email or CurrentUser found in localStorage.');
      return;
    }

    //  Display which identifier is being used
    console.log(
      `🔍 Using ${loggedInEmail ? 'Email' : 'CurrentUser'}: ${userIdentifier}`,
    );

    this.service.getAssetsByUser(userIdentifier).subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a: any, b: any) => b.Id - a.Id);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('❌ Error fetching assets:', err);
      },
    });
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assets');

    // Define Header Row
    const header = [
      'CollCode',
      'Name',
      'Desc',
      'AnDate',
      'MR',
      'PAR',
      'Qty',
      'UM',
      'UCost',
      'TCost',
      'User',
      'Email',
      'Current USer',
      'Status',
    ];

    // Add Header with Styling
    const headerRow = worksheet.addRow(header);

    if (headerRow && typeof headerRow.eachCell === 'function') {
      headerRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00FF00' }, // Green background
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' }, // White font
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

        // Initialize column width based on header length
        worksheet.getColumn(colNumber).width = header[colNumber - 1].length + 5;
      });
    }

    // Add Data Rows
    this.dataSource.data.forEach((item) => {
      const row = worksheet.addRow([
        item.CollCode,
        item.Name,
        item.Des1,
        item.AnDate,
        item.MrNum,
        item.PropNo,
        item.Qty,
        item.UM,
        item.UCost,
        item.TCost,
        item.UserName,
        item.Email,
        item.CurrentUser,
        item.EqStatus,
      ]);

      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', wrapText: true };

        // Adjust column width if data is longer than header
        const currentWidth = worksheet.getColumn(colNumber).width || 10;
        const newWidth = Math.max(
          currentWidth,
          (cell.value?.toString().length || 0) + 5,
        );
        worksheet.getColumn(colNumber).width = newWidth;
      });
    });

    // Export to Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'Assets_List.xlsx');
    });
  }

  exportToPDF(): void {
    // const doc = new jsPDF();
    const doc = new jsPDF('landscape');
    // Add logos
    const leftLogo = 'assets/img/UPM_LOGO.png'; // Replace with actual path
    const rightLogo = 'assets/img/ITO.png'; // Replace with actual path

    const imgWidth = 30;
    const imgHeight = 30;

    doc.addImage(leftLogo, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.addImage(rightLogo, 'PNG', 170, 10, imgWidth, imgHeight);

    // Add Title
    doc.setFontSize(16);
    doc.text('Assets List Report - 2025', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Inventory Ticketing System', 105, 30, { align: 'center' });

    // Prepare table data
    const headers = [
      [
        'CollCode',
        'Name',
        'Desc',
        'AnDate',
        'MR',
        'PAR',
        'Qty',
        'UM',
        'UCost',
        'TCost',
        'User',
        'Email',
        'Current User',
        'Status',
      ],
    ];
    const data = this.dataSource.data.map((item) => [
      item.CollCode,
      item.Name,
      item.Desc1,
      item.AnDate,
      item.MrNum,
      item.PropNo,
      item.Qty,
      item.UM,
      item.UCost,
      item.TCost,
      item.UserName,
      item.Email,
      item.CurrentUser,
      item.EqStatus,
    ]);

    // Add table
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 2,
        overflow: 'linebreak', // Ensure text breaks properly
        valign: 'middle', // Vertically center text
      },
      headStyles: {
        fillColor: [220, 53, 69], // Header background color
        textColor: 255,
        halign: 'center', // Horizontally center text
        valign: 'middle', // Vertically center text
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
        7: { cellWidth: 'auto' },
        8: { cellWidth: 'auto' },
        9: { cellWidth: 'auto' },
        10: { cellWidth: 'auto' },
        11: { cellWidth: 'auto' },
        12: { cellWidth: 'auto' },
        13: { cellWidth: 'auto' },
      },
      margin: { top: 40 },
      tableWidth: 'auto', // Adjust table width automatically
      didDrawPage: (_data: any) => {
        doc.addImage(leftLogo, 'PNG', 10, 10, imgWidth, imgHeight);
        doc.addImage(rightLogo, 'PNG', 170, 10, imgWidth, imgHeight);
        doc.setFontSize(16);
        doc.text('Assets List Report - 2025', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Inventory Ticketing System', 105, 30, { align: 'center' });
      },
    });

    // Save PDF
    doc.save('Asset_Report.pdf');
  }
}
