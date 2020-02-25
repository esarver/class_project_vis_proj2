function timeString2ms(timestring) {// HH:MM:SS.mss 
    if (typeof (timestring) != "string") {
        timestring = new String(timestring)
    }
    var dec_split = timestring.split('.')
    if (dec_split.length > 1 && dec_split[0].includes(":")) {
        switch (dec_split[1].length) {
            case 3:
                ms = parseInt(dec_split[1])
                break
            case 2:
                ms = parseInt(dec_split[1]) * 10
                break
            case 1:
                ms = parseInt(dec_split[1]) * 100
                break
        }
    }
    ms = (dec_split.length > 1) ? parseInt(dec_split[1]) : 0
    var split = dec_split[0].split(':').reverse()

    switch (split.length) {
        case 3:
            ms += parseInt(split[2]) * 60 * 60 * 1000

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
var previous_selection = null
function addCharts() {
    var div = document.getElementById("charts")
    var count = 0;
    reorganized_results.forEach((value, key) => {
        var button_id = "button" + String(count)

        var button = document.createElement("button")
        button.className = "option_selection"
        button.id = button_id
        button.innerHTML = key

        div.appendChild(button);
        button.addEventListener("click", function () {
            if (previous_selection !== null) {
                previous_selection.classList.toggle("active")
            }
            this.classList.toggle("active")
            previous_selection = this
            drawChart('linechart_material', reorganized_results, this.innerHTML)
        })

        count++;
    })
    document.getElementById('button0').click()
}

var reorganized_results = new Map()

original_results.forEach(event => {
    var years = new Map()

    event.games.forEach(year => {
        var gold = new Score(null, null, null)
        var silver = new Score(null, null, null)
        var bronze = new Score(null, null, null)

        year.results.forEach(result => {
            var measure
            if (result.result === null) {
                measure = null
            } else if (event.type === 'time') {
                measure = timeString2ms(result.result)
            } else {
                measure = parseFloat(result.result)
            }

            if (result.medal === "G") {
                gold = new Score(result.name, result.nationality, measure)
            } else if (result.medal === "S") {
                silver = new Score(result.name, result.nationality, measure)
            } else if (result.medal === "B") {
                bronze = new Score(result.name, result.nationality, measure)
            }
        })
        years.set(year.year, new EventResult(year.location, year.year, gold, silver, bronze))
    })
    reorganized_results.set(event.name, new Event(years, event.gender, event.name, event.type, event.url))
})

window.onload = addCharts

function generateTable(game_results) {

    // Year, Location, Gold Record, Gold Name(s) (Country), Silver, Silver Names (Country), Bronze, Bronze Names (Country) 
    var years = new Array()
    game_results.games.forEach((result, key) => {
        years.push([key,
            result.gold.result,
            result.silver.result,
            result.bronze.result
        ])
    })

    years = years.sort((a, b) => {
        if (a[0] > b[0])
            return 1
        if (a[0] < b[0])
            return -1
        return 0
    })
    return years
}

google.charts.load('current', { 'packages': ['line', 'corechart'] });

function drawChart(element, results, name = '10000M Men') {
    var data = new google.visualization.DataTable();
    // Year, Location, Gold Record, Gold Name(s) (Country), Silver, Silver Names (Country), Bronze, Bronze Names (Country) 
    data.addColumn({ type: 'number', label: 'Year', role: 'domain' })
    data.addColumn({ type: 'number', label: 'Gold', role: 'data' })
    data.addColumn({ type: 'number', label: 'Silver', role: 'data' })
    data.addColumn({ type: 'number', label: 'Bronze', role: 'data' })

    var rows = generateTable(results.get(name))
    data.addRows(rows)

    var score_type
    switch (results.get(name).type) {
        case "distance":
            score_type = "Distance (m)"
            break;
        case "time":
            score_type = "Time (ms)"
            break;
        case "points":
            score_type = "Points"
            break;
    }

    var options = {
        title: name,
        series: {
            0: { targetAxisIndex: 0, color: "#FFD700" },
            1: { targetAxisIndex: 0, color: "#B3B3B3" },
            2: { targetAxisIndex: 0, color: "#CD7F32" },
        },
        hAxis: {
            format: "####"
        },
        vAxis: {
            title: score_type,
        },
        interpolateNulls: true,
        width: 1800,
        height: 800
    };
    var chart = new google.charts.Line(document.getElementById(element));

    chart.draw(data, google.charts.Line.convertOptions(options));
}
