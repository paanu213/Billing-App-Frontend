//const servicesList = []


const addService = async ()=>{
    const service = {};
    service.name = document.getElementById('serviceNameInput').value
    service.price = Number(document.getElementById('servicePriceInput').value)
    //servicesList.push(service)

    //send and save data to backend
    const response = await fetch('http://localhost:5000/services/add-service', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    })

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
    event.mobileNumber = Number(document.getElementById('mobileNumber').value)
    event.eventType = document.getElementById('eventType').value
    event.eventStartDate = document.getElementById('eventStartDate').value
    event.eventEndDate = document.getElementById('eventEndDate').value
    event.eventAmount = document.getElementById('eventAmount').value
    event.eventDiscount = document.getElementById('eventDiscount').value
    try{
        
    }
    catch(error){

    }
}