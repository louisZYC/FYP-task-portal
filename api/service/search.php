

<?php
include_once '../../php/necessary.php';
include_once '../../php/database.php';
/**
 * [
 *  {
 *      uuid,
 *      nosu:{zh,en},
 *      nosp:{zh,en} ,
 *      address:{zh,en}
 *      tel
 *      fax
 *      href  
 *  }
 * ]
 */
try {

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $keyword = $data['keyword'];
    $allServices = readJsonDataFile('/data/ngoinfo/services/services.json', true, "{}");

    $rtn = array();

    foreach ($allServices as $service) {
        if (strpos($service['nosu']['zh'], $keyword) !== false) {
            $rtn[] = $service;
            continue;
        }

        if (strpos($service['nosu']['en'], $keyword) !== false) {
            $rtn[] = $service;
            continue;
        }

        if (strpos($service['nosp']['zh'], $keyword) !== false) {
            $rtn[] = $service;
            continue;
        }

        if (strpos($service['nosp']['en'], $keyword) !== false) {
            $rtn[] = $service;
            continue;
        }

        if (strpos($service['address']['zh'], $keyword) !== false) {
            $rtn[] = $service;
            continue;
        }

        if (strpos($service['address']['en'], $keyword) !== false) {
            $rtn[] = $service;
            continue;
        }
    }
    // debug($rtn);
    echo json_encode($rtn, JSON_UNESCAPED_UNICODE);;
} catch (Exception $err) {
    die500();
}
