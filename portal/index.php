<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Welfare Portal</title>
    <link href="../static/style/portal.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
    <script type="module" src="../static/js/portal/portal.js"></script>
</head>

<body>
    <div>

        <div id="header">
            <div class="version">
                <a @click="changeLanguage('zh')"> 純文字中文版</a>
                &nbsp;|&nbsp;
                <a @click="changeLanguage('en')">English Text Version</a>
            </div>

            <div class="size">
                {{lang.fontSize}}
                <span class="option" @click="changeFontSize(1.25)"><a>{{lang.large}}</a></span>
                <span class="option" @click="changeFontSize(1)"> <a>{{lang.medium}}</a></span>
                <span class="option" @click="changeFontSize(0.75)"> <a>{{lang.small}}</a></span>
            </div>

            <div class="nav">
                <a @click="portalApp.forwardPage('search')"> {{lang.search}}</a>&nbsp;||&nbsp;
                <a @click="portalApp.forwardPage('navigate')">{{lang.navigate}}</a>&nbsp;||&nbsp;
                <a @click="portalApp.forwardPage('about-us')">{{lang.aboutUs}}</a>
            </div>
        </div>
        <hr>


        <?php
        include_once './pages/portal-navigate.html';
        include_once './pages/portal-search.html';
        include_once './pages/portal-about-us.html';
        ?>

    </div>
</body>



</html>