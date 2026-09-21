import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './components/spmo_components/spmo-login/admin-login.component';
import { SpmoDashboardComponent } from './components/spmo_components/spmo-dashboard/spmo-dashboard.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AddEditRegComponent } from './components/ito_components/ito-admin-register/add-edit-reg/add-edit-reg.component';
import { ItoAdminRegisterComponent } from './components/ito_components/ito-admin-register/ito-admin-register.component';
import { ShowRegComponent } from './components/ito_components/ito-admin-register/show-reg/show-reg.component';

import { SpmoSidenavComponent } from './components/spmo_components/spmo-sidenav/spmo-sidenav.component';

import { UserHeaderComponent } from './components/users_components/user-header/user-header.component';
import { UserMainComponent } from './components/users_components/user-main/user-main.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { UserCreateTicketsComponent } from './components/users_components/user-create-tickets/user-create-tickets.component';
import { CreateTicketComponent } from './components/users_components/user-create-tickets/create-ticket/create-ticket.component';
import { ViewTicketComponent } from './components/users_components/user-create-tickets/view-ticket/view-ticket.component';
import { UserAssetsViewComponent } from './components/users_components/user-assets-view/user-assets-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppInitService } from '../services/app-init.service';
import { AuthInterceptor } from './guards/auth.interceptor';

import { ChatComponent } from './components/users_components/chat/chat.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { UserZoomScheduleComponent } from './components/users_components/zoom-schedule/user-zoom-schedule.component';
import { CreateZoomschedComponent } from './components/users_components/zoom-schedule/create-zoomsched/create-zoomsched.component';
import { ViewZoomschedComponent } from './components/users_components/zoom-schedule/view-zoomsched/view-zoomsched.component';
import { ItoAdminSidenavComponent } from './components/ito_components/ito-admin-sidenav/ito-admin-sidenav.component';
import { ItoAdminDashboardComponent } from './components/ito_components/ito-admin-dashboard/ito-admin-dashboard.component';
import { ItoAdminZoomrequestComponent } from './components/ito_components/ito-admin-zoomrequest/ito-admin-zoomrequest.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewTicketDetailsDialogComponent } from './components/users_components/user-create-tickets/view-ticket/view-ticket-details-dialog/view-ticket-details-dialog.component';
import { UserFeedbackformComponent } from './components/users_components/user-feedbackform/user-feedbackform.component';
import { AiAssistantComponent } from './components/users_components/ai-assistant/ai-assistant.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ItoAdminSettingsComponent } from './components/ito_components/ito-admin-settings/ito-admin-settings.component';
import { JsonParsePipe } from './pipes/json-parse.pipe';
import { ItoAdminExtraFieldsComponent } from './components/ito_components/ito-admin-settings/ito-admin-extra-fields/ito-admin-extra-fields.component';
import { MatSelectModule } from '@angular/material/select';
import { ItoAssetsComponent } from './components/agents_components/ito-assets/ito-assets.component';
import { ItoDashboardComponent } from './components/agents_components/ito-dashboard/ito-dashboard.component';
import { ItoHeadersComponent } from './components/agents_components/ito-headers/ito-headers.component';
import { ItoTicketsComponent } from './components/agents_components/ito-tickets/ito-tickets.component';
import { TicketDetailsDialogComponent } from './components/agents_components/ito-tickets/ticket-details-dialog/ticket-details-dialog.component';
import { AgentZoomViewComponent } from './components/agents_components/ito-zoom-view/ito-zoom-view.component';
import { AddEditAssetsComponent } from './components/spmo_components/spmo-assets/spmo-add-edit-assets/spmo-add-edit-assets.component';
import { SpmoAssetsComponent } from './components/spmo_components/spmo-assets/spmo-assets.component';
import { SpmoShowAssetsComponent } from './components/spmo_components/spmo-assets/spmo-show-assets/spmo-show-assets.component';
import { AdmWasteComponent } from './components/spmo_components/spmo-waste/adm-waste.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { PagesRegisterComponent } from './components/pages/pages-register/pages-register.component';
import { ItoAdminTicketsComponent } from './components/ito_components/ito-admin-tickets/ito-admin-tickets.component';
import { ItoWifiSupportComponent } from './components/agents_components/ito-wifi-support/ito-wifi-support.component';
import { ItoAdminTicketAnalyzerComponent } from './components/ito_components/ito-admin-ticket-analyzer/ito-admin-ticket-analyzer.component';

export function initializeApp(
  appInitService: AppInitService,
): () => Promise<void> {
  return () => appInitService.loadConfig();
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserMainComponent,
    SpmoSidenavComponent,
    SpmoDashboardComponent,
    UserHeaderComponent,
    ItoAdminRegisterComponent,
    AdminLoginComponent,
    ShowRegComponent,
    AddEditRegComponent,
    SpmoAssetsComponent,
    SpmoShowAssetsComponent,
    AddEditAssetsComponent,
    UserCreateTicketsComponent,
    CreateTicketComponent,
    ViewTicketComponent,
    UserAssetsViewComponent,
    ItoHeadersComponent,
    ItoAssetsComponent,
    ItoTicketsComponent,
    ItoDashboardComponent,
    ChatComponent,
    UserFeedbackformComponent,
    AdmWasteComponent,
    UserZoomScheduleComponent,
    CreateZoomschedComponent,
    ViewZoomschedComponent,
    ItoAdminSidenavComponent,
    ItoAdminDashboardComponent,
    ItoAdminZoomrequestComponent,
    TicketDetailsDialogComponent,
    ViewTicketDetailsDialogComponent,
    AgentZoomViewComponent,
    AiAssistantComponent,
    ItoAdminSettingsComponent,
    ItoAdminExtraFieldsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PagesRegisterComponent,
    ItoAdminTicketsComponent,
    ItoWifiSupportComponent,
    ItoAdminTicketAnalyzerComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Auth
    OAuthModule.forRoot(),
    HttpClientModule,
    //Material
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      extendedTimeOut: 1000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-center',
    }),
    JsonParsePipe,
    MatOption,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
