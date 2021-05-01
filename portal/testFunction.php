<?php
include_once '../php/necessary.php';

$filePath =  '/data/ngoinfo/services/haha.json';
$content = 'haha';

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return substr($haystack, 0, $length) === $needle;
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if (!$length) {
        return true;
    }
    return substr($haystack, -$length) === $needle;
}

clog(endsWith('ab','b'));