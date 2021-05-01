<?php
include_once '../../php/necessary.php';
include_once '../../php/database.php';

// $TABLE_SEARCH_HISTORY = 'searchhistory';
// $TABLE_SEARCH_REF = "searchref";
// $TBALE_KEYWORD = "keyword";
// $TABLE_KEYWORD_REF = "keywordref";

$TABLES = array('keyword', 'keywordref');
$rtn = array();

$query = '';
foreach ($TABLES as $table)
    $query .= "SELECT * FROM `${table}`;";

$conn->multi_query($query);

foreach ($TABLES as $table) {
    $resultA = $conn->store_result();

    while ($target = $resultA->fetch_assoc()) {
        $rtn[$table][] = $target;
    }

    $resultA->free();

    if ($conn->more_results() == false) break;

    $conn->next_result();
}


echo json_encode($rtn,JSON_UNESCAPED_UNICODE);