/* =========================
   IMPORTS
========================= */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicketService } from '../../../../services/UserServices/ticket.service';
import { AdmZoomScheduleService } from '../../../../services/UserServices/zoom-schedule.service';
import { FeedbackService } from '../../../../services/UserServices/feedback.service';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

/* =========================
   INTERFACES
========================= */
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

interface FeedbackStat {
  Year: number;
  Month: number;
  SupportAgent: string;
  TotalFeedbacks: number;
  AvgRating: number;
  AvgResponseTime: number;
  AvgTechnicalKnowledge: number;
  AvgProfessionalism: number;
  AvgCommunication: number;
  AvgResolution: number;
  FeedbackText?: string;
}

interface SlaStat {
  priority: string;
  totalResolved: number;
  withinSLA: number;
  beyondSLA: number;
  slaPercentage: number;
}

/* =========================
   CUSTOM CHART.JS PLUGIN
   Dual-tone chart background area
========================= */
const chartBackgroundPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    ctx.save();

    // Top light background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.width,
      chartArea.height * 0.5,
    );

    // Bottom subtle shaded area
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(
      chartArea.left,
      chartArea.top + chartArea.height * 0.5,
      chartArea.width,
      chartArea.height * 0.5,
    );

    ctx.restore();
  },
};

/* =========================
   COMPONENT
========================= */
@Component({
  selector: 'app-ito-admin-dashboard',
  standalone: false,
  templateUrl: './ito-admin-dashboard.component.html',
  styleUrl: './ito-admin-dashboard.component.scss',
})
export class ItoAdminDashboardComponent implements OnInit, OnDestroy {
  /* =========================
     CHARTS
  ========================= */
  chart?: Chart;
  agentChart?: Chart;
  feedbackChart?: Chart;
  slaChart?: Chart;

  /* =========================
     COMMON
  ========================= */
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  selectedStatType: 'ticket' | 'zoom' | 'agent' | 'feedback' | 'sla' = 'ticket';
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];
  allYears: number[] = [];

  showFilters = false;
  fromDate = '';
  toDate = '';
  activePreset = ''; 
  /* =========================
     TICKET DATA & KPI
  ========================= */
  allData: TicketStat[] = [];
  totalTickets = 0;
  resolvedTickets = 0;
  pendingTickets = 0;
  overdueTickets = 0;

  /* =========================
     ZOOM DATA & KPI
  ========================= */
  zoomData: ZoomStat[] = [];
  totalZoomCreated = 0;
  zoomPending = 0;
  zoomApproved = 0;
  zoomRejected = 0;

  /* =========================
     FEEDBACK DATA
  ========================= */
  feedbackStats: FeedbackStat[] = [];

  /* =========================
     SLA COMPLIANCE DATA
  ========================= */
  slaStats: SlaStat[] = [];
  overallSlaPercentage = 0;
  totalSlaResolved = 0;
  totalWithinSla = 0;
  totalBeyondSla = 0;

  /* =========================
     CONSTRUCTOR
  ========================= */
  constructor(
    private ticketService: TicketService,
    private zoomService: AdmZoomScheduleService,
    private feedbackService: FeedbackService,
    private http: HttpClient,
  ) {}

  /* =========================
     LIFECYCLE
  ========================= */
  ngOnInit() {
    this.loadAllYears();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  loadAllYears(): void {
    this.ticketService.getTicketStats().subscribe({
      next: (data: any[]) => {
        this.allYears = [...new Set(data.map((d) => +d.Year))].sort(
          (a, b) => b - a,
        );

        this.availableYears = this.allYears;

        if (
          !this.availableYears.includes(this.selectedYear) &&
          this.availableYears.length > 0
        ) {
          this.selectedYear = this.availableYears[0];
        }
      },
      error: (err) => console.error('Error loading available years:', err),
    });
  }

  /* =========================
     LOAD DATA SWITCHER
  ========================= */
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
    } else if (this.selectedStatType === 'agent') {
      this.ticketService
        .getAgentClosingStats(
          this.fromDate || undefined,
          this.toDate || undefined,
          !this.fromDate && !this.toDate ? this.selectedYear : undefined,
        )
        .subscribe({
          next: (data: any[]) => this.renderAgentPieChart(data),
          error: (err) => console.error(err),
        });
    } else if (this.selectedStatType === 'feedback') {
      this.loadFeedbackStats();
    } else if (this.selectedStatType === 'sla') {
      this.loadSlaStats();
    }
  }

  /* =========================
     PROCESS TICKET & ZOOM DATA (DAILY)
  ========================= */
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
    if (
      !this.availableYears.includes(this.selectedYear) &&
      this.availableYears.length > 0
    ) {
      this.selectedYear = this.availableYears[0];
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
    if (
      !this.availableYears.includes(this.selectedYear) &&
      this.availableYears.length > 0
    ) {
      this.selectedYear = this.availableYears[0];
    }

    this.updateZoomDashboardDaily(this.selectedYear);
  }

  /* =========================
     FEEDBACK API & PROCESSING
  ========================= */
  private loadFeedbackStats(): void {
    let fromDateParam: string | undefined = this.fromDate || undefined;
    let toDateParam: string | undefined = this.toDate || undefined;

    if (!fromDateParam && this.selectedYear) {
      fromDateParam = `${this.selectedYear}-01-01`;
    }
    if (!toDateParam && this.selectedYear) {
      toDateParam = `${this.selectedYear}-12-31`;
    }

    this.feedbackService
      .getFeedbackStats(fromDateParam, toDateParam)
      .subscribe({
        next: (data) => {
          this.feedbackStats = data;
          this.renderFeedbackChart();
        },
        error: (err) => console.error('Error fetching feedback stats:', err),
      });
  }

  /* =========================
     SLA API & PROCESSING
  ========================= */
  private loadSlaStats(): void {
    let fromDateParam: string | undefined = this.fromDate || undefined;
    let toDateParam: string | undefined = this.toDate || undefined;

    if (!fromDateParam && this.selectedYear) {
      fromDateParam = `${this.selectedYear}-01-01`;
    }
    if (!toDateParam && this.selectedYear) {
      toDateParam = `${this.selectedYear}-12-31`;
    }

    this.ticketService
      .getSlaComplianceStats(fromDateParam, toDateParam)
      .subscribe({
        next: (data: any[]) => {
          this.slaStats = (data || []).map((s) => ({
            priority: s.priority || s.Priority || 'Unknown',
            totalResolved: Number(s.totalResolved ?? s.TotalResolved ?? 0),
            withinSLA: Number(s.withinSLA ?? s.WithinSLA ?? 0),
            beyondSLA: Number(s.beyondSLA ?? s.BeyondSLA ?? 0),
            slaPercentage: Number(s.slaPercentage ?? s.SlaPercentage ?? 0),
          }));

          this.totalSlaResolved = this.slaStats.reduce(
            (sum, s) => sum + s.totalResolved,
            0,
          );
          this.totalWithinSla = this.slaStats.reduce(
            (sum, s) => sum + s.withinSLA,
            0,
          );
          this.totalBeyondSla = this.slaStats.reduce(
            (sum, s) => sum + s.beyondSLA,
            0,
          );

          this.overallSlaPercentage =
            this.totalSlaResolved > 0
              ? Number(
                  ((this.totalWithinSla / this.totalSlaResolved) * 100).toFixed(
                    2,
                  ),
                )
              : 0;

          this.renderSlaChart();
        },
        error: (err) =>
          console.error('Error fetching SLA compliance stats:', err),
      });
  }

  /* =========================
     EVENTS
  ========================= */
  onYearChange(): void {
    this.fromDate = `${this.selectedYear}-01-01`;
    this.toDate = `${this.selectedYear}-12-31`;
    this.activePreset = '';
    this.loadData();
  }

  applyFilters(): void {
    this.loadData();
  }

  /* =========================
     DAILY DASHBOARD CALCULATIONS
  ========================= */
  private updateTicketDashboardDaily(year: number): void {
    const filtered = this.allData.filter((d) => d.year === year);
    const dailyMap: { [date: string]: any } = {};

    filtered.forEach((d) => {
      const monthStr = String(d.month).padStart(2, '0');
      const dayStr = String(d.day || 1).padStart(2, '0');
      const dateKey = `${monthStr}-${dayStr}-${year}`;

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          created: 0,
          closed: 0,
          reopened: 0,
          assigned: 0,
          overdue: 0,
        };
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

    this.renderDailyTicketChart(year, dates, {
      created: createdArr,
      closed: closedArr,
      reopened: reopenedArr,
      assigned: assignedArr,
      overdue: overdueArr,
    });
  }

  private updateZoomDashboardDaily(year: number): void {
    const filtered = this.zoomData.filter((d) => d.year === year);
    const dailyMap: { [date: string]: any } = {};

    filtered.forEach((d) => {
      const monthStr = String(d.month).padStart(2, '0');
      const dayStr = String(d.day || 1).padStart(2, '0');
      const dateKey = `${monthStr}-${dayStr}-${year}`;

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          created: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        };
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

    this.renderDailyZoomChart(year, dates, {
      created: createdArr,
      pending: pendingArr,
      approved: approvedArr,
      rejected: rejectedArr,
    });
  }

  /* =========================
     CHARTS RENDERING
  ========================= */
  /* =========================
     CHARTS RENDERING (CIRCULAR BOTTOM LEGEND)
  ========================= */
  private renderDailyTicketChart(
    year: number,
    labels: string[],
    series: any,
  ): void {
    this.chart = new Chart('ticketChart', {
      type: 'line',
      plugins: [chartBackgroundPlugin],
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Created',
            data: series.created,
            borderColor: '#2563eb', // Blue
            backgroundColor: '#2563eb',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Closed',
            data: series.closed,
            borderColor: '#10b981', // Green
            backgroundColor: '#10b981',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Reopened',
            data: series.reopened,
            borderColor: '#ef4444', // Red
            backgroundColor: '#ef4444',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Assigned',
            data: series.assigned,
            borderColor: '#f59e0b', // Orange/Gold
            backgroundColor: '#f59e0b',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Overdue',
            data: series.overdue,
            borderColor: '#8b5cf6', // Purple
            backgroundColor: '#8b5cf6',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
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
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 12,
              boxHeight: 12,
              color: '#6b7280', 
              font: { size: 13, weight: 'normal' },
              padding: 20,
            },
          },
          title: {
            display: true,
            text: `Daily Ticket Statistics (${year})`,
            font: { size: 16, weight: 'bold' },
          },
          tooltip: { backgroundColor: '#111827' },
          datalabels: {
            color: '#ffffff',
            font: {size: 9 },
          },
        },
        scales: {
          x: {
            grid: { color: '#cbd5e1', lineWidth: 1 },
            ticks: {
              color: '#334155',
              font: { size: 11, weight: 500 },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#cbd5e1', lineWidth: 1 },
            ticks: {
              color: '#334155',
              font: { size: 11, weight: 500 },
              precision: 0,
            },
          },
        },
      },
    });
  }

  private renderDailyZoomChart(
    year: number,
    labels: string[],
    series: any,
  ): void {
    this.chart = new Chart('zoomChart', {
      type: 'line',
      plugins: [chartBackgroundPlugin],
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Created',
            data: series.created,
            borderColor: '#2563eb', // Blue
            backgroundColor: '#2563eb',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Pending',
            data: series.pending,
            borderColor: '#f59e0b', // Orange
            backgroundColor: '#f59e0b',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Approved',
            data: series.approved,
            borderColor: '#10b981', // Green
            backgroundColor: '#10b981',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
          },
          {
            label: 'Rejected',
            data: series.rejected,
            borderColor: '#ef4444', // Red
            backgroundColor: '#ef4444',
            tension: 0,
            borderWidth: 1.5,
            pointRadius: 4.5,
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
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 12,
              boxHeight: 12,
              color: '#6b7280', // Gray text color matching the image
              font: { size: 13, weight: 'normal' },
              padding: 20,
            },
          },
          title: {
            display: true,
            text: `Daily Zoom Statistics (${year})`,
            font: { size: 16, weight: 'bold' },
          },
          tooltip: { backgroundColor: '#111827' },
          datalabels: {
            color: '#ffffff',
            font: {  size: 9 },
          },
        },
        scales: {
          x: {
            grid: { color: '#cbd5e1', lineWidth: 1 },
            ticks: {
              color: '#334155',
              font: { size: 11, weight: 500 },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#cbd5e1', lineWidth: 1 },
            ticks: {
              color: '#334155',
              font: { size: 11, weight: 500 },
              precision: 0,
            },
          },
        },
      },
    });
  }

  private renderAgentPieChart(data: any[]): void {
    const labels = data.map((d) => d.Agent || 'Unassigned');
    const values = data.map((d) => +d.ClosedTickets || 0);

    this.agentChart = new Chart('agentPieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
              '#14b8a6',
              '#f97316',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Tickets per Agent',
            font: { size: 16, weight: 'bold' },
          },
          datalabels: {
            color: '#ffffff',
            font: {  size: 11 },
          },
        },
      },
    });
  }

  private renderFeedbackChart(): void {
    const agentMap: {
      [agent: string]: { totalRating: number; count: number };
    } = {};

    this.feedbackStats.forEach((stat) => {
      const agent = stat.SupportAgent || 'Unassigned';
      if (!agentMap[agent]) {
        agentMap[agent] = { totalRating: 0, count: 0 };
      }
      agentMap[agent].totalRating +=
        Number(stat.AvgRating) * Number(stat.TotalFeedbacks);
      agentMap[agent].count += Number(stat.TotalFeedbacks);
    });

    const labels = Object.keys(agentMap);
    const scores = labels.map((agent) =>
      Number((agentMap[agent].totalRating / agentMap[agent].count).toFixed(2)),
    );

    this.feedbackChart = new Chart('feedbackChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Overall Rating (Out of 5)',
            data: scores,
            backgroundColor: '#2563eb',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true } },
          title: {
            display: true,
            text: 'Support Agent Average Overall Performance Rating',
            font: { size: 16, weight: 'bold' },
          },
          datalabels: {
            color: '#ffffff',
            font: {  size: 11 },
          },
        },
        scales: {
          y: { beginAtZero: true, max: 5 },
          x: { grid: { display: false } },
        },
      },
    });
  }

  private renderSlaChart(): void {
    const priorities = this.slaStats.map((s) => s.priority);

    const withinSlaData = this.slaStats.map((s) => {
      const total = s.withinSLA + s.beyondSLA;
      return total > 0 ? Number(((s.withinSLA / total) * 100).toFixed(2)) : 0;
    });

    const beyondSlaData = this.slaStats.map((s) => {
      const total = s.withinSLA + s.beyondSLA;
      return total > 0 ? Number(((s.beyondSLA / total) * 100).toFixed(2)) : 0;
    });

    this.slaChart = new Chart('slaChart', {
      type: 'bar',
      data: {
        labels: priorities,
        datasets: [
          {
            label: 'Resolved Within SLA',
            data: withinSlaData,
            backgroundColor: '#1E4D2B', // Green
            borderRadius: 0,
          },
          {
            label: 'Resolved Beyond SLA',
            data: beyondSlaData,
            backgroundColor: '#751011', // Marron
            borderRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true },
          },
          title: {
            display: true,
            text: 'SLA Compliance by Priority Level',
            font: { size: 16, weight: 'bold' },
          },
          datalabels: {
            color: '#ffffff',
            font: {  size: 11 },
            formatter: (value: number) => `${value}%`,
          },
          // Tooltip configuration to display actual total count instead of percentage
          tooltip: {
            callbacks: {
              label: (context) => {
                const stat = this.slaStats[context.dataIndex];
                const count =
                  context.datasetIndex === 0 ? stat.withinSLA : stat.beyondSLA;
                return `${context.dataset.label}: ${count}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value: string | number) => `${value}%`,
            },
          },
        },
      },
    });
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    if (this.agentChart) {
      this.agentChart.destroy();
      this.agentChart = undefined;
    }
    if (this.feedbackChart) {
      this.feedbackChart.destroy();
      this.feedbackChart = undefined;
    }
    if (this.slaChart) {
      this.slaChart.destroy();
      this.slaChart = undefined;
    }
  }

  /* =========================
     EXPORT EXCEL
  ========================= */
  exportToExcel(): void {
    if (this.selectedStatType === 'ticket') {
      const exportData = this.allData
        .filter((d) => d.year === this.selectedYear)
        .map((d) => ({
          Year: d.year,
          Month: this.months[d.month - 1],
          Day: d.day,
          Created: d.created,
          Closed: d.closed,
          'Reopened (Total Events)': d.reopened,
          Assigned: d.assigned,
          Overdue: d.overdue,
        }));

      if (!exportData.length) return;
      this.saveExcelBlob(
        exportData,
        'Ticket Stats',
        `Ticket_Stats_${this.selectedYear}.xlsx`,
      );
    } else if (this.selectedStatType === 'zoom') {
      const exportData = this.zoomData
        .filter((d) => d.year === this.selectedYear)
        .map((d) => ({
          Year: d.year,
          Month: this.months[d.month - 1],
          Day: d.day,
          Created: d.total,
          Pending: d.pending,
          Approved: d.approved,
          Rejected: d.rejected,
        }));

      if (!exportData.length) return;
      this.saveExcelBlob(
        exportData,
        'Zoom Stats',
        `Zoom_Stats_${this.selectedYear}.xlsx`,
      );
    } else if (this.selectedStatType === 'feedback') {
      if (!this.feedbackStats.length) return;
      const exportData = this.feedbackStats.map((stat) => ({
        Year: stat.Year,
        Month: this.months[stat.Month - 1] || stat.Month,
        'Support Agent': stat.SupportAgent,
        'Total Feedbacks': stat.TotalFeedbacks,
        'Avg Rating': stat.AvgRating,
        'Avg Response Time': stat.AvgResponseTime,
        'Avg Technical Knowledge': stat.AvgTechnicalKnowledge,
        'Avg Professionalism': stat.AvgProfessionalism,
        'Avg Communication': stat.AvgCommunication,
        'Avg Resolution': stat.AvgResolution,
        'Comments / Feedback': stat.FeedbackText || 'No comments', // <--- Added to Excel Export
      }));
      this.saveExcelBlob(
        exportData,
        'Feedback Stats',
        `Feedback_Stats_${this.selectedYear}.xlsx`,
      );
    } else if (this.selectedStatType === 'sla') {
      if (!this.slaStats.length) return;
      const exportData = this.slaStats.map((stat) => ({
        Priority: stat.priority,
        'Total Resolved': stat.totalResolved,
        'Within SLA': stat.withinSLA,
        'Beyond SLA': stat.beyondSLA,
        'SLA Compliance (%)': `${stat.slaPercentage}%`,
      }));
      this.saveExcelBlob(
        exportData,
        'SLA Compliance Stats',
        `SLA_Compliance_Stats_${this.selectedYear}.xlsx`,
      );
    }
  }

  private saveExcelBlob(
    data: any[],
    sheetName: string,
    fileName: string,
  ): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName);
  }
  /* =========================
   MODAL STATE & METHODS
========================= */
  isCommentModalOpen = false;
  selectedCommentAgent = '';
  selectedComments: string[] = [];

  openCommentModal(stat: FeedbackStat): void {
    this.selectedCommentAgent = stat.SupportAgent || 'Unassigned';
    // Split the GROUP_CONCAT pipe-separated comments into an array
    if (stat.FeedbackText) {
      this.selectedComments = stat.FeedbackText.split(' | ').filter(
        (c) => c.trim() !== '',
      );
    } else {
      this.selectedComments = [];
    }
    this.isCommentModalOpen = true;
  }

  closeCommentModal(): void {
    this.isCommentModalOpen = false;
    this.selectedComments = [];
    this.selectedCommentAgent = '';
  }




resetFilters(): void {
  this.fromDate = '';
  this.toDate = '';
  this.activePreset = '';
  this.selectedYear = new Date().getFullYear();
  this.loadData();
}
// <--- 2. Add setPreset and formatDateToString methods here
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
  
}
