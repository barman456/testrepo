<!--
You are free to copy and use this sample in accordance with the terms of the
Apache license (http://www.apache.org/licenses/LICENSE-2.0.html)
-->

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <title>Google AJAX Search API Sample</title>
    <script src="http://www.google.com/jsapi?key=AIzaSyA5m1Nc8ws2BbmPRwKu5gFradvD_hgq6G0" type="text/javascript"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/javascript">
    /*
    *  How to setup a textareaereed Direct  ////// ****** Al that allows Transliteration from English to Hindi.
    */
    
    google.load("language", "1");
    
    function intialize() {
     $('document').ready(function(){
       $('#transliterateTextarea').live('keypress', function(){
            var string1 = $(this).val();
            //alert(string1);
            google.language.transliterate([string1], "en", "hi", function(result) {
                if (!result.error) {
                  var container = document.getElementById("display");
                  if (result.transliterations && result.transliterations.length > 0 &&
                    result.transliterations[0].transliteratedWords.length > 0) {
                    container.innerHTML = result.transliterations[0].transliteratedWords[0];
                  }
                }
            });
         });
      });
    }
    
    google.setOnLoadCallback(intialize);
    
    </script>
  </head>
  <body style="font-family: Arial;border: 0 none;">
    <div id="source_content" style="float:left;">
        <h1>Type in English</h1>  
          <textarea cols="70" rows="5" id="transliterateTextarea"></textarea>
    </div>
    <div id="destination_content" style="float:right;">
       <h1>Your Result</h1> 
        <textarea cols="70" rows="5" id="display"></textarea>
    </div>
  </body>
</html>
