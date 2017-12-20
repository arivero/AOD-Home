import { Component, OnInit } from '@angular/core';
import { SelectItem, MessagesModule, GrowlModule, Message } from 'primeng/primeng';
import { LogstashService } from '../../../services/admin/logstash.service';
import { Logstash } from '../../../models/Logstash';

@Component({
  selector: 'app-logstash',
  templateUrl: './logstash.component.html',
  styleUrls: ['./logstash.component.css']
})

export class LogstashComponent implements OnInit {

  logstash: Logstash;
  logstashs: Logstash[];

  userAdminMessages: Message[] = [];
  displayDeleteDialog: boolean = false;
  displayEditDialog: boolean = false;
  editing: boolean = false;
  editDialogTitle: string;

  constructor(private logstashService: LogstashService) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.logstashs = [];
    this.logstashService.getFiles().subscribe(logstashs => {
      try {
        this.logstashs = JSON.parse(logstashs);

      } catch (error) {
        console.error('Error: getFiles() - logstash.component.ts');
      }
    });
  }

  showDialog(logstash, edit, create) {
    if (edit) {
      this.editDialogTitle = 'Modificar Portal';
      this.logstash = this.cloneUser(logstash);
      console.log(this.logstash);
      this.displayEditDialog = true;
      this.editing = true;
    } else if (create) {
      this.editDialogTitle = 'Crear Portal';
      this.logstash = new Logstash();
      this.displayEditDialog = true;
      this.editing = false;
    }
  }

  showDeleteDialog(logstash) {
    this.logstash = logstash;
    console.log("show");
    this.displayDeleteDialog = true;
  }

  cloneUser(logstashToClone: Logstash): Logstash {
    let logstashCloned = new Logstash();
    for (let logstashProperty in logstashToClone) {
      logstashCloned[logstashProperty] = logstashToClone[logstashProperty];
    }
    return logstashCloned;
  }

  saveLogstash() {
    if (this.valitadeLogstashForm()) {
      this.logstashService.saveLogstash(this.logstash).subscribe(result => {
        if (result.status == 200 && result.success) {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'success', summary: 'Alta de Logstash', detail: 'Registro creado correctamente' });
          this.displayEditDialog = false;
          this.getFiles();
        } else {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'error', summary: 'Alta de Logstash', detail: 'Fallo al crear el registro' });
          this.displayEditDialog = false;          
        }
      });
    } else {
      this.userAdminMessages = [];
      this.userAdminMessages.push({ severity: 'warn', summary: 'Alta de Logstash', detail: 'Faltan campos por rellenar del formulario' });

    }
  }

  updateLogstash() {
    if (this.valitadeLogstashForm()) {
      this.logstashService.updateLogstash(this.logstash).subscribe(result => {
        if (result.status == 200 && result.success) {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'success', summary: 'Modificación de Logstash', detail: 'Registro modificado correctamente' });
          this.displayEditDialog = false;
          this.getFiles();
        } else {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'error', summary: 'Modificación de Logstash', detail: 'Fallo al modificar el registro' });
          this.displayEditDialog = false;          
        }
      });
    } else {
      this.userAdminMessages = [];
      this.userAdminMessages.push({ severity: 'warn', summary: 'Modificación de Logstash', detail: 'Faltan campos por rellenar del formulario' });

    }
  }

  undoDeleteLogstash() {
		this.displayDeleteDialog = false;
		this.logstash = new Logstash;
	}

  deleteLogstash() {
      this.logstashService.deleteLogstash(this.logstash).subscribe(result => {
        if (result.status == 200 && result.success) {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'success', summary: 'Eliminación de Logstash', detail: 'Registro eliminado correctamente' });
          this.displayDeleteDialog = false;
          this.getFiles();
        } else {
          this.userAdminMessages = [];
          this.userAdminMessages.push({ severity: 'error', summary: 'Eliminación de Logstash', detail: 'Fallo al eliminar el registro' });
          this.displayDeleteDialog = false;          
        }
      });
  }

  reloadLogstash() {
    this.logstashService.reloadLogstash().subscribe(result => {
      if (result.status == 200 && result.success) {
        this.userAdminMessages = [];
        this.userAdminMessages.push({ severity: 'success', summary: 'Recarga de Logstash', detail: 'Recarga Iniciada' });
        this.getFiles();
      } else {
        this.userAdminMessages = [];
        this.userAdminMessages.push({ severity: 'error', summary: 'Recarga de Logstash', detail: 'Fallo al recargar' });
      }
    });
}

  valitadeLogstashForm() {
    if (this.logstash.delay != undefined && this.logstash.delay != ''
      && this.logstash.portal_name != undefined && this.logstash.portal_name != ''
      && this.logstash.type != undefined && this.logstash.type != ''
      && this.logstash.url != undefined && this.logstash.url != ''
      && this.logstash.view != undefined && this.logstash.view != '') {
      this.userAdminMessages = [];
      return true;
    }
  }
}