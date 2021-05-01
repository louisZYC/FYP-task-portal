
<?php
include_once '../../php/necessary.php';
include_once '../../php/database.php';
// 
// $TABLE_SEARCH_HISTORY = 'searchhistory';
// $TABLE_SEARCH_REF = "searchref";
// $TBALE_KEYWORD = "keyword";
// $TABLE_KEYWORD_REF = "keywordref";
// $data = [
//  {
//             content: this.search_content,
//             ref: { id,keyword}
//  }
// ]
try {

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $conn->autocommit(FALSE);

    $stmt = $conn->prepare("INSERT INTO `$TABLE_SEARCH_HISTORY` values (?, ?)");
    $randomSearchId = randomID(32);
    $stmt->bind_param('ss', $randomSearchId,$data['content']);
    $stmt->execute();
    foreach ($data['ref'] as $id => $search) {
        //  ref: { id,keyword}
        $stmt1 = $conn->prepare("INSERT INTO `$TABLE_SEARCH_REF` values (?, ?, ?)");
        $stmt1->bind_param('ssi', $randomSearchId, $search['id'], $search['priority']);
        $stmt1->execute();
    }

    // EXECUTE
    if (!$conn->commit()) throw new Exception();

    $conn->autocommit(true);
} catch (Exception $err) {
    die500();
}
