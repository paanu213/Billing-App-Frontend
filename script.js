const servicesList = []

const addService = async ()=>{
    const service = {};
    service.name = document.getElementById('serviceNameInput').value
    service.price = Number(document.getElementById('servicePriceInput').value)
    servicesList.push(service)

    //send and save data to backend
    const response = await fetch('http://localhost:5000/services/add-service', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    })

    const dataSaveActionResponse = document.getElementById('dataSaveActionResponse')
    dataSaveActionResponse.innerText = await response.text()

    document.getElementById('serviceNameInput').value = ""
    document.getElementById('servicePriceInput').value = ""
}