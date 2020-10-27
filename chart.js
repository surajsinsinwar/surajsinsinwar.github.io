var ctx = document.getElementById('chart').getContext('2d');
var str = "generation: ";
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line', // The data for our dataset
    data: {
        labels: ["generation: 0"],
        datasets: [{
            label: 'Maximum success',
            // backgroundColor: 'rgb(0, 99, 132, 132)',
            borderColor: 'rgb(255, 150, 50)',
            data: [0]
        },
        {
            label: 'Current generation success',
            // backgroundColor: 'rgb(0, 255, 50, 100)',
            borderColor: 'rgb(0, 99, 132)',
            data: [0]
        }
        // ,{
        //     label: 'Population Size',
        //     // backgroundColor: 'rgb(0, 255, 50, 100)',
        //     borderColor: 'rgb(255, 150, 50)',
        //     data: [0]
        // }
        ]
    },
    // Configuration options go here
    options: {}
});

function updateChart(){
    chart.data.datasets[0].data.push(max_till_now);
    chart.data.datasets[1].data.push(completed);
    // chart.data.datasets[2].data.push(population_size);
    str = "generation: "
    str = str + (generation - 1);
    chart.data.labels.push(str);
    chart.update();
}