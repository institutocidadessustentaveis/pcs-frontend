import { HistoricoCertificadoComponent } from './../historico-certificado/historico-certificado.component';
import { RoleGuard } from './../../../guards/role.guard';
import { AuthGuard } from './../../../guards/auth.guard';
import { EmissorCertificadosComponent } from './emissor-certificados.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        component: EmissorCertificadosComponent,
        canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EMITIR_CERTIFICADOS'}
    },
    {
        path: 'historico-certificado',
        component: HistoricoCertificadoComponent,
        canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_HISTORICO_CERTIFICADOS', title: 'Histórico de Certificados'}
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmissorCertificadosRoutingModule { }