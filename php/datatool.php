<?php

function readDataFile($path)
{
    global $DOCUMENT_ROOT;
    $filePath = $DOCUMENT_ROOT . $path;
    if (!file_exists($filePath)) {
        return 'file path not exists';
    }

    $size = filesize($DOCUMENT_ROOT . $path);
    if ($size !== 0) {
        $fp = fopen($DOCUMENT_ROOT . $path, "r"); // assert file open
        if ($fp == false)
            throw new Exception('fopen failed');
        $rtn = fread($fp, $size);
        fclose($fp);
        return $rtn;
    }
    return '';
}

function readJsonDataFile($path, $assoc = false, $default = '{}')
{
    return json_decode(readDataFile($path) ?: $default, $assoc);
}

// function writeDataFile($path, $content)
// {
//     global $DOCUMENT_ROOT;

//     $MAX_FILE_SIZE = 134217728; //128MB


//     if (!($fp = fopen($DOCUMENT_ROOT . $path, "w"))) // open or create a file if does not exists
//         return false;

//     $chunkRead = strlen($content);

//     if ($chunkRead > $MAX_FILE_SIZE) {
//         fclose($fp);
//         return false;
//     }

//     $blockWrite = fwrite($fp, $content);
//     fclose($fp);

//     return true;
// }
