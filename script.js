 var gistObjectArray
        var gistIndex = 0
        var randomLanguages = ["Swift", "JavaScript", "Java", "Kotlin", "Shell", "PowerShell", "C++", "C", "C#", "Ruby", "Dart", "Python", "Objective-C", "Perl", "Go", "PHP", "R", "Dockerfile", "CSS", "HTML", "TypeScript", "Haskell", "GLSL"]
        var rightLanguage
        var rightNumberIndex
        var points = 0
        $( document ).ready(function() {
        clearButtons()
        fetchGists()
        //button clicks
        $( ".btn-answers" ).click(function(event) {
        let chosenLanguage = $(event.target).text()
        if (chosenLanguage == rightLanguage){
        showSuccessUI(event.target)
        } else{
        showFailUI(event.target)
        }
        });
        $( ".btn-next" ).click(function(event) {
        gistIndex += 1
        refreshUI()
        });
        $( ".btn-retry" ).click(function(event) {
        gistIndex += 1
        points = 0
        refreshUI()
        });
        });
        var token1 = "ghp_tP7Za2ohf"
        var token2 = "DnQsC4KvAt4ql"
        var token3 = "192Q7esV0o6Uia"
        const client = axios.create({
        auth: {
        username: "mansoorshahsaid",
        password: token1+token2+token3
        },
        headers: {
        "Accept": "application/vnd.github.v3+json"
        }
        });
        var fetchCount = 0
        function fetchGists(){
        let random = getRandomInt(100)
        client.get('https://api.github.com/gists/public?page='+random)
        .then(function (response) {
        // handle success
        //console.log(response);
        let gistArrayJson = response["data"]
        gistObjectArray = findBestGists(gistArrayJson)
        if (gistObjectArray == null) {
        if (fetchCount <= 5) {
        fetchGists()
        count += 1
        } else {
        alert("Please reload this page. Something went wrong")
        }
        } else {
        fetchCount = 0
        resetVariables()
        //console.log(gistObjectArray)
        refreshUI()
        }
        })
        .catch(function (error) {
        // handle error
        console.log(error);
        })
        }
        function resetVariables() {
        gistIndex = 0
        rightLanguage = null
        rightNumberIndex = null
        }
        function refreshUI(){
        clearButtons()
       
        if (gistIndex == gistObjectArray.length) {
        fetchGists()
        return
        }
        let gistObject = gistObjectArray[gistIndex]
        rightLanguage = gistObject["language"]
        let randomAnswers = []
        while (randomAnswers.length != 4) {
        var randomAns = randomLanguages[getRandomInt(randomLanguages.length-1)]
        if (!randomAnswers.includes(randomAns) && randomAns != rightLanguage) {
        randomAnswers.push(randomAns)
        }
        }
        rightNumberIndex = getRandomInt(randomAnswers.length-1)
        randomAnswers[rightNumberIndex] = rightLanguage
        for (var i = 0; i < randomAnswers.length; i++) {
        $(".btn"+i).text(randomAnswers[i])
        }
        $( "#coding-block" ).empty();
        $(".lds-ripple").css("display", "none");
        postscribe('#coding-block', "<script class='gist-code' src='"+gistObject['embed_url']+"'><\/script>");
        }
        function clearButtons() {
        $(".btn-answers").removeClass("btn-success")
        $(".btn-answers").removeClass("btn-fail")
        $(".btn-answers").removeClass("disable")
        $(".bottom-container").addClass("hide")
        $(".bottom-container").addClass("hide")
        $(".btn-next").addClass("hide")
        $(".btn-retry").addClass("hide")
        $(".final-score-container").addClass("hide")
        $(".top-score-value").text(points)
        $(".final-score-value").text(points+" Points")
        }
        function showSuccessUI(buttonTapped) {
        $(buttonTapped).addClass( "btn-success" );
        points += 50
        $(".top-score-value").text(points)
        $(".bottom-container").removeClass("hide")
        $(".btn-next").removeClass("hide")
        $(".btn-retry").addClass("hide")
        $(".final-score-container").addClass("hide")
        $(".btn-answers").addClass("disable")
        }
        function showFailUI(buttonTapped) {
        $(buttonTapped).addClass( "btn-fail" );
        $(".btn"+rightNumberIndex).addClass( "btn-success" )
        $(".final-score-value").text(points+" Points")
        $(".bottom-container").removeClass("hide")
        $(".btn-next").addClass("hide")
        $(".btn-retry").removeClass("hide")
        $(".final-score-container").removeClass("hide")
        $(".btn-answers").addClass("disable")
        }
        function findBestGists(gistArrayJson){
        //gistArrayJson is an array of dictionaries
        var gistObjectArray = []
        for (var i = 0; i < gistArrayJson.length; i++){
        let gistJson = gistArrayJson[i]
        let htmlUrl = gistJson["html_url"]
        let files = gistJson["files"]
        let firstFile = files[Object.keys(files)[0]]
        let secondFile = files[Object.keys(files)[1]]
       
        if (firstFile == undefined || secondFile != undefined) {
        continue;
        }
        let size = firstFile["size"]
        let language = firstFile["language"]
        //   console.log(gistJson)
        //   console.log(firstFile)
        //   console.log(secondFile)
        if (!isValidLanguage(language)) {
        continue;
        } else {
        var gistObject = {}
        gistObject["embed_url"] = htmlUrl+".js"
        gistObject["language"] = language
        gistObjectArray.push(gistObject)
        }
        }
        if (gistObjectArray.length != 0) {
        return gistObjectArray
        } else {
        return null
        }
        }
        function isValidLanguage(language) {
        switch (language){
        case null:
        case "Markdown":
        case "JSON":
        case "Text":
        case "Ignore List":
        case "XML":
        case "Jupyter Notebook":
        case "CSV":
        case "Maven POM":
        case "YAML":
        case "AutoHotkey":
        case "TSV":
        case "reStructuredText":
        case "VCL":
        case "Diff":
        case "TeX":
        case "TOML":
        case "Windows Registry Entries":
        case "SVG":
        case "Ballerina":
        case "Org":
        return false
        default:
        return true
        }
        }
        function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
        }
