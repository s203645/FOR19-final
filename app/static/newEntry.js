const transport = document.getElementById('transport');
const transport_icon = document.getElementById('transport_icon');
const newEntryButton = document.getElementById('newEntryButton');

transport.addEventListener('change', (event) => {
    console.log(event.target.value);
    transport_icon.classList = "fa-solid fa-" + event.target.value;
});

newEntryButton.addEventListener('click', (event) => {
    newEntry();
});

const newEntry = () => {
    $.ajax({
        url: '/newEntry',
        type: 'POST',
        data: {
            transport: document.getElementById('transport').value,
            kms: document.getElementById('kms').value,
            fuel: document.getElementById('fuel').value,
            
        },
        success: function (response) {
            console.log(response);
            refresh()
        }
    });
};


Chart.scaleService.updateScaleDefaults('linear', {
    ticks: {
        min: 0
    }
});

$(document).ready(function () {
    emissions_by_transport();
    over_time_emissions();
    kms_transport_data();
    over_time_kms();
});

const emissions_by_transport = () =>{
    const ctx = document.getElementById('emissions_by_transport').getContext('2d');
    let chart = null;

    fetch('/my_data/1')
        .then(response => response.json())
        .then(data => {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.labels,
                        datasets: [{
                            data: data.values,
                            backgroundColor: ['#9ac2be', '#f2e3b6', '#f2c299',
                                '#f2935c', '#5fd9cd', '#f2d95c', '#f2b84b', '#f27979' ],
                
                            borderWidth: 1,
                            hoverBorderColor: "black",
                            hoverBorderWidth: 2,
                            hoverBackgroundColor: 'rgba(154, 245, 140)',
                            pointHoverRadius: 5
                        }],
                    },
                    options: {
                            title: {
                                display: true,
                                    text: "Emissions by type of transport (5 last days)",
                                        fontColor: "black",
                                        fontSize: 20,
                            },
                            legend: {
                                position: "right",
                                    labels: {
                                    fontColor: "black"
                                },
                                display: true,
                            },
                
                            elements: {
                                hitRadius: 3,
                            }
                    }
                })
            })
        .catch(err => {
            console.log(err);
        });
}


const over_time_emissions = () =>{
    const ctx = document.getElementById('over_time_emissions').getContext('2d');
    let chart = null;
    fetch('/my_data/2')  
        .then(response => response.json())
        .then(data => {
            chart = new Chart(ctx, {
                type: 'line',
                data:
                    {
                        labels: data.labes,
                        datasets: [
                            {
                            label: "Individual Emissions (5 past days)",                           
                            data: data.values,
                            fill: false,
                            borderColor: '#5fd9cd',
                            lineTension: 0.1
                            }
                    ]
                    },                    
                    options: {}
                });
            })
        .catch(err => {
            console.log(err);
        });
}

const kms_transport_data = () => { 
    const kms_by_transport = document.getElementById('kms_by_transport').getContext('2d');
    fetch('/my_data/3')
        .then(response => response.json())
        .then(data => {
             new Chart(kms_by_transport, {
                type: 'pie',
                data: {
                labels: data.labels,
                    datasets: [{
                        label: "Income Vs Expenses",
                        data: data.values,
                        backgroundColor: ['#9ac2be', '#f2e3b6', '#f2c299',
                            '#f2935c', '#5fd9cd', '#f2d95c', '#f2b84b', '#f27979' ],    
                        borderWidth: 1,
                        hoverBorderColor: "black",
                        hoverBorderWidth: 2,
                        hoverBackgroundColor: 'rgba(154, 245, 140)',
                        pointHoverRadius: 5
                    }],
                },
                options: {
                        title: {
                            display: true,
                                text: "Kilometers by type of transport (5 last days)",
                                fontColor: "black",
                                fontSize: 20,
                        },
                        legend: {
                            position: "right",
                                labels: {
                                fontColor: "black"
                            },
                            display: true,
                        },

                        elements: {
                            hitRadius: 3,
                        }
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
}

const over_time_kms = () => {
    const over_time_kms = document.getElementById("over_time_kms").getContext("2d");
    fetch('/my_data/4')
        .then(response => response.json())
        .then(data => {
            new Chart(over_time_kms, {
                type: 'line',
                data:
                {
                    labels: data.labes,
                    datasets: [
                        {
                        label: "Individual Kilometers (5 past days)",                            
                        data: data.values,
                        fill: false,
                        borderColor: '#f2d95c',
                        lineTension: 0.1
                        }
                ]
                },                    
                options: {}
            });   
        })
        .catch(err => {
            console.log(err);
        });
}





const refresh = () => {
    emissions_by_transport();
    over_time_emissions();
    kms_transport_data();
    over_time_kms();
}
