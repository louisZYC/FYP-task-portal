<?php

include_once 'necessary.php';

$conn = mysqli_connect('localhost', 'root', '', 'fypdb') or die500();
$TABLE_SEARCH_HISTORY = 'searchhistory';
$TABLE_SEARCH_REF = "searchref";
$TBALE_KEYWORD = "keyword";
$TABLE_KEYWORD_REF = "keywordref";

