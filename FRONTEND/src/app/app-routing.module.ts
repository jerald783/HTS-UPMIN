import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { UserMainComponent } from './components/users_components/user-main/user-main.component';
import { SpmoSidenavComponent } from './components/spmo_components/spmo-sidenav/spmo-sidenav.component';
import { SpmoDashboardComponent } from './components/spmo_components/spmo-dashboard/spmo-dashboard.component';
import { SpmoAssetsComponent } from './components/spmo_components/spmo-assets/spmo-assets.component';
import { ViewTicketComponent } from './components/users_components/user-create-tickets/view-ticket/view-ticket.component';
import { CreateTicketComponent } from './components/users_components/user-create-tickets/create-ticket/create-ticket.component';
import { UserAssetsViewComponent } from './components/users_components/user-assets-view/user-assets-view.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guards';
import { ItoDashboardComponent } from './components/agents_components/ito-dashboard/ito-dashboard.component';
import { ItoAssetsComponent } from './components/agents_components/ito-assets/ito-assets.component';
import { ItoTicketsComponent } from './components/agents_components/ito-tickets/ito-tickets.component';
import { ChatComponent } from './components/users_components/chat/chat.component';
import { UserFeedbackformComponent } from './components/users_components/user-feedbackform/user-feedbackform.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AdmWasteComponent } from './components/spmo_components/spmo-waste/adm-waste.component';
import { UserZoomScheduleComponent } from './components/users_components/zoom-schedule/user-zoom-schedule.component';
import { CreateZoomschedComponent } from './components/users_components/zoom-schedule/create-zoomsched/create-zoomsched.component';
import { ViewZoomschedComponent } from './components/users_components/zoom-schedule/view-zoomsched/view-zoomsched.component';
import { ItoAdminSidenavComponent } from './components/ito_components/ito-admin-sidenav/ito-admin-sidenav.component';
import { ItoAdminDashboardComponent } from './components/ito_components/ito-admin-dashboard/ito-admin-dashboard.component';
import { ItoAdminZoomrequestComponent } from './components/ito_components/ito-admin-zoomrequest/ito-admin-zoomrequest.component';
import { AgentZoomViewComponent } from './components/agents_components/ito-zoom-view/ito-zoom-view.component';
import { AiAssistantComponent } from './components/users_components/ai-assistant/ai-assistant.component';
import { ItoAdminSettingsComponent } from './components/ito_components/ito-admin-settings/ito-admin-settings.component';
import { ItoAdminExtraFieldsComponent } from './components/ito_components/ito-admin-settings/ito-admin-extra-fields/ito-admin-extra-fields.component';

import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { ShowRegComponent } from './components/ito_components/ito-admin-register/show-reg/show-reg.component';
import { PagesRegisterComponent } from './components/pages/pages-register/pages-register.component';
import { ItoAdminTicketsComponent } from './components/ito_components/ito-admin-tickets/ito-admin-tickets.component';
import { ItoWifiSupportComponent } from './components/agents_components/ito-wifi-support/ito-wifi-support.component';
import { ItoAdminTicketAnalyzerComponent } from './components/ito_components/ito-admin-ticket-analyzer/ito-admin-ticket-analyzer.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'pages-register', component: PagesRegisterComponent },
  // { path: 'spmo', component: AdminLoginComponent },

  //Customer routes
  {
    path: 'main',
    data: { expectedRole: ['COS', 'Regular','Student'] },
    component: UserMainComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'crtticket',
    data: { expectedRole: ['COS', 'Regular','Student'] },
    component: CreateTicketComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'zoomSchedule',
    data: { expectedRole: ['COS', 'Regular'] },
    component: ViewZoomschedComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'UserAsset',
    data: { expectedRole: ['COS', 'Regular'] },
    component: UserAssetsViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ai-assistant',
    data: { expectedRole: ['COS', 'Regular','Student'] },
    component: AiAssistantComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'viewticket',
    data: { expectedRole: ['COS', 'Regular','Student'] },
    component: ViewTicketComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'feedback',
    data: { expectedRole: ['COS', 'Regular','Student'] },
    component: UserFeedbackformComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  //Agent routes
  {
    path: 'ito',
    data: { expectedRole: 'Agent' },
    component: ItoDashboardComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'agent-zoomview',
    data: { expectedRole: 'Agent' },
    component: AgentZoomViewComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'ticketview',
    data: { expectedRole: 'Agent' },
    component: ItoTicketsComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'itoasset',
    data: { expectedRole: 'Agent' },
    component: ItoAssetsComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'itowifireq',
    data: { expectedRole: 'Agent' },
    component: ItoWifiSupportComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
  {
    path: 'chat-room/:ticketId',
     data: { expectedRole: ['COS', 'Regular','Agent'] },
    component: ChatComponent,
    canActivate: [AuthGuard,RoleGuard],
  },

  //Admin routes
  {
   path: 'adminito',
  component: ItoAdminSidenavComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { expectedRole: 'Admin' },
    children: [
      { path: '', component: ItoAdminSidenavComponent },
      {
        path: 'itoadmindashboard',
        component: ItoAdminDashboardComponent,
        outlet: 'secondary',
      },
      {
        path: 'iazoomrequest',
        component: ItoAdminZoomrequestComponent,
        outlet: 'secondary',
      },
      {
        path: 'iasettings',
        component: ItoAdminSettingsComponent,
        outlet: 'secondary',
      },
      // { path: 'register', component: ShowRegComponent, outlet: 'secondary' },
      {
        path: 'ia-tickets',
        component: ItoAdminTicketsComponent,
        outlet: 'secondary',
      },
      // {path: 'ia-extra-fields', component: ItoAdminExtraFieldsComponent, outlet: 'secondary' },

      {
        path: 'admin-register',
        component: ShowRegComponent,
        outlet: 'secondary',
      },
      {path:'analyse',
        component: ItoAdminTicketAnalyzerComponent,
       outlet: 'secondary' },
    ],
  },

  //spmo routes
  {
    path: 'adminspmo',
    component: SpmoSidenavComponent,
    canActivate: [RoleGuard,AuthGuard],
    data: { expectedRole: 'SPMO' },
    children: [
      { path: '', component: SpmoSidenavComponent },

      {
        path: 'spmoassets',
        component: SpmoAssetsComponent,
        outlet: 'secondary',
      },
    ],
  },
  // {
  //   path: 'spmo',
  //   canActivate: [RoleGuard],
  //   data: { expectedRole: 'Admin' },
  //   component: SidenavComponent,
  //   children: [
  //     { path: '', component: SidenavComponent },
  //     { path: 'dashboard', component: DashboardComponent, outlet: 'secondary' },
  //     { path: 'Assets', component: AdmAssetsComponent, outlet: 'secondary' },
  //     { path: 'waste', component: AdmWasteComponent, outlet: 'secondary' },
  //     {
  //       path: 'admin-register',
  //       component: ShowRegComponent,
  //       outlet: 'secondary',
  //     },
  //   ],
  // },

  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
