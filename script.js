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
window.onload = getServicesList();


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


//Invoice creation
const createInvoice = async ()=>{
    const event = {};
    event.customerName = document.getElementById('customerName').value
    event.mobileNumber = document.getElementById('mobileNumber').value
    event.eventType = document.getElementById('eventType').value
    event.eventStartDate = document.getElementById('eventStartDate').value
    event.eventEndDate = document.getElementById('eventEndDate').value
    event.eventAmount = Number(document.getElementById('eventAmount').value)
    event.eventDiscount = Number(document.getElementById('eventDiscount').value)
    event.advancePaid = Number(document.getElementById('advanceAmount').value)
    try{
        const response = await fetch ('http://localhost:5000/invoice/create-invoice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(event)
        })
    }
    catch(error){
        console.error(`message: ${error}`)
    }
    console.log(event)

    document.getElementById('customerName').value = ""
    document.getElementById('mobileNumber').value = ""
    document.getElementById('eventType').value = ""
    document.getElementById('eventStartDate').value = ""
    document.getElementById('eventEndDate').value = ""
    document.getElementById('eventAmount').value = ""
    document.getElementById('eventDiscount').value = ""
    document.getElementById('advanceAmount').value = ""
}

//calculateAmounts function to display billing and pending amounts
const calculateAmount = async ()=>{
    eventAmount = Number(document.getElementById('eventAmount').value)
    eventDiscount = Number(document.getElementById('eventDiscount').value)
    advancePaid = Number(document.getElementById('advanceAmount').value)


    const billingAmount = eventAmount - eventDiscount
    const pendingAmount = billingAmount - advancePaid

    const billingAmountcalc = document.getElementById('billingAmountcalc')
    billingAmountcalc.innerText = `Billing Amount: ${billingAmount}`


    const pendingAmountCalc = document.getElementById('pendingAmountCalc')
    pendingAmountCalc.innerText = `Pending Amount: ${pendingAmount}`

    getInvoiceList(id)
}

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
                <td> ${invoice.eventAmount} </td>
                <td> ${invoice.pendingAmount} </td>
                <td> ${invoice.finalAmountCleared} </td>
                <td> <button type="button" class="btn btn-secondary btn-sm"> Edit </button>
                <button type="button" class="btn btn-primary btn-sm"> View </button> </td>
            </tr>`

            invoiceTableBody.innerHTML += row
        })
    }
    catch (error){
        console.log(`there is an error: ${error}`)
    }
}

window.onload = getInvoiceList();