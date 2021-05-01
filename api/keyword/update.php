<?php
include_once '../../php/necessary.php';
include_once '../../php/database.php';


$TABLES = array('searchHistory', 'searchRef');

$rtn = array("searchHistory" => array(), "searchRef" => array());

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


$searchHistory = $rtn['searchHistory'];
$searchRef = $rtn['searchRef'];

//mutate $searchHistroy & $searchRef
while (count($searchRef)) {
    $pop = array_pop($searchRef);
    foreach ($searchHistory as &$search)
        if ($search['search_id'] == $pop['search_id'])
            $search['ref'][] = (object)[
                'service_id' => $pop['service_id'],
                'priority' => $pop['priority']
            ];
}


usort($searchHistory, function ($a, $b) {
    return strcmp($a['content'], $b['content']);
});

$data = array(); // $data to be inserted to database
$data_tmp = null;
while (count($searchHistory)) {


    $popObj = array_pop($searchHistory);

    array_walk($popObj['ref'], function ($item, $key) {
        $item->score = intval(32 / $item->priority);  //  socre = 32 / priority
        unset($item->priority);
    });

    if ($data_tmp == null) {
        $data_tmp = array(
            "kw_id" => randomID(30),
            "name" => $popObj['content'],
            "ref" => $popObj['ref']
        );
        if (count($searchHistory) == 0)
            $data[] = $data_tmp; // at the end, move the temp field to database data
        continue;
    }

    //existing data 
    if ($data_tmp['name'] == $popObj['content']) {
        $data_tmp['ref'] =  array_merge($data_tmp['ref'], $popObj['ref']);
        if (count($searchHistory) == 0)
            $data[] = $data_tmp; // at the end, move the temp field to database data
        continue;
    }

    //new data found
    if ($data_tmp['name'] != $popObj['content']) {
        $data[] = $data_tmp; //move the temp field to database data
        $data_tmp = array(   //move to temp field
            'kw_id' => randomID(30),
            'name' => $popObj['content'],
            'ref' => $popObj['ref']
        );
        if (count($searchHistory) == 0)
            $data[] = $data_tmp; // at the end, move the temp field to database data
        continue;
    }
}


$keywords = array();
while (count($data)) {
    $pop = array_pop($data);

    usort($pop['ref'], function ($a, $b) {
        return strcmp($a->service_id, $b->service_id);
    }); //group data's services by service_id and sum the toatal score for each group       
    $ref = array_reduce($pop['ref'], function ($acc, $cur) {
        if (count($acc) == 0) {
            $acc[] = $cur;
            return $acc;
        }

        if ($acc[count($acc) - 1]->service_id == $cur->service_id) {
            $acc[count($acc) - 1]->score += $cur->score;
        } else {
            $acc[] = $cur;
        }
        return $acc;
    }, array());
    $keywords[] = array(
        'kw_id' => $pop['kw_id'],
        'name' => $pop['name'],
        'ref' => $ref
    );
}

try {
    //DELTE
    $conn->autocommit(false);
    $stmt = $conn->prepare("DELETE FROM `keywordRef`");
    $stmt->execute();
    $stmt = $conn->prepare("DELETE FROM `keyword`");
    $stmt->execute();
    // INSERT keywords to db
    foreach ($keywords as $keyword) {
        $stmt1 = $conn->prepare('INSERT into `keyword` values (?,?)');
        $stmt1->bind_param('ss', $keyword['kw_id'], $keyword['name']);
        $stmt1->execute();

        foreach ($keyword['ref'] as $ref) {
            $stmt2 = $conn->prepare('INSERT into `keywordRef` values (?,?,?)');
            $stmt2->bind_param('ssi', $keyword['kw_id'], $ref->service_id, $ref->score);
            $stmt2->execute();
        }
    }

    //EXECUTE
    if (!$conn->commit()) throw new Exception();
    $conn->autocommit(true);
} catch (Exception $err) {
    die500();
}
