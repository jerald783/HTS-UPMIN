import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TicketService } from '../../../../services/UserServices/ticket.service';
import { AdmZoomScheduleService } from '../../../../services/UserServices/zoom-schedule.service';

Chart.register(...registerables);

interface TicketStat {
  year: number;
  month: number;
  day?: number;
  created: number;
  closed: number;
  reopened: number;
  assigned: number;
  overdue: number;
}

interface ZoomStat {
  year: number;
  month: number;
  day?: number;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const chartBackgroundPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    ctx.save();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.width,
      chartArea.height * 0.5
    );

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(
      chartArea.left,
      chartArea.top + chartArea.height * 0.5,
      chartArea.width,
      chartArea.height * 0.5
    );
    ctx.restore();
  }
};

@Component({
  selector: 'app-ito-dashboard',
  standalone: false,
  templateUrl: './ito-dashboard.component.html',
  styleUrl: './ito-dashboard.component.scss',
})
export class ItoDashboardComponent implements OnInit, OnDestroy {
  chart?: Chart;

  months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  selectedStatType: 'ticket' | 'zoom' = 'ticket';
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];
  allYears: number[] = [];

  showFilters = false;
  fromDate = '';
  toDate = '';
  activePreset = '';

  /* Ticket Data & KPI */
  allData: TicketStat[] = [];
  totalTickets = 0;
  resolvedTickets = 0;
  pendingTickets = 0;
  overdueTickets = 0;

  /* Zoom Data & KPI */
  zoomData: ZoomStat[] = [];
  totalZoomCreated = 0;
  zoomPending = 0;
  zoomApproved = 0;
  zoomRejected = 0;

  constructor(
    private ticketService: TicketService,
    private zoomService: AdmZoomScheduleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAllYears();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  setStatType(type: 'ticket' | 'zoom'): void {
    if (this.selectedStatType !== type) {
      this.selectedStatType = type;
      this.loadData();
    }
  }

  onTabChange(): void {
    this.loadData();
  }

  loadAllYears(): void {
    this.ticketService
      .getTicketStats()
      .subscribe({
        next: (data: any[]) => {
          this.allYears = [...new Set(data.map((d) => +d.Year))].sort(
            (a, b) => b - a,
          );
          this.availableYears = this.allYears;

          if (!this.availableYears.includes(this.selectedYear) && this.availableYears.length > 0) {
            this.selectedYear = this.availableYears[0];
          }
        },
        error: (err) => console.error(err),
      });
  }

  private processTicketData(data: any[]): void {
    this.allData = data.map((d) => ({
      year: +d.Year,
      month: +d.Month,
      day: +d.Day || +d.DayOfMonth || 1,
      created: +d.Created || 0,
      closed: +d.Closed || 0,
      reopened: +d.TotalReopenEvents || 0,
      assigned: +d.Assigned || 0,
      overdue: +d.Overdue || 0,
    }));

    const dataYears = [...new Set(this.allData.map((d) => d.year))];

    if (!dataYears.includes(this.selectedYear) && dataYears.length > 0) {
      this.selectedYear = dataYears[0];
    }

    this.updateTicketDashboardDaily(this.selectedYear);
  }

  private processZoomData(data: any[]): void {
    this.zoomData = data.map((d) => ({
      year: +d.Year,
      month: +d.Month,
      day: +d.Day || +d.DayOfMonth || 1,
      total: +d.Total || 0,
      pending: +d.Pending || 0,
      approved: +d.Approved || 0,
      rejected: +d.Rejected || 0,
    }));

    const dataYears = [...new Set(this.zoomData.map((d) => d.year))];

    if (!dataYears.includes(this.selectedYear) && dataYears.length > 0) {
      this.selectedYear = dataYears[0];
    }

    this.updateZoomDashboardDaily(this.selectedYear);
  }

  onYearChange(): void {
    this.fromDate = `${this.selectedYear}-01-01`;
    this.toDate = `${this.selectedYear}-12-31`;
    this.activePreset = '';
    this.loadData();
  }

  applyFilters(): void {
    this.loadData();
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.activePreset = '';
    this.selectedYear = new Date().getFullYear();
    this.loadData();
  }

  setPreset(presetKey: string): void {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (presetKey) {
      case '7d':
        start.setDate(today.getDate() - 7);
        break;
      case '30d':
        start.setDate(today.getDate() - 30);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'ytd':
        start = new Date(today.getFullYear(), 0, 1);
        break;
    }

    this.fromDate = this.formatDateToString(start);
    this.toDate = this.formatDateToString(end);
    this.selectedYear = today.getFullYear();
    this.activePreset = presetKey;

    this.applyFilters();
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updateTicketDashboardDaily(year: number): void {
    const filtered = this.allData.filter((d) => d.year === year);
    const dailyMap: { [date: string]: any } = {};

    filtered.forEach((d) => {
      const monthStr = String(d.month).padStart(2, '0');
      const dayStr = String(d.day || 1).padStart(2, '0');
      const dateKey = `${monthStr}-${dayStr}-${year}`;

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { created: 0, closed: 0, reopened: 0, assigned: 0, overdue: 0 };
      }
      dailyMap[dateKey].created += d.created;
      dailyMap[dateKey].closed += d.closed;
      dailyMap[dateKey].reopened += d.reopened;
      dailyMap[dateKey].assigned += d.assigned;
      dailyMap[dateKey].overdue += d.overdue;
    });

    const dates = Object.keys(dailyMap);
    const createdArr = dates.map((date) => dailyMap[date].created);
    const closedArr = dates.map((date) => dailyMap[date].closed);
    const reopenedArr = dates.map((date) => dailyMap[date].reopened);
    const assignedArr = dates.map((date) => dailyMap[date].assigned);
    const overdueArr = dates.map((date) => dailyMap[date].overdue);

    this.totalTickets = createdArr.reduce((a, b) => a + b, 0);
    this.resolvedTickets = closedArr.reduce((a, b) => a + b, 0);
    this.pendingTickets = Math.max(this.totalTickets - this.resolvedTickets, 0);
    this.overdueTickets = overdueArr.reduce((a, b) => a + b, 0);

    this.cdr.detectChanges();
    setTimeout(() => {
      this.renderDailyTicketChart(year, dates, {
        created: createdArr,
        closed: closedArr,
        reopened: reopenedArr,
        assigned: assignedArr,
        overdue: overdueArr,
      });
    }, 0);
  }

  private updateZoomDashboardDaily(year: number): void {
    const filtered = this.zoomData.filter((d) => d.year === year);
    const dailyMap: { [date: string]: any } = {};

    filtered.forEach((d) => {
      const monthStr = String(d.month).padStart(2, '0');
      const dayStr = String(d.day || 1).padStart(2, '0');
      const dateKey = `${monthStr}-${dayStr}-${year}`;

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { created: 0, pending: 0, approved: 0, rejected: 0 };
      }
      dailyMap[dateKey].created += d.total;
      dailyMap[dateKey].pending += d.pending;
      dailyMap[dateKey].approved += d.approved;
      dailyMap[dateKey].rejected += d.rejected;
    });

    const dates = Object.keys(dailyMap);
    const createdArr = dates.map((date) => dailyMap[date].created);
    const pendingArr = dates.map((date) => dailyMap[date].pending);
    const approvedArr = dates.map((date) => dailyMap[date].approved);
    const rejectedArr = dates.map((date) => dailyMap[date].rejected);

    this.totalZoomCreated = createdArr.reduce((a, b) => a + b, 0);
    this.zoomPending = pendingArr.reduce((a, b) => a + b, 0);
    this.zoomApproved = approvedArr.reduce((a, b) => a + b, 0);
    this.zoomRejected = rejectedArr.reduce((a, b) => a + b, 0);

    this.cdr.detectChanges();
    setTimeout(() => {
      this.renderDailyZoomChart(year, dates, {
        created: createdArr,
        pending: pendingArr,
        approved: approvedArr,
        rejected: rejectedArr,
      });
    }, 0);
  }

  private renderDailyTicketChart(year: number, labels: string[], series: any): void {
    this.destroyChart();

    const canvas = document.getElementById('ticketChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'line',
      plugins: [chartBackgroundPlugin],
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Created',
            data: series.created,
            borderColor: '#2563eb',
            backgroundColor: '#2563eb',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Closed',
            data: series.closed,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Reopened',
            data: series.reopened,
            borderColor: '#ef4444',
            backgroundColor: '#ef4444',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Assigned',
            data: series.assigned,
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Overdue',
            data: series.overdue,
            borderColor: '#8b5cf6',
            backgroundColor: '#8b5cf6',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,
              color: '#6b7280',
              font: { size: 12 },
              padding: 16
            },
          },
          title: {
            display: true,
            text: `Daily Ticket Statistics (${year})`,
            font: { size: 15, weight: 'bold' },
          },
          tooltip: { backgroundColor: '#111827' },
        },
        scales: {
          x: {
            grid: { color: '#e2e8f0' },
            ticks: { color: '#475569', font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#e2e8f0' },
            ticks: { color: '#475569', font: { size: 11 }, precision: 0 },
          },
        },
      },
    });
  }

  private renderDailyZoomChart(year: number, labels: string[], series: any): void {
    this.destroyChart();

    const canvas = document.getElementById('zoomChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'line',
      plugins: [chartBackgroundPlugin],
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Created',
            data: series.created,
            borderColor: '#2563eb',
            backgroundColor: '#2563eb',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Pending',
            data: series.pending,
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Approved',
            data: series.approved,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Rejected',
            data: series.rejected,
            borderColor: '#ef4444',
            backgroundColor: '#ef4444',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,
              color: '#6b7280',
              font: { size: 12 },
              padding: 16
            },
          },
          title: {
            display: true,
            text: `Daily Zoom Statistics (${year})`,
            font: { size: 15, weight: 'bold' },
          },
          tooltip: { backgroundColor: '#111827' },
        },
        scales: {
          x: {
            grid: { color: '#e2e8f0' },
            ticks: { color: '#475569', font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#e2e8f0' },
            ticks: { color: '#475569', font: { size: 11 }, precision: 0 },
          },
        },
      },
    });
  }

  exportToExcel(): void {
    if (this.selectedStatType === 'ticket') {
      const exportData = this.allData
        .filter((d) => d.year === this.selectedYear)
        .map((d) => ({
          Year: d.year,
          Month: this.months[d.month - 1],
          Created: d.created,
          Closed: d.closed,
          'Reopened (Total Events)': d.reopened,
          Assigned: d.assigned,
          Overdue: d.overdue,
        }));

      if (!exportData.length) return;

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ticket Stats');

      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([buf], { type: 'application/octet-stream' }),
        `Ticket_Stats_${this.selectedYear}.xlsx`,
      );
    } else {
      const exportData = this.zoomData
        .filter((d) => d.year === this.selectedYear)
        .map((d) => ({
          Year: d.year,
          Month: this.months[d.month - 1],
          Created: d.total,
          Pending: d.pending,
          Approved: d.approved,
          Rejected: d.rejected,
        }));

      if (!exportData.length) return;

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Zoom Stats');

      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([buf], { type: 'application/octet-stream' }),
        `Zoom_Stats_${this.selectedYear}.xlsx`,
      );
    }
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  loadData(): void {
    this.destroyChart();

    if (this.selectedStatType === 'ticket') {
      this.ticketService.getTicketStats(this.fromDate, this.toDate).subscribe({
        next: (data: any[]) => this.processTicketData(data),
        error: (err) => console.error(err),
      });
    } else if (this.selectedStatType === 'zoom') {
      this.zoomService.getZoomStats(this.fromDate, this.toDate).subscribe({
        next: (data: any[]) => this.processZoomData(data),
        error: (err) => console.error(err),
      });
    }
  }
}