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
            console.log(response)
            if (response.error === undefined) {
                refresh();
                document.getElementById('transport').value = 'default';
                document.getElementById('fuel').value = 'default';
                document.getElementById('kms').value = '';
                $('#new_entry').modal('toggle');
            }
            else {
                console.log(response.error)               
            }           
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
    get_anf_fill_table();
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
                            backgroundColor: ['#64cbda', '#14b2d1', '#226e96',
                            '#1e5171', '#c2b380', '#dfce9d', '#ffffff59', '#c3d8d4', 'black'  ],    
                
                            borderWidth: 1,
                            hoverBorderColor: "black",
                            hoverBorderWidth: 2,
                            hoverBackgroundColor: ['#64cbda', '#14b2d1', '#226e96',
                            '#1e5171', '#c2b380', '#dfce9d', '#ffffff59', '#c3d8d4', 'black'  ], 
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
            console.log(data)
            chart = new Chart(ctx, {
                type: 'line',
                data:
                    {
                        labels: data.labels,
                        datasets: [
                            {
                            label: "Individual Emissions (5 past days)",                           
                            data: data.values,
                            fill: false,
                            borderColor: '#14b2d1',
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
                        backgroundColor: ['#64cbda', '#14b2d1', '#226e96',
                            '#1e5171', '#c2b380', '#dfce9d', '#ffffff59', '#c3d8d4', 'black' ],     
                        borderWidth: 1,
                        hoverBorderColor: "black",
                        hoverBorderWidth: 2,
                        hoverBackgroundColor: ['#64cbda', '#14b2d1', '#226e96',
                            '#1e5171', '#c2b380', '#dfce9d', '#ffffff59', '#c3d8d4', 'black'  ], 
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
                    labels: data.labels,
                    datasets: [
                        {
                        label: "Individual Kilometers (5 past days)",                            
                        data: data.values,
                        fill: false,
                        borderColor: '#226e96',
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

var del_button = document.createElement("button");
del_button.classList.add("btn", "btn-danger", "btn-sm");
del_button.innerHTML = "Delete";

const get_anf_fill_table = () => {
    fetch('/my_data/5')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            $('#entry_table tbody').remove()
            $('#entry_table').append('<tbody> </tbody>');
            for (let i = 0; i < data[0].length; i++) {
                console.log(data[i])
              $('#entry_table tbody:last-child').append(`<tr> <td>` + data[i][0] + `</td> <td>` + data[i][1] +` </td> <td>` + data[i][2] + `</td> <td>` + data[i][3] + `</td> <td>` + data[i][4] + `</td> <td>` + data[i][5] + `</td> <td>` + data[i][6] + `</td>  <td>` + data[i][7] + `</td> <td> <button class="btn btn-danger" onclick="delete_row(`+data[i][8]+`)"> Delete </button> </td> </tr>`);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const delete_row = (row) => {
    $.ajax({
        url: '/deleteEntry',
        type: 'POST',
        data: {
           id:row           
        },
        success: function (response) {
            console.log(response);
            get_anf_fill_table();
            $('#table_confirmation').text("Entry deleted successfully").show();
            setTimeout(function() { $("#table_confirmation").hide(); }, 3000);
        }
    });
}


const refresh = () => {
    emissions_by_transport();
    over_time_emissions();
    kms_transport_data();
    over_time_kms();
    get_anf_fill_table();
}


var firstSelect = document.getElementById("transport");
var secondSelect = document.getElementById("fuel");

const populateSecondSelect = () => {
    secondSelect.innerHTML = "";
    var selectedValue = firstSelect.value;

    var option1 = document.createElement("option");
    option1.value = "Gasoline";
    option1.text = "Gasoline";

    var option2 = document.createElement("option");
    option2.value = "Diesel";
    option2.text = "Diesel";

    var option3 = document.createElement("option");
    option3.value = "Electric";
    option3.text = "Electric";
    
    var option4 = document.createElement("option");
    option4.value = "Hybrid";
    option4.text = "Hybrid";

    var option5 = document.createElement("option");
    option5.value = "Jet Fuel";
    option5.text = "Jet Fuel";

    var option6 = document.createElement("option");
    option6.value = "No Fossil Fuel";
    option6.text = "No Fossil Fuel";


    if (selectedValue === "car") {
        secondSelect.add(option1);
        secondSelect.add(option2);
        secondSelect.add(option3);
        secondSelect.add(option4);
    }
    else if (selectedValue === "plane") {
        secondSelect.add(option5);
    }
    else if (selectedValue === "plane-up") {
        secondSelect.add(option5);
    }
    else if (selectedValue === "bus") {
        secondSelect.add(option2);
        secondSelect.add(option3);
    }
    else if (selectedValue === "train-tram") {
        secondSelect.add(option3);
    }
    else if (selectedValue === "motorcycle") {
        secondSelect.add(option1);
    }
    else if (selectedValue === "train") {
        secondSelect.add(option3);
        secondSelect.add(option2);
    }
    else if (selectedValue === "ferry") {
        secondSelect.add(option2);
    }
    else if (selectedValue === "bicycle") {
        secondSelect.add(option6);
    }
    else if (selectedValue === "person-walking") {
        secondSelect.add(option6);
    }
};

firstSelect.addEventListener("change", populateSecondSelect);
populateSecondSelect();


