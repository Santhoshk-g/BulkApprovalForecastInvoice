import { LightningElement, wire, api, track} from 'lwc';
import PROJECTCODE_FIELD from '@salesforce/schema/Forecast_Invoice__c.ProjectCode__c';
import OPPORTUNITYNAME_FIELD from '@salesforce/schema/Forecast_Invoice__c.OpportunityName__c';
import FORECASTDATE_FIELD from '@salesforce/schema/Forecast_Invoice__c.Forecast_Date__c';
import PRODUCT_FIELD from '@salesforce/schema/Forecast_Invoice__c.Product_formula__c';
import INVOICE_FIELD from '@salesforce/schema/Forecast_Invoice__c.Invoice_No__c';
import APPROPRIABLEQUANTITY_FIELD from '@salesforce/schema/Forecast_Invoice__c.Appropriable_Quantity__c';
import getForeCastInvoices from '@salesforce/apex/ForeCastInvoiceApprovalController.getForeCastInvoices';
import updateApprovalStatus from '@salesforce/apex/ForeCastInvoiceApprovalController.updateApproval';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    { label: 'Project Code', fieldName: PROJECTCODE_FIELD.fieldApiName, type: 'text' },
    { label: 'Opportunity Name', fieldName: OPPORTUNITYNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Forecast Date', fieldName: FORECASTDATE_FIELD.fieldApiName, type: 'text' },
    { label: 'Product', fieldName: PRODUCT_FIELD.fieldApiName, type: 'text' },
    { label: 'Invoice', fieldName: INVOICE_FIELD.fieldApiName, type: 'text' },
    { label: 'Appropriable Quantity', fieldName: APPROPRIABLEQUANTITY_FIELD.fieldApiName, type: 'text' }
];

export default class BulkApprovalForecastInvoice extends  NavigationMixin(LightningElement) {
    @api secRows = [];
    @track data = [];
    clickedButtonLabel;
    @api isLoaded = false;
    @track showLoader = false;
    @track errorMessage = '';
    @track selectedItem = 0;
    columns = COLUMNS;
    @wire(getForeCastInvoices)
    accounts({data,error}){
        if(data){
            this.data = data;
            this.selectedItem = this.data.length;
        }

    }

    
    





    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        console.log('selectedRows==================='+ JSON.stringify(selectedRows));
       // console.log('selectedRows  IDS ==================='+ JSON.stringify(selectedRows.id));
       // this.secRows = selectedRows.id;
        //console.log('selectedRows==================='+ JSON.stringify(selectedRows));
        this.selectedItem = selectedRows
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {
           // alert('You selected: ' + selectedRows[i].ProjectCode__c);
            this.secRows.push(selectedRows[i].Id);
        }

        console.log('secRecords+++++++++++++++++++++'+ JSON.stringify(this.secRows));
    }

    
    handleClick(event) {
        // len = this.secRows.length
        //alert('length of the selected row====='+  this.secRows.length)
        if(this.secRows.length > 0){
        

        this.showLoader = true;
        this.clickedButtonLabel = event.target.value;
        console.log('Button click Label'+ this.clickedButtonLabel);
        updateApprovalStatus({ Ids: this.secRows, aprovalStatus: this.clickedButtonLabel})
		.then(result => {
            console.log('Return from Apex');
            console.log('Result value +++++++++++++++++++'+JSON.stringify(result));

            this.navigateToListView()
			//this.accounts = result;
			//this.error = undefined;
		})
		.catch(error => {
			//this.error = error;
			//this.accounts = undefined;
            this.errorMessage = error;
		})

    }
    else{
        this.errorMessage = 'You should select atleast One Row.';
    }
    }

    navigateToListView() {
        // Navigate to the Contact object's Recent list view.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Forecast_Invoice__c',
                actionName: 'list'
            },
            state: {
                // 'filterName' is a property on the page 'state'
                // and identifies the target list view.
                // It may also be an 18 character list view id.
                filterName: 'Recent' // or by 18 char '00BT0000002TONQMA4'
            }
        });
    }

   




}
