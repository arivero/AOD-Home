import { OrganizationsService } from './../../../../services/web/organizations.service';
import { Organization } from './../../../../models/Organization';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, DropdownModule } from 'primeng/primeng';
import { DatasetsService } from '../../../../services/web/datasets.service';
import { TopicsService } from '../../../../services/web/topics.service';
import { TopicsListComponent } from '../../topics/topics-list/topics-list.component';
import { Dataset } from '../../../../models/Dataset';
import { DatasetHomer } from '../../../../models/DatasetHomer';
import { Topic } from '../../../../models/Topic';
import { Constants } from '../../../../app.constants';

@Component({
    selector: 'app-datasets-list',
    templateUrl: './datasets-list.component.html',
    styleUrls: ['./datasets-list.component.css']
})

export class DatasetsListComponent implements OnInit {

    selectedTopic: string;
    selectedOrg: string;
    selectedType: string;
    selectedGroup: string;
    selectedLang: string;
    selectedSearchOption: string;
    sort: string;
    sortHomer: string;
    datasets: Dataset[];
    datasetsHomer: DatasetHomer[];
    newestDatasets: Dataset[];
    downloadedDatasets: Dataset[];
    dataset: Dataset;
    numDatasets: number;
    numDatasetsHomer: number;
    pageRows: number;
    totalDataset: string[];
    datasetCount: SelectItem[];
    resourceCount: SelectItem[];
    searchValue: string = '';
    textSearch: string;
    textSearchHomer: string;
    searchHomerValue: string = '';
    tags: string[];
    filteredTagsMultiple: any[];

    @Input() topics: Topic[];
    topic: Topic;
    topicsSelect: SelectItem[];
    orgs: Organization[];
    orgsSelect: SelectItem[];
    datasetTypes: SelectItem[];
    searchOptions: SelectItem[];
    langsSelect: SelectItem[];
    groupSelect: SelectItem[];
    emptyMessage: string;

    datasetSearchOptionFreeSearch: string;
    datasetSearchOptionTopics: string;
    datasetSearchOptionOrganizations: string;
    datasetSearchOptionTags: string;
    datasetSearchOptionStats: string;
    datasetSearchOptionHomer: string;
    //Dynamic URL build parameters
	routerLinkPageNotFound: string;
    routerLinkDataCatalog: string;
    routerLinkDataCatalogDataset: string;
    routerLinkDataCatalogTopics: string;
    routerLinkDataCatalogOrganizations: string;
    routerLinkDataCatalogTags: string;
    routerLinkDataCatalogDatasetHomer: string;
    //Pagination Params
    pages: number [];
    actualPage:number;
    pagesShow: string[];
    pageFirst: number;
    pageLast: number;
    //Error Params
    errorTitle: string;
    errorMessage: string;

    constructor(private datasetsService: DatasetsService, private topicsService: TopicsService
        , private orgsService: OrganizationsService, private router: Router
        , private location: Location, private changeDetectorRef: ChangeDetectorRef
        , private activatedRoute: ActivatedRoute) {
    this.pageRows = Constants.DATASET_LIST_ROWS_PER_PAGE;
    this.routerLinkDataCatalog = Constants.ROUTER_LINK_DATA_CATALOG;
    this.routerLinkDataCatalogDataset = Constants.ROUTER_LINK_DATA_CATALOG_DATASET;
    this.routerLinkDataCatalogTopics = Constants.ROUTER_LINK_DATA_CATALOG_TOPICS;
    this.routerLinkDataCatalogOrganizations = Constants.ROUTER_LINK_DATA_CATALOG_ORGANIZATIONS;
    this.routerLinkDataCatalogTags = Constants.ROUTER_LINK_DATA_CATALOG_TAGS;
    this.datasetSearchOptionFreeSearch = Constants.DATASET_LIST_SEARCH_OPTION_FREE_SEARCH;
    this.datasetSearchOptionTopics = Constants.DATASET_LIST_SEARCH_OPTION_TOPICS;
    this.datasetSearchOptionOrganizations = Constants.DATASET_LIST_SEARCH_OPTION_ORGANIZATIONS;
    this.datasetSearchOptionTags = Constants.DATASET_LIST_SEARCH_OPTION_TAGS;
    this.datasetSearchOptionStats = Constants.DATASET_LIST_SEARCH_OPTION_STATS;
    this.datasetSearchOptionHomer = Constants.DATASET_LIST_SEARCH_OPTION_HOMER;
    this.routerLinkDataCatalogDatasetHomer = Constants.ROUTER_LINK_DATA_CATALOG_HOMER_DATASET;
    this.emptyMessage = Constants.DATASET_LIST_EMPTY;
    if (this.selectedSearchOption === undefined) {
        this.selectedSearchOption = this.datasetSearchOptionFreeSearch;
    } 
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            try {
                this.textSearch = params[Constants.ROUTER_LINK_DATA_PARAM_TEXT];
                this.selectedType = params[Constants.ROUTER_LINK_DATA_PARAM_TYPE];
                if (params[Constants.ROUTER_LINK_DATA_PARAM_TAG]) {
                    let tagParams: string = '' + params[Constants.ROUTER_LINK_DATA_PARAM_TAG];
                    let tags = [] = tagParams.split(',');
                    let filtered = [];
                    for (let i = 0; i < tags.length; i++) {
                            filtered.push({ name: tags[i], value: tags[i] });
                    }
                    this.tags = filtered;
                }
                this.selectedLang = params[Constants.ROUTER_LINK_DATA_PARAM_LANG];
                this.textSearchHomer = params[Constants.ROUTER_LINK_DATA_PARAM_TEXT_HOMER];
            } catch (error) {
                console.error("Error: ngOnInit() queryParams - datasets-list.component.ts");
            }
        });

        this.activatedRoute.params.subscribe(params => {
            try {
                this.selectedTopic = params[Constants.ROUTER_LINK_DATA_PARAM_TOPIC_NAME];
                this.selectedOrg = params[Constants.ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME];
            } catch (error) {
                console.error("Error: ngOnInit() params - datasets-list.component.ts");
            }
         });
        
        this.sort = Constants.SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE;
        this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_DEFAULT_VALUE;
        this.setDatasetsStats();
        this.setTopicsDropdown();
        this.setOrgsDropdown();
        this.loadDatasets();
        this.setDatasetsTypeDropdown();
        this.setSearchOptions();
        this.setLanguagesDropdown();
        this.setGroupsDropdown();
        this.setInfoTables();
        
    }

    loadDatasets() {
        this.datasets = [];
        if (this.textSearch != undefined) {
            this.searchDatasetsByText(this.textSearch);
            this.searchValue = this.textSearch;
        } else if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionTopics;
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionOrganizations;
        } else if(this.tags){
            this.getDatasetsByTags(null,null);
            this.selectedSearchOption = this.datasetSearchOptionTags;
        } else if(this.selectedSearchOption == this.datasetSearchOptionHomer){
            this.getDatasetsByHomer(null,null);
        } else if(this.textSearchHomer){
            this.selectedSearchOption = this.datasetSearchOptionHomer;
            this.searchHomerValue = this.textSearchHomer;
            this.getDatasetsByHomer(null,null);
        } else {
            this.getDatasets(null, null);
        }
    }

    setPagination(actual: number, total: number){
        this.actualPage = actual;
        this.pageFirst = 0;
        this.pageLast = Math.ceil(+total/+this.pageRows);        
        this.pages = [];
        this.pagesShow = [];
        if(this.pageLast == 0){
            this.pagesShow.push('-');   
        }
        for (var index = 0; index < this.pageLast; index++) {
            this.pages.push(+index+1);   
        }
        if (this.actualPage<4) {
            for (var index = 0; index < 5; index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        } else if (this.actualPage >= (135)) {
            for (var index = (+this.pageLast-5); index < this.pageLast; index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        } else{
            for (var index = (+actual-2); index <= (+this.actualPage+2); index++) {
                if(this.pages[index]){
                    this.pagesShow.push(String (+this.pages[index]));
                }
            }
        }
    }

    paginate(page:number) {
        --page;
        if (this.textSearch != undefined) {
            this.searchDatasetsByText(this.textSearch);
            this.searchValue = this.textSearch;
        } else if (this.selectedTopic) {
            this.getDatasetsByTopic(this.selectedTopic, page, this.pageRows, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionTopics;
        } else if (this.selectedOrg) {
            this.getDatasetsByOrg(page, this.pageRows, this.selectedOrg, this.selectedType);
            this.selectedSearchOption = this.datasetSearchOptionOrganizations;
        } else if(this.tags){
            this.getDatasetsByTags(page, this.pageRows);
            this.selectedSearchOption = this.datasetSearchOptionTags;
        }else if(this.selectedSearchOption == this.datasetSearchOptionHomer){
            this.getDatasetsByHomer(page, this.pageRows);
        } else if(this.textSearchHomer){
            this.selectedSearchOption = this.datasetSearchOptionHomer;
            this.searchHomerValue = this.textSearchHomer;
            this.getDatasetsByHomer(page, this.pageRows);
        } else {
            this.getDatasets(page, this.pageRows);
        }
        document.body.scrollTop = 0;
    }

    changeType() {
        if (this.selectedTopic) {
            if (this.selectedType) {
                this.router.navigate(['/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic], { queryParams: { tipo: this.selectedType } });
                this.getDatasetsByTopic(this.selectedTopic, null, null, this.selectedType);
            } else {
                this.router.navigate(['/' + this.routerLinkDataCatalogTopics + '/' + this.selectedTopic]);
                this.getDatasetsByTopic(this.selectedTopic, null, null, null);
            }
        } else if (this.selectedOrg) {
            if (this.selectedType) {
                this.router.navigate(['/' + this.routerLinkDataCatalogOrganizations + '/' + this.selectedOrg], { queryParams: { tipo: this.selectedType } });
                this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
            } else {
                this.router.navigate(['/' + this.routerLinkDataCatalogOrganizations + '/' + this.selectedOrg]);
                this.getDatasetsByOrg(null, null, this.selectedOrg, null);
            }
        } else {
            if (this.selectedType) {
                this.location.go('/' + this.routerLinkDataCatalog 
                + '?' + Constants.ROUTER_LINK_DATA_PARAM_TYPE + '=' + this.selectedType);
            } else {
                this.location.go('/' + this.routerLinkDataCatalog);
            }
            this.getDatasets(null, null);
        }
    }

    changeTags() {
        if (this.tags.length > 0) {
        let tagsList = [];
        let tagUrl = '';
        tagsList = this.tags;
        let i = 0;
        tagsList.forEach(tag => {
            if (i == 0) {
                tagUrl += '?' + Constants.ROUTER_LINK_DATA_PARAM_TAG + '=' + tag.name;
            } else {
                tagUrl += '&' + Constants.ROUTER_LINK_DATA_PARAM_TAG + '=' + tag.name;
            }
            i++;
        });
        this.location.go('/' + this.routerLinkDataCatalogTags + tagUrl);
        this.getDatasetsByTags(null, null);
       } else {
        this.location.go('/' + this.routerLinkDataCatalog);
        this.getDatasets(null, null);
       }
        
    }

    resetSearch() {
        this.selectedTopic = undefined;
        this.selectedOrg = undefined;
        this.selectedType = undefined;
        this.searchValue = '';
        this.tags = undefined;
        this.textSearch = undefined;
        this.loadDatasets();
        this.location.go('/' + this.routerLinkDataCatalog);
    }

    showDataset(dataset: Dataset) {
        this.datasetsService.setDataset(dataset);
    }

    showDatasetHomer(datasetHomer: DatasetHomer) {
        this.datasetsService.setDatasetHomer(datasetHomer);
    }

    addDataset() {
        this.dataset = new Dataset();
        this.datasetsService.setDataset(this.dataset);
    }

    setOrder(event) {
        event.page = 0;
        switch (event.field) {
            case Constants.DATASET_LIST_SORT_COLUMN_NAME:
            this.sort == Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING 
                ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING 
                : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_TITLE_STRING;
            break;
        case Constants.DATASET_LIST_SORT_COLUMN_ACCESS:
            this.sort == Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL 
                ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL 
                : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL;
            break;
        case Constants.DATASET_LIST_SORT_COLUMN_LAST_UPDATE:
            this.sort == Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED 
                ? this.sort = '-' + Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED 
                : this.sort = Constants.SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED;
                break;
        }
        this.loadDatasets();
        this.changeDetectorRef.detectChanges();
    }

    setOrderHomer(event) {
        event.page = 0;
        switch (event.field) {
            case Constants.DATASET_LIST_HOMER_SORT_COLUMN_NAME:
            this.sortHomer == Constants.SERVER_API_LINK_PARAM_SORT_HOMER_NAME 
                ? this.sortHomer = '-' + Constants.SERVER_API_LINK_PARAM_SORT_HOMER_NAME 
                : this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_NAME;
            break;
        case Constants.DATASET_LIST_HOMER_SORT_COLUMN_PORTAL:
            this.sortHomer == Constants.SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL 
                ? this.sortHomer = '-' + Constants.SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL 
                : this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL;
            break;
            case Constants.DATASET_LIST_HOMER_SORT_COLUMN_LANGUAGE:
            this.sortHomer == Constants.SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE 
                ? this.sortHomer = '-' + Constants.SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE 
                : this.sortHomer = Constants.SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE;
                break;
        }
        this.loadDatasets();
        this.changeDetectorRef.detectChanges();
    }

    getDatasets(page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasets(this.sort, pageNumber, rowsNumber, this.selectedType).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasets() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    getDatasetsByTopic(topic: string, page: number, rows: number, type: string): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByTopic(topic, this.sort, pageNumber, rowsNumber, type).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsBySearch() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    getDatasetsBySearch(page: number, rows: number, searchParam: string): void {
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByText(this.sort, pageNumber, rowsNumber, searchParam).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsBySearch() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    getDatasetsByOrg(page: number, rows: number, org: string, type: string): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsByOrganization(org, this.sort, pageNumber, rowsNumber, type).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsByOrg() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    getDatasetsByTags(page: number, rows: number): void {
        this.datasets = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsBytags(this.sort, pageNumber, rowsNumber, this.tags).subscribe(datasets => {
            try {
                this.datasets = JSON.parse(datasets).result.results;
                this.numDatasets = JSON.parse(datasets).result.count;
                this.setPagination(pageNumber,this.numDatasets);
            } catch (error) {
                console.error("Error: getDatasetsByTags() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
        
    }

    getDatasetsByHomer(page: number, rows: number): void {
        this.datasetsHomer = [];
        var pageNumber = (page != null ? page : 0);
        var rowsNumber = (rows != null ? rows : this.pageRows);
        this.datasetsService.getDatasetsHomer(this.sortHomer, pageNumber, rowsNumber, this.searchHomerValue, this.selectedLang).subscribe(datasetsHomer => {
            try {
                this.datasetsHomer = JSON.parse(datasetsHomer).response.docs;
                this.numDatasetsHomer = JSON.parse(datasetsHomer).response.numFound;
                this.setPagination(pageNumber, this.numDatasetsHomer);
            } catch (error) {
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    setTopicsDropdown() {
        this.getSelectedTopic();
        this.topicsSelect = [];
        this.topicsSelect.push({ label: 'Todos los temas', value: undefined });
        this.topicsService.getTopics().subscribe(topics => {
            try {
                this.topics = JSON.parse(topics).result;
                for (let top of this.topics) {
                    this.topicsSelect.push({ label: top.title, value: top.name });
                } 
            } catch (error) {
                console.error("Error: setTopicsDropdown() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error en la carga de Datsets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }
    setOrgsDropdown() {
        this.orgsSelect = [];
        this.orgsSelect.push({ label: 'Todas las organizaciones', value: undefined });
        this.orgsService.getOrganizations().subscribe(orgs => {
            try {
                this.orgs = JSON.parse(orgs).result;
                for (let org of this.orgs) {
                    this.orgsSelect.push({ label: org.title, value: org.name });
                }
            } catch (error) {
                console.error("Error: setOrgsDropdown() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al cargar la lista, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    getSelectedTopic() {
        if (this.topicsService.getTopic() === undefined) {
        } else {
            this.selectedTopic = this.topicsService.getTopic().name;
        }
    }

    setDatasetsTypeDropdown() {
        this.datasetTypes = [];
        this.datasetTypes.push({ label: 'Todos los tipos', value: undefined });
        this.datasetTypes.push({ label: 'Calendario', value: 'calendario' });
        this.datasetTypes.push({ label: 'Fotos', value: 'fotos' });
        this.datasetTypes.push({ label: 'Hojas de Calculo', value: 'hojas-de-calculo' });
        this.datasetTypes.push({ label: 'Mapas', value: 'mapas' });
        this.datasetTypes.push({ label: 'Recursos Educativos', value: 'recursos-educativos' });
        this.datasetTypes.push({ label: 'Recursos Web', value: 'recursos-web' });
        this.datasetTypes.push({ label: 'RSS', value: 'rss' });
        this.datasetTypes.push({ label: 'Texto plano', value: 'texto-plano' });
    }

    setSearchOptions() {
        this.searchOptions = [];
        this.searchOptions.push({ label: 'Búsqueda libre', value: this.datasetSearchOptionFreeSearch });
        this.searchOptions.push({ label: 'Tema y tipo', value: this.datasetSearchOptionTopics });
        this.searchOptions.push({ label: 'Organización y tipo', value: this.datasetSearchOptionOrganizations });
        this.searchOptions.push({ label: 'Etiquetas', value: this.datasetSearchOptionTags });
        this.searchOptions.push({ label: 'Información estadística', value: this.datasetSearchOptionStats });
        this.searchOptions.push({ label: 'Buscador Homer', value: this.datasetSearchOptionHomer });
    }

    setLanguagesDropdown() {
        this.langsSelect = [];
        this.langsSelect.push({ label: 'Todos los idiomas', value: undefined });
        this.langsSelect.push({ label: 'Español', value: 'es' });
        this.langsSelect.push({ label: 'English', value: 'en' });
        this.langsSelect.push({ label: 'Français', value: 'fr' });
        this.langsSelect.push({ label: 'Italiano', value: 'it' });
        this.langsSelect.push({ label: 'ελληνικά', value: 'el' });
        this.langsSelect.push({ label: 'Slovenščina', value: 'sl' });
        this.langsSelect.push({ label: 'Српски', value: 'sr' });
    }

    setGroupsDropdown() {
        this.groupSelect = [];
        this.groupSelect.push({ label: 'Todos los grupos', value: undefined });
        this.groupSelect.push({ label: 'Territorio', value: 'Territorio' });
        this.groupSelect.push({ label: 'Demografía y Población', value: 'Demografía y Población' });
        this.groupSelect.push({ label: 'Educación y Formación', value: 'Educación y Formación' });
        this.groupSelect.push({ label: 'Salud', value: 'Salud' });
        this.groupSelect.push({ label: 'Nivel, Calidad y Condiciones de Vida', value: 'Nivel, Calidad y Condiciones de Vida' });
        this.groupSelect.push({ label: 'Análisis Sociales, Justicia, Cultura y Deporte', value: 'Análisis Sociales, Justicia, Cultura y Deporte' });
        this.groupSelect.push({ label: 'Trabajo, Salarios y Relaciones Laborales', value: 'Trabajo, Salarios y Relaciones Laborales' });
        this.groupSelect.push({ label: 'Agricultura, Industria y Construcción', value: 'Agricultura, Industria y Construcción' });
        this.groupSelect.push({ label: 'Servicios, Comercio, Transporte y Turismo', value: 'Servicios, Comercio, Transporte y Turismo' });
        this.groupSelect.push({ label: 'Precios', value: 'Precios' });
        this.groupSelect.push({ label: 'PIB, Renta, Comercio Exterior y Empresas', value: 'PIB, Renta, Comercio Exterior y Empresas' });
        this.groupSelect.push({ label: 'Financieras. Mercantiles. Tributarias', value: 'Financieras. Mercantiles. Tributarias' });
        this.groupSelect.push({ label: 'I+D+i y Tecnologías de la Información (TIC)', value: 'I+D+i y Tecnologías de la Información (TIC)' });
        this.groupSelect.push({ label: 'Medio Ambiente y Energía', value: 'Medio Ambiente y Energía' });
        this.groupSelect.push({ label: 'Sector Público. Elecciones', value: 'Sector Público. Elecciones' });
    }

    setInfoTables() {
        this.datasetsService.getNewestDataset().subscribe(datasets => {
            try {
                this.newestDatasets = JSON.parse(datasets).result.results;
            } catch (error) {
                console.error("Error: setInfoTables() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al obtener los datasets recientes, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
        this.datasetsService.getDownloadedDataset().subscribe(datasets => {
            try {
                this.downloadedDatasets = JSON.parse(datasets).result.results;
            } catch (error) {
                console.error("Error: setInfoTables() - datasets-list.component.ts");
                this.errorTitle="Error";
                this.errorMessage="Ha ocurrido un error en la carga de Datsets";
            }
        });
    }

    searchDatasetsByText(searchParam: string) {
        this.datasets = [];
        this.getDatasetsBySearch(null, null, searchParam);
    }

    searchDatasetsetByOrg() {
        this.datasets = [];
        this.getDatasetsByOrg(null, null, this.selectedOrg, this.selectedType);
    }

    searchDatasetsByHomer(searchParam: string) {
        this.datasets = [];
        this.searchHomerValue = searchParam;
        this.getDatasetsByHomer(null, null);
    }


    setDatasetsStats() {
        this.datasetsService.getDatasetsNumber().subscribe(datasets => {
            try {
                this.datasetCount = [];
                let totalNumDatasets = '';            
                totalNumDatasets = JSON.parse(datasets).result.count + '';
                while (totalNumDatasets.length < 8) totalNumDatasets = 'S' + totalNumDatasets;
                for (var i = 0; i < totalNumDatasets.length; i++) {
                    if(totalNumDatasets[i] == 'S'){
                        this.datasetCount.push({ label: 'slim', value: '0' });
                    }else{
                        this.datasetCount.push({ label: 'normal', value: totalNumDatasets[i]});
                    }
                }
                return this.datasetCount;
            } catch (error) {
                console.error("Error: setDatasetsStats() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al cargar los datasets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
        this.datasetsService.getResourcesNumber().subscribe(resources => {
            try {
                this.resourceCount = [];
                let totalNumResources = '';            
                totalNumResources = JSON.parse(resources).result.count + '';
                while (totalNumResources.length < 8) totalNumResources = 'S' + totalNumResources;
                for (var i = 0; i < totalNumResources.length; i++) {
                    if(totalNumResources[i] == 'S'){
                        this.resourceCount.push({ label: 'slim', value: '0' });
                    }else{
                        this.resourceCount.push({ label: 'normal', value: totalNumResources[i]});
                    }
                }
                return this.resourceCount;
            } catch (error) {
                console.error("Error: setDatasetsStats() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error al cargar los datasets, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }

    filterTagsMultiple(event) {
        let query = event.query;
        this.datasetsService.getTags(query).subscribe(tags => {
            try {
                this.filteredTagsMultiple = [];
                for (let i = 0; i < JSON.parse(tags).result.length; i++) {
                    let tag = JSON.parse(tags).result[i];
                    if (tag.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                        this.filteredTagsMultiple.push({ name: tag, value: tag });
                    }
                }
             } catch (error) {
                console.log("Error filterTagsMultiple() - datasets-list.component.ts");
                this.errorTitle="Se ha producido un error";
                this.errorMessage="Se ha producido un error con el filtrado por etiquetas, vuelva a intentarlo y si el error persiste contacte con el administrador.";
            }
        });
    }
}