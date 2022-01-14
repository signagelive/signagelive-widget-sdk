var Widget =
{
  author : "",
  description : "",
  name : "",
  shortName : "",
  version : "",
  id : "",
  authorEmail : "",
  authorHref : "",
  preferences : null,
  height : 1920,
  width : 1080  
}

Widget.preferences =
{
  getItem : null,
  setItem : null
}
Widget.preferences.getItem = function(key)
{
  return this[key];
}

Widget.preferences.setItem = function(key,value)
{
  this[key] = value;
}

function loadXMLDoc(filename)
{
  if (window.XMLHttpRequest)
  {
    xhttp=new XMLHttpRequest();
  }
  else // code for IE5 and IE6
  {
    xhttp= new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xhttp.open("GET",filename);
  xhttp.send();
  xhttp.onload = function()
  {
        loadWidgetPreferences(xhttp.responseXML);
        window.dispatchEvent(new CustomEvent('widget-init'));
       // loadCSSDoc("./css/style.css")
  }
}

function loadWidgetPreferences(xmlDoc)
{
  //Get the widget width and height
    var widgetNode=xmlDoc.getElementsByTagName("widget")[0];
    Widget.width = parseInt(widgetNode.attributes["width"].value);
    Widget.height = parseInt(widgetNode.attributes["height"].value);
   
    //Get the widget name
    var nameNode = xmlDoc.getElementsByTagName("name")[0];
    Widget.name = nameNode.textContent;
   
    if(nameNode.attributes["short"] != null)
    { 
    Widget.shortName = nameNode.attributes["short"] = value;
    }
   
    //Get the widget description
    var descriptionNode=xmlDoc.getElementsByTagName("description")[0];
    Widget.description = descriptionNode.textContent;
   
   //Load the preferences
    var preferences = xmlDoc.getElementsByTagName("preference");
   
    if(preferences != null)
    {
    for (var i = 0; i < preferences.length; i++) {
      Widget.preferences.setItem(preferences[i].attributes["name"].value,preferences[i].attributes["value"].value);
    }
  }
}

function loadCSSDoc(filename)
{
  if (window.XMLHttpRequest)
  {
    xhttp=new XMLHttpRequest();
  }
  else // code for IE5 and IE6
  {
    xhttp= new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xhttp.open("GET",filename);
  xhttp.send();
  xhttp.onload = function()
  {
    processCSS(xhttp.response);
    window.dispatchEvent(new CustomEvent('widget-init'));
  }
}

function processCSS(cssText) {
  var index = cssText.indexOf("}");

  var viewportHeight = window.innerHeight || 
                     document.documentElement.clientHeight || 
                     document.body.clientHeight;

  var viewportWidth = window.innerWidth || 
                     document.documentElement.clientWidth || 
                     document.body.clientWidth;

  var vwValue = viewportWidth / 100;
  var vhValue = viewportHeight / 100;

  // Iterate through CSS and check each rule for anything which contains vw or vh sizings

  // Do VW
  var newVWRules = "";
  while (index < cssText.length) {
    var cssRule = cssText.substr(0, index + 1);
    // check if rule contains vw or vh values
    if (cssRule.indexOf("vw") != -1) {
      var sIndex = 0;

      while (cssRule.indexOf("vw") != -1) {
        // Find the rules we need to override
        var wIndex = cssRule.indexOf("vw");

          var rule = cssRule.substr(0, wIndex);
          var i = rule.lastIndexOf(" ");

          var size = cssRule.substr(i, wIndex - i);

          if (size.indexOf("calc(") != -1) {
            var b = size.indexOf("(") + 1;
            size = size.substr(b, size.length - b);
          } else if (size.indexOf("(") != -1) {
            var b = size.indexOf("(") + 1;
            size = size.substr(b, size.length - b);
          }

          newVWRules = newVWRules + cssRule.substr(0, wIndex - size.length) + " " + (size*vwValue) + "px";

          cssRule = cssRule.substr(wIndex + 2);
          sIndex = wIndex + 2;
      }
      
      newVWRules = newVWRules + cssRule;

      //console.log(newVWRules);
    } else if (cssRule.indexOf("vh") != -1){
      newVWRules = newVWRules + cssRule;
    }

    cssText = cssText.substr(index + 1, cssText.length);

    index = cssText.indexOf("}");

    if (index == -1)
      index = cssText.length;
  }

  // Do VH
  var newRules = ""; index = 0;
    while (index < newVWRules.length) {
    var cssRule = newVWRules.substr(0, index + 1);
    // check if rule contains vw or vh values
    if (cssRule.indexOf("vh") != -1) {
      var sIndex = 0;

      while (cssRule.indexOf("vh") != -1) {
        // Find the rules we need to override
        var wIndex = cssRule.indexOf("vh");

          var rule = cssRule.substr(0, wIndex);
          var i = rule.lastIndexOf(" ");

          var size = cssRule.substr(i, wIndex - i);

          if (size.indexOf("calc(") != -1) {
            var b = size.indexOf("(") + 1;
            size = size.substr(b, size.length - b);
          } else if (size.indexOf("(") != -1) {
            var b = size.indexOf("(") + 1;
            size = size.substr(b, size.length - b);
          }

          newRules = newRules + cssRule.substr(0, wIndex - size.length) + " " + (size*vhValue) + "px";

          cssRule = cssRule.substr(wIndex + 2);
          sIndex = wIndex + 2;
      }

      //console.log(newRules);
    }

    newRules = newRules + cssRule;

    newVWRules = newVWRules.substr(index + 1, newVWRules.length);

    index = newVWRules.indexOf("}");

    if (index == -1)
      index = newVWRules.length;
  }

  newRules = newRules.replace(new RegExp("(\.\.\/images)", 'g'), "./images");
  //console.log(newRules);

  styleNode = document.createElement('style');
    styleNode.id = 'sl-widget-viewport';
    styleNode.innerHTML = newRules;
    document.head.appendChild(styleNode);

}

document.addEventListener('DOMContentLoaded', function()
{
    //This method does not currently support localisation in config files
    loadXMLDoc("./config.xml");

}, false);


