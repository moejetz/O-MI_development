url = "http://130.233.193.135:8080/";
dataType = "application/xml";
xmlGetData =
  '<?xml version="1.0"?>'+
  '<omi:omiEnvelope xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" xmlns:omi="omi.xsd" version="1.0" ttl="0">'+
    '<omi:read msgformat="odf">'+
      '<msg xmlns="omi.xsd">'+
        '<Objects xmlns="odf.xsd">'+
          '<Object>'+
            '<id>CS Building - B126</id>'+
          '</Object>'+
        '</Objects>'+
      '</msg>'+
    '</omi:read>'+
  '</omi:omiEnvelope>';


xmlPostData1 =
  '<?xml version="1.0"?>'+
    '<omi:omiEnvelope xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" xmlns:omi="omi.xsd" version="1.0" ttl="0">'+
      '<write xmlns="omi.xsd" msgformat="odf">'+
        '<omi:msg>'+
          '<Objects xmlns="odf.xsd">'+
            '<Object>'+
              '<id>CS Building - B126</id>'+
              '<InfoItem name="Plug2">'+
                '<value>';
xmlPostData2 =
                '</value>'+
              '</InfoItem>'+
            '</Object>'+
          '</Objects>'+
        '</omi:msg>'+
      '</write>'+
    '</omi:omiEnvelope>';



var latestTempData = [0];
var latestLightData = [0];
var latestHumidityData = [0];
var latestPlugState = '0';

jQuery(document).ready(function($) {

    currentUrl = window.location.host;
    $('#targetService').val(currentUrl);

    //hide gauges
    $("#switchContainer").hide();
    $("#tempContainer").hide();
    $("#lightContainer").hide();
    $("#humidityContainer").hide();



    $("#switchBtn").click(function() {
      switchPlug($("#switchBtn").val());
    });

    //load latest sensor data
    getLatestData();


    setTimeout(function() {
        $("#loadingData").fadeOut(1000, function() {

            $("#loadingData").remove();

            //ititialize gauges
            initializeTemp();
            initializeLight();
            initializeHumidity();

            //show gauges
            $("#tempContainer").fadeIn(2000);
            $("#lightContainer").fadeIn(2000);
            $("#humidityContainer").fadeIn(2000);
            $("#switchContainer").fadeIn(1500);
        });

    }, 1000);

});





function initializeTemp() {


    $('#tempContainer').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Temperature [°C]'
        },
        pane: {
            startAngle: -130,
            endAngle: 130,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: -10,
            max: 50,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Temperature'
            },
            plotBands: [{
                from: -10,
                to: 15,
                color: '#1e90ff' // blue
            }, {
                from: 15,
                to: 25,
                color: '#228b22' // green
            }, {
                from: 25,
                to: 30,
                color: '#ffff00' // yellow
            }, {
                from: 30,
                to: 50,
                color: '#DF5353' // red
            }]
        },
        series: [{
            name: 'Temperature',
            data: latestTempData,
            enableMouseTracking: false
        }]
    },
    // Add some life
    function (chart) {
        if (!chart.renderer.forExport) {
            setInterval(function () {
                var point = chart.series[0].points[0],
                    newVal,
                    inc = Math.round((Math.random() - 0.5) * 20);

                point.update(latestTempData);

            }, 3000);
        }
    });
}


function initializeLight() {

    $('#lightContainer').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Light [Lux]'
        },
        pane: {
            startAngle: -130,
            endAngle: 130,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 60000,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Light'
            },
            plotBands: [{
                from: 0,
                to: 15000,
                color: '#000000' // black
            }, {
                from: 15000,
                to: 30000,
                color: '#bebebe' // grey
            }, {
                from: 30000,
                to: 45000,
                color: '#ffff00' // yellow
            }, {
                from: 45000,
                to: 60000,
                color: '#ffffff' // white
            }]
        },

        series: [{
            name: 'Light',
            data: latestLightData,
            enableMouseTracking: false
        }]

    },
    // Add some life
    function (chart) {
        if (!chart.renderer.forExport) {
            setInterval(function () {
                var point = chart.series[0].points[0],
                    newVal,
                    inc = Math.round((Math.random() - 0.5) * 20);
                point.update(latestLightData);

            }, 3000);
        }
    });
}





function initializeHumidity() {

    $('#humidityContainer').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Humidity [%]'
        },
        pane: {
            startAngle: -130,
            endAngle: 130,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Humidity'
            },
            plotBands: [{
                from: 0,
                to: 20,
                color: '#DF5353' // blue
            }, {
                from: 20,
                to: 40,
                color: '#ffff00' // yellow
            }, {
                from: 40,
                to: 60,
                color: '#228b22' // green
            }, {
                from: 60,
                to: 80,
                color: '#ffff00' // yellow
            }, {
                from: 80,
                to: 100,
                color: '#DF5353' // red
            }]
        },

        series: [{
            name: 'Humidity',
            data: latestHumidityData,
            enableMouseTracking: false
        }]

    },
    // Add some life
    function (chart) {
        if (!chart.renderer.forExport) {
            setInterval(function () {
                var point = chart.series[0].points[0],
                    newVal,
                    inc = Math.round((Math.random() - 0.5) * 20);
                point.update(latestHumidityData);

            }, 3000);
        }
    });
}






function getLatestData() {

      $.ajax({
      type: "POST",
      url: url,
      contentType: "text/xml",
      dataType: "xml",
      data: xmlGetData,
      success: function(data) {
        text="";

        $(data).find("InfoItem").each(function() {

          if($(this).attr('name')=='temperature') {
            latestTempData = [(parseFloat($(this).text()))];
          } else if($(this).attr('name')=='light') {
            latestLightData = [(parseFloat($(this).text()))];
          } else if($(this).attr('name')=='humidity') {
            latestHumidityData = [(parseFloat($(this).text()))];
          } else if($(this).attr('name')=='Plug2') {
            latestPlugState = $(this).text();
          }

        });

        console.log("light: "+latestLightData);
        console.log("temperature: "+latestTempData);
        console.log("humidity: "+latestHumidityData);
        console.log("plugState: "+latestPlugState);
        console.log("========================");

        //update plug ui
        if(latestPlugState=='0') {
            $('#switchBtn').html('Turn ON');
            $("#switchBtn").val("1");
            $('#currentPlugState').css('background-color', 'red');
            $('#currentPlugState').html('Current state: OFF');

        } else {
            $('#switchBtn').html('Turn OFF');
            $("#switchBtn").val("0");
            $('#currentPlugState').css('background-color', 'green');
            $('#currentPlugState').html('Current state: ON');
        }

        $('#switchBtn').removeClass('disabled');

        recall();

      },
      error: function(data) {
        console.log(data);
        recall();
      }
    });

}



function switchPlug (newVal) {

    console.error("NEW SWITCH VALUE: "+newVal);

    $.ajax({
      type: "POST",
      url: url,
      contentType: "text/xml",
      dataType: "xml",
      data: xmlPostData1+newVal+xmlPostData2,
      success: function(data) {

        console.log("SUCCESS!");
        $('#currentPlugState').html('');
        $('#switchBtn').html('loading...');
        $('#switchBtn').addClass('disabled');

      }

    });

}


//call getLatestData() after 5 seconds
function recall() {
  setTimeout(function() {
    getLatestData();
  }, 5000);
}



function formatUnixTime(unix_timestamp) {
    // create a new javascript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds
  var date = new Date(unix_timestamp*1000);
  // hours part from the timestamp
  var hours = date.getHours();
  // minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}

