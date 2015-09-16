url = "http://130.233.193.113:8080/";
dataType = "application/xml";
xml = 
      '<?xml version="1.0"?>' +
        '<omi:omiEnvelope xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" xmlns:omi="omi.xsd" version="1.0" ttl="-1">' +
          '<read xmlns="omi.xsd">' +
            '<requestID>6</requestID>' +
          '</read>' +
        '</omi:omiEnvelope>';

var tempData=[];
var lightData=[];
var humidityData=[];
var labels = [];


jQuery(document).ready(function($) {

    currentUrl = window.location.host;
    
    $('#targetService').val(currentUrl);
    //load latest sensor data
    getLatestData();

});



function getLatestData() {
      
      $.ajax({
      type: "POST",
      url: url,
      contentType: "text/xml",
      dataType: "xml",
      data: xml,
      success: function(data) {
        text="";

        
        if($(data).find("InfoItem").length!=3) {
          console.error('dataset incomplete. Ignoring...');
          recall();
          return;
        } 


        $(data).find("InfoItem").each(function() {

          if($(this).attr('name')=='temperature') {
            $(this).find('value').each(function() {
              tempData.push(parseFloat(Math.round($(this).text()).toFixed(1)));
              labels.push(formatUnixTime($(this).attr('unixTime')));

            });
          } else if($(this).attr('name')=='light') {
            $(this).find("value").each(function() {
              lightData.push(parseFloat(Math.round($(this).text()).toFixed(1)));
            });

          } else if($(this).attr('name')=='humidity') {
            $(this).find("value").each(function() {
              humidityData.push(parseFloat(Math.round($(this).text()).toFixed(1)));
            });
          }

        });

        if(labels.length>5) {
          labels.shift();
          lightData.shift();
          tempData.shift();
          humidityData.shift();
        }

        console.log(lightData);
        console.log(tempData);
        console.log(humidityData);



        $('#container').highcharts({
                title: {
                    text: 'Monthly Average Temperature',
                    x: -20 //center
                },
/*                
                subtitle: {
                    text: 'Source: WorldClimate.com',
                    x: -20
                },
*/                
                xAxis: {
                    categories: labels
                },
                yAxis: {
/*                  
                    title: {
                        text: 'Temperature (°C)'
                    },
*/                    
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Humidity',
                    data: humidityData
                }, {
                    name: 'Temperature',
                    data: tempData
                }, {
                    name: 'light',
                    data: lightData
                }]
            });

        recall();  
        
      },
      error: function(data) {
        console.log(data);
        recall();
      }
    });


 

}


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




