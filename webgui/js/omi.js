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
              tempData.push(Math.round($(this).text()).toFixed(1));
              labels.push($(this).attr('unixTime'));

            });
          } else if($(this).attr('name')=='light') {
            $(this).find("value").each(function() {
              lightData.push(Math.round($(this).text()).toFixed(1));
            });

          } else if($(this).attr('name')=='humidity') {
            $(this).find("value").each(function() {
              humidityData.push(Math.round($(this).text()).toFixed(1));
            });
          }

        });

        if(labels.length>5) {
          labels.shift();
          lightData.shift();
          tempData.shift();
          humidityData.shift();
        }

        var options = {
            //width: 300,
            height: 300
        };

        new Chartist.Line('.ct-chart', {
            labels: labels,
            series: [tempData, lightData, humidityData]
          } ,options
        );
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





