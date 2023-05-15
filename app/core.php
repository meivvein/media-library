<?php

require_once(__DIR__ . '/../app/functions.php');

DEFINE('CONFIG', parse_ini_file(__DIR__ . '/../app/config.ini', true));

$pdo = getPDO(CONFIG['database']);

if ($pdo === null) {
    error(500,  'Databese connection failed.');
}
