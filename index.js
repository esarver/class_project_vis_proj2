function timeString2ms(timestring) {// HH:MM:SS.mss 
    if(typeof(timestring) != "string"){
        timestring = new String(timestring)
    }
    var dec_split = timestring.split('.')
    var ms = (dec_split.length > 1) ? parseInt(dec_split[1]): 0
    var split = dec_split[0].split(':')

    switch(split.length){
        case 3:
            ms += parseInt(split[2]) * 60 * 60 *1000
        case 2:
            ms += parseInt(split[1]) * 60 * 1000
        case 1:
            ms += parseInt(split[0]) * 1000
    }

    return ms
}

class Score {
    constructor(name, nationality, result) {
        this.name = name
        this.nationality = nationality
        this.result = result
    }
}
class EventResult {
    constructor(location, year, gold, silver, bronze) {
        this.location = location
        this.year = year
        this.gold = gold
        this.silver = silver
        this.bronze = bronze
    }
}
class Event {
    constructor(games, gender, name, type, url) {
        this.games = games
        this.gender = gender
        this.name = name
        this.type = type
        this.url = url
    }
}

var reoganized_results = new Map()

original_results.forEach(event => {
    var years = new Map()

    event.games.forEach(year => {
        var gold = new Array()
        var silver = new Array()
        var bronze = new Array()

        year.results.forEach(result => {
            var measure
            if (event.type === 'time') {
                measure = timeString2ms(result.result)
            } else {
                measure = parseFloat(result.result)
            }

            if (result.medal === "G") {
                gold.push(new Score(result.name, result.nationality, measure))
            } else if (result.medal === "S") {
                silver.push(new Score(result.name, result.nationality, measure))
            } else if (result.medal === "B") {
                bronze.push(new Score(result.name, result.nationality, measure))
            }
        })
        years.set(year.year, new EventResult(year.location, year.year, gold, silver, bronze))
    })
    reoganized_results.set(event.name, new Event(years, event.gender, event.name, event.type, event.url))
})

console.log(reoganized_results)
/*
    "results" = [
        {
            "games": [
                {
                    "location": "Rio",
                    "results": [
                        {
                            "medal": "G",
                            "name": "Mohamed FARAH",
                            "nationality": "USA",
                            "result": "25:05.17"
                        }
                    ],
                    "year": 2016
                }
            ],
            "gender": "M",
            "name": "10000M Men",
            "type": "time",
            "url": "https://www.olympic.org/athletics/10000m-men"
        }
    ]
*/
function generateTable(game_results) {

    // Year, Location, Gold Record, Gold Name(s) (Country), Silver, Silver Names (Country), Bronze, Bronze Names (Country) 
    var years = new Array()
    game_results.forEach(result => {
        years.push([result.year,
        result.location,
        result.gold[0].result,
        result.gold[0].name + "(" + result.gold[0].nationality + ")",
        result.silver[0].result,
        result.silver[0].name + "(" + result.silver[0].nationality + ")",
        result.bronze[0].result,
        result.bronze[0].name + "(" + result.bronze[0].nationality + ")",
        ])
    })
}

google.charts.load('current', { 'packages': ['line'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = new google.visualization.DataTable();
    // Year, Location, Gold Record, Gold Name(s) (Country), Silver, Silver Names (Country), Bronze, Bronze Names (Country) 
    data.addColumn({ type: 'number', label: 'Year', role: 'domain' })
    data.addColumn({ type: 'string', label: 'Location', role: 'annotationText' })



    data.addColumn('number', 'Day');
    data.addColumn('number', 'Guardians of the Galaxy');
    data.addColumn('number', 'The Avengers');
    data.addColumn('number', 'Transformers: Age of Extinction');

    data.addRows([
        [1, 37.8, 80.8, 41.8],
        [2, 30.9, 69.5, 32.4],
        [3, 25.4, 57, 25.7],
        [4, 11.7, 18.8, 10.5],
        [5, 11.9, 17.6, 10.4],
        [6, 8.8, 13.6, 7.7],
        [7, 7.6, 12.3, 9.6],
        [8, 12.3, 29.2, 10.6],
        [9, 16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11, 5.3, 7.9, 4.7],
        [12, 6.6, 8.4, 5.2],
        [13, 4.8, 6.3, 3.6],
        [14, 4.2, 6.2, 3.4]
    ]);

    var options = {
        chart: {
            title: 'Box Office Earnings in First Two Weeks of Opening',
            subtitle: 'in millions of dollars (USD)'
        },
        width: 900,
        height: 500
    };

    var chart = new google.charts.Line(document.getElementById('linechart_material'));

    chart.draw(data, google.charts.Line.convertOptions(options));
}