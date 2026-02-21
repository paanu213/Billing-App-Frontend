const addService = async ()=>{
    const service = {};
    service.name = document.getElementById('serviceNameInput').value
    service.price = Number(document.getElementById('servicePriceInput').value)

    //send and save data to backend
    const response = await fetch('http://localhost:5000/services/add-service', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    })

    //after saving service, we are showing a successfull message in <p> tag text below the button
    const dataSaveActionResponse = document.getElementById('dataSaveActionResponse')
    dataSaveActionResponse.innerText = await response.text()

    getServicesList()

    document.getElementById('serviceNameInput').value = ""
    document.getElementById('servicePriceInput').value = ""
}

const getServicesList = async ()=>{

    try{
        //get data from backend
        const response = await fetch('http://localhost:5000/services/services-list')

        const servicesList = await response.json()

        //displaying the fetched data in services list table on services page
        const servicesListTableBody = document.getElementById('servicesListTableBody')
        servicesListTableBody.innerHTML = "";

        servicesList.forEach((service, index) => {
            const row = `
            <tr>
            <td> ${index+1} </td>
            <td> ${service.name} </td>
            <td> ${service.price} </td>
            <td> 
                <button type="button" class="btn btn-secondary btn-sm"> Edit </button>
                <button type="button" class="btn btn-danger btn-sm" onClick="deleteService('${service._id}')" > Delete </button>
            </td>
            </tr>`;

        servicesListTableBody.innerHTML += row
        })
    } catch (error){
        console.error("message", error)
    }
}

// Call this function when the page loads
//window.onload = getServicesList();


//To delete the service from the list
const deleteService = async (id)=>{
    if(!confirm('Are you sure want to delete the service? if you delete this, all the records on this id will get deleted from the invoice data')) return;

    try{
        const response = await fetch (`http://localhost:5000/services/delete-service/${id}`,{
            method: 'DELETE'
        });

        if(response.ok){
            getServicesList()
            const deleteToast = document.getElementById('deleteToast')
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(deleteToast)
            toastBootstrap.show()

            serviceDeleteAlert.innerHTML = 'service deleted successfully'
            
        }
    } catch(error) {
        console.error("message:", error)
    }
    
}

//start and end date restriction event listener.
const startDateInput = document.getElementById('eventStartDate');
const endDateInput = document.getElementById('eventEndDate');

if (startDateInput && endDateInput) {
  startDateInput.addEventListener('change', function () {
    const selectedStartDate = this.value;
    endDateInput.min = selectedStartDate;

    if (endDateInput.value && endDateInput.value < selectedStartDate) {
      endDateInput.value = "";
    }
  });
}



//Invoice creation
const createInvoice = async ()=>{
    const data = {};
    data.customerName = document.getElementById('customerName').value
    data.mobileNumber = document.getElementById('mobileNumber').value
    data.eventType = document.getElementById('eventType').value
    data.eventStartDate = document.getElementById('eventStartDate').value
    data.eventEndDate = document.getElementById('eventEndDate').value
    data.eventAmount = Number(document.getElementById('eventAmount').value)
    data.eventDiscount = Number(document.getElementById('eventDiscount').value)
    data.advancePaid = Number(document.getElementById('advanceAmount').value)
    data.gstPercentage = Number(document.getElementById('gstPercentage').value)

    const customerNameErrorMessage = document.getElementById('customerNameErrorMessage')
    const mobileNumberErrorMessage = document.getElementById('mobileNumberErrorMessage')
    const eventTypeErrorMessage = document.getElementById('eventTypeErrorMessage')
    const eventStartDateErrorMessage = document.getElementById('eventStartDateErrorMessage')
    const eventEndDateErrorMessage = document.getElementById('eventEndDateErrorMessage')
    const eventAmountErrorMessage = document.getElementById('eventAmountErrorMessage')
    const eventDiscountErrorMessage = document.getElementById('eventDiscountErrorMessage')
    const advancePaidErrorMessage = document.getElementById('advancePaidErrorMessage')
    const lastCreatedInvoiceDetails = document.getElementById('lastCreatedInvoiceDetails')

    if (!data.customerName){
        customerNameErrorMessage.innerText = "Customer Name is mandatory"
        return
    }

    if (data.customerName){
        customerNameErrorMessage.innerText = ""
    }

    if (!data.mobileNumber){
        mobileNumberErrorMessage.innerText = "Mobile number is mandatory"
        return
    }

    if (data.mobileNumber){
        mobileNumberErrorMessage.innerText = ""
    }

    if (!/^\d{10}$/.test(data.mobileNumber)){
        mobileNumberErrorMessage.innerText = "Only 10 digits allowed"
        return
    }

    if (data.eventType){
        eventTypeErrorMessage.innerText = ""
    }

    if (!data.eventType){
        eventTypeErrorMessage.innerText = "Event type is required"
        return
    }

    if (!data.eventStartDate){
        eventStartDateErrorMessage.innerText = "Event start date is required"
        return
    }

    if (!data.eventEndDate){
        eventEndDateErrorMessage.innerText = "Event end date is required"
        return
    }

    if (new Date(data.eventEndDate) < new Date(data.eventStartDate)) {
    messageBox.innerText = "End date cannot be before start date.";
    return;
}

    if (!data.eventAmount || data.eventAmount <= 0){
        eventAmountErrorMessage.innerText = "Event Amount is required"
        return
    }

    if (data.eventDiscount < 0 || data.eventDiscount > data.eventAmount){
        eventDiscountErrorMessage.innerText = "Discount can not be in negitive & below Price"
        return
    }

    if (data.advancePaid < 0){
        advancePaidErrorMessage.innerText = "Advance can not be in negitive"
        return
    }

    if (data.advancePaid > data.eventAmount){
        advancePaidErrorMessage.innerText = "Advance cannot exceed event amount."
        return
    }



    try{
        const response = await fetch ('http://localhost:5000/invoice/create-invoice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        console.log(data)

         const responseData = await response.json();
         const invoiceId = responseData.response.invoiceId;
         const customerName = responseData.response.customerName;
         const billAmount = responseData.response.billAmount;

         const invoiceCreationSuccessMessage = document.getElementById('invoiceCreationSuccessMessage')
         invoiceCreationSuccessMessage.innerText =  "Invoice Created Successfully"

         lastCreatedInvoiceDetails.innerText = `Inoice id: ${invoiceId} 
                                                Customer Name: ${customerName} 
                                                Bill Amount: ${billAmount}`
    }
    catch(error){
        console.error(`message: ${error}`)
    }

    document.getElementById('invoiceForm').reset()
    document.getElementById('gstPercentage').value = "";

    
}

//calculateAmounts function to display billing and pending amounts
const calculateAmount = async ()=>{
    const eventAmount = Number(document.getElementById('eventAmount').value)
    const eventDiscount = Number(document.getElementById('eventDiscount').value)
    const advancePaid = Number(document.getElementById('advanceAmount').value)

    const gstPercentage = Number(document.getElementById('gstPercentage').value) || 0


    const afterDiscountCalc = eventAmount - eventDiscount  // bill amount after discount calc
    const gstAmountCalc = afterDiscountCalc * (gstPercentage / 100)  //calculating gst amount
    const finalAmountCalc = afterDiscountCalc + gstAmountCalc
    const pendingAmountCalc = finalAmountCalc - advancePaid

    //displaying values to user
    const billAmount = document.getElementById('billAmount')
    billAmount.innerText = `Amount: ${eventAmount}`

    const discountAmount = document.getElementById('discountAmount')
    discountAmount.innerText = `Discount: ${eventDiscount}`

    const afterDiscount = document.getElementById('afterDiscount')
    afterDiscount.innerText = `After Discount: ${afterDiscountCalc}`

    const gstAmount = document.getElementById('gstAmount')
    gstAmount.innerText = `GST Amount(${gstPercentage}%): ${gstAmountCalc}`

    const finalAmount = document.getElementById('finalAmount')
    finalAmount.innerText = `Final Amount: ${finalAmountCalc}`

    const advanceAmountPaid = document.getElementById('advanceAmountPaid')
    advanceAmountPaid.innerText = `Advance Paid: ${advancePaid}`

    const pendingAmount = document.getElementById('pendingAmount')
    pendingAmount.innerText = `Pending Amount: ${pendingAmountCalc}`

    // getInvoiceList(id)
}


//get invoice list and show to user
const getInvoiceList = async ()=>{
    try{
        const response = await fetch ('http://localhost:5000/invoice/invoice-list')

        const invoiceList = await response.json()

        //targetting table body and making the table data empty before showing, to avoid duplicates
        const invoiceTableBody = document.getElementById('invoiceTableBody')
        invoiceTableBody.innerHTML = ""

        //create table rows and loop the data came from the api
        invoiceList.forEach((invoice, index)=>{
            const row = `
            <tr>
                <td>${index+1}</td>
                <td>${new Date(invoice.eventStartDate).toLocaleDateString()}</td>
                <td> ${invoice.customerName} </td>
                <td> ${invoice.mobileNumber} </td>
                <td> ${Number(invoice.billAmount)} </td>
                <td> ${Number(invoice.pendingAmount)} </td>
                <td> ${invoice.finalAmountCleared} </td>

                <td>
                
                <div class="dropdown">
                <button type="button" class="btn btn-primary btn-sm"> View </button>
                <button class="btn btn-sm text-secondary border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px">
                <path d="M12 3C11.175 3 10.5 3.675 10.5 4.5C10.5 5.325 11.175 6 12 6C12.825 6 13.5 5.325 13.5 4.5C13.5 3.675 12.825 3 12 3ZM12 18C11.175 18 10.5 18.675 10.5 19.5C10.5 20.325 11.175 21 12 21C12.825 21 13.5 20.325 13.5 19.5C13.5 18.675 12.825 18 12 18ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                </svg>
                </button>
                
                <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href=""><i class="bi bi-pencil me-2"></i>Edit</a></li>
                <li><a class="dropdown-item" href="javascript:void(0)" onClick = "openPaymentModel('${invoice.id}')"><i class="bi bi-cash me-2"></i>Received Amount</a>
                </li><li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#">Delete</a></li>
                </ul>
                </div>
                
                </td>
            </tr>`

            invoiceTableBody.innerHTML += row

            const dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        });
        })
    }
    catch (error){
        console.log(`there is an error: ${error}`)
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
     const invoiceTableBody = document.getElementById('invoiceTableBody');

     if (invoiceTableBody){
        getInvoiceList()
     }
    } );


//Additional payment model open
const openPaymentModel = (id)=>{
    document.getElementById('invoiceId').value = id;
    // Format today's date to YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('additionalPaymentDate').value = today;
    document.getElementById('additionalPaymentAmount').value = "";

    const pModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    pModal.show();

}

//additional Payment Adding to record and saving in backend, updating in frontend.
const saveAdditionalPayment = async ()=>{
    const Id = document.getElementById('invoiceId').value
    const additionalPaymentData = {
        date: document.getElementById('additionalPaymentDate').value,
        amount: Number(document.getElementById('additionalPaymentAmount').value)
    }
    try{
        const response = await fetch(`http://localhost:5000/invoice/update-payment/${Id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(additionalPaymentData)
        })

        if (response.ok){
            alert("payment saved successfully")
            const modalElement = document.getElementById('paymentModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            getInvoiceList()
        }
    }
    catch (error) {
        console.error('message', error)
    }
}
