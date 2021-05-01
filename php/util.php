<?php

function debug($var)
{
    echo '<pre>';
    echo var_dump($var);
    echo '</pre>';
}

function randomID(int $length)
{
    return bin2hex(random_bytes($length));
}

function die400()
{
    header("HTTP/1.0 400 Bad Request");
    die('🙄️');
}

function die401()
{
    header("HTTP/1.0 401 Unauthorized");
    die('🧐️');
}

function die404()
{
    header("HTTP/1.0 404 Not Found");
    die('🤣️');
}

function die500()
{
    header("HTTP/1.0 500 Internal Server Error");
    die('😥️');
}