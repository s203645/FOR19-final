const transport = document.getElementById('transport');
const transport_icon = document.getElementById('transport_icon');
const newEntryButton = document.getElementById('newEntryButton');
const filter_individual = document.getElementById('filter_individual');
const filter_all = document.getElementById('filter_all');
const filter_date = document.getElementById('filter_date');


transport.addEventListener('change', (event) => {
    console.log(event.target.value);
    transport_icon.classList = "fa-solid fa-" + event.target.value;
});

newEntryButton.addEventListener('click', (event) => {
    newEntry();
});

filter_individual.addEventListener('click', (event) => {
    refresh(0);
    filter_individual.value = "active";
    filter_individual.classList = "btn btn-success";
    filter_all.value = "inactive";
    filter_all.classList = "btn btn-secondary";
    filter_individual.style = "background-color: #628354;"
    filter_all.style = "background-color: #9395935e; color: grey; box-shadow: none;"
});

filter_all.addEventListener('click', (event) => {
    refresh(1);
    filter_all.value = "active";
    filter_all.classList = "btn btn-success";
    filter_individual.value = "inactive";
    filter_individual.classList = "btn btn-secondary";
    filter_all.style = "background-color: #628354;"
    filter_individual.style = "background-color: #9395935e; color: grey; box-shadow: none;"

});

filter_date.addEventListener('click', (event) => {
    let end = document.getElementById('filter_start').value;
    let start = document.getElementById('filter_end').value;
    let status = document.getElementById('filter_individual').value;
    console.log(start, end, status)
    if (status === 'active') {
        if (start === '' || end === '') {
            refresh(0);
        }
        else {
            refresh(0, start, end);
        }
    }
    else {
        if (start === '' || end === '') {
            refresh(1);
        }
        else {
            refresh(1, start, end);
        }
    }
  
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
                let status = document.getElementById('filter_individual').value;
                if (status === 'active') { refresh(0); } else { refresh(1); }
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
    emissions_by_transport(0);
    over_time_emissions(0);
    kms_transport_data(0);
    over_time_kms(0);
    get_anf_fill_table(0);
});

const emissions_by_transport = (arg, start, date) =>{
    const ctx = document.getElementById('emissions_by_transport').getContext('2d');
    let chart = null;

    fetch('/my_data/1/' + arg + '/' + start + '/' + date)
        .then(response => response.json())
        .then(data => {
            chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.labels,
                        datasets: [{
                            data: data.values,
                            backgroundColor: ['#9e0142', '#d53e4f', '#f46d43',
                            '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'  ],    
                
                            borderWidth: 1,
                            hoverBorderColor: "black",
                            hoverBorderWidth: 2,
                            hoverBackgroundColor: ['#9e0142', '#d53e4f', '#f46d43',
                            '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'  ],     
                            pointHoverRadius: 5
                        }],
                    },
                    options: {
                            title: {
                                display: true,
                                    text: "Emissions by type of transport",
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

const over_time_emissions = (arg, start, end) =>{
    const ctx = document.getElementById('over_time_emissions').getContext('2d');
    let chart = null;
    fetch('/my_data/2/' +arg + '/' + start + '/' + end)  
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
                            label: "Carbon emissions (filtered by date)",                           
                            data: data.values,
                            fill: false,
                            borderColor: '#d53e4f',
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

const kms_transport_data = (arg, start, end) => { 
    const kms_by_transport = document.getElementById('kms_by_transport').getContext('2d');
    fetch('/my_data/3/' + arg + '/' + start + '/' + end)
        .then(response => response.json())
        .then(data => {
             new Chart(kms_by_transport, {
                type: 'pie',
                data: {
                labels: data.labels,
                    datasets: [{
                        label: "Income Vs Expenses",
                        data: data.values,
                        backgroundColor: ['#9e0142', '#d53e4f', '#f46d43',
                            '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'  ],    
                
                            borderWidth: 1,
                            hoverBorderColor: "black",
                            hoverBorderWidth: 2,
                            hoverBackgroundColor: ['#9e0142', '#d53e4f', '#f46d43',
                            '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'  ],     
                        pointHoverRadius: 5
                    }],
                },
                options: {
                        title: {
                            display: true,
                                text: "Kilometers by type of transport",
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

const over_time_kms = (arg, start, end) => {
    const over_time_kms = document.getElementById("over_time_kms").getContext("2d");
    fetch('/my_data/4/' + arg + '/' + start + '/' + end)
        .then(response => response.json())
        .then(data => {
            new Chart(over_time_kms, {
                type: 'line',
                data:
                {
                    labels: data.labels,
                    datasets: [
                        {
                        label: "Kilometers traveled (filtered by date)",                            
                        data: data.values,
                        fill: false,
                        borderColor: '#5e4fa2',
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

const get_anf_fill_table = (arg, start, end) => {
    fetch('/my_data/5/' + arg + '/' + start + '/' + end)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            $('#entry_table tbody').remove()
            $('#entry_table').append('<tbody> </tbody>');
            for (let i = 0; i < data.length; i++) {
                console.log(i)
                console.log(data[i])
              $('#entry_table tbody:last-child').append(`<tr> <td>` + data[i][0] + `</td> <td>` + data[i][1] +` </td> <td>` + data[i][2] + `</td> <td>` + data[i][3] + `</td> <td>` + data[i][4] + `</td> <td>` + data[i][5] + `</td> <td> <button class="btn btn-danger" onclick="delete_row(`+data[i][6]+`)"> Delete </button> </td> </tr>`);
            }
            $('#entry_table').DataTable( {
                destroy:true,  
              });

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
            let status = document.getElementById('filter_individual').value;
            let end = document.getElementById('filter_start').value;
            let start = document.getElementById('filter_end').value;
            if (status === 'active') {
                if (start === '' || end === '') {
                    refresh(0);
                }
                else {
                    refresh(0, start, end);
                }
            }
            else {
                if (start === '' || end === '') {
                    refresh(1);
                }
                else {
                    refresh(1, start, end);
                }
            }
          
            $('#table_confirmation').text("Entry deleted successfully").show();
            setTimeout(function() { $("#table_confirmation").hide(); }, 3000);
        }
    });
}


const refresh = (arg, start, end) => {
    emissions_by_transport(arg, start, end);
    over_time_emissions(arg, start, end);
    kms_transport_data(arg, start, end);
    over_time_kms(arg, start, end);
    get_anf_fill_table(arg, start, end);
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


