<?php

require_once(__DIR__ . '/../app/core.php');
require_once(__DIR__ . '/../app/controllers.php');


$routes = [
    ['path' => '/^\/$/', 'method' => 'GET', 'controller' => 'index'],
    ['path' => '/^\/media$/', 'method' => 'GET', 'controller' => 'getPosts'],
    ['path' => '/^\/media$/', 'method' => 'POST', 'controller' => 'addPost'],
    ['path' => '/^\/media\/(\d+)$/', 'method' => 'GET', 'controller' => 'getPost'],
    ['path' => '/^\/media\/(\d+)$/', 'method' => 'PUT', 'controller' => 'updatePost'],
    ['path' => '/^\/media\/(\d+)$/', 'method' => 'DELETE', 'controller' => 'deletePost'],
];


$path = strstr($_SERVER['REQUEST_URI'], '?', true) ?: $_SERVER['REQUEST_URI'];
$path = str_replace(CONFIG['app']['uri_prefix'], '', $path);
$method = $_SERVER["REQUEST_METHOD"];


$path_matched = false;

foreach ($routes as $route) {
    if(preg_match($route['path'], $path, $matches)) {
        $path_matched = true;

        $matches[0] = $pdo;
        if ($route['method'] === $method) {
            call_user_func_array($route['controller'], $matches);
            exit;
        }
    }
}

if ($path_matched) {
    error(405, "$method method is not allowed on this resource.");
} else {
    error(404, 'The requested URL was not found on this server.');
}
