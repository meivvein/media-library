<?php

function getPDO(array $db_config): PDO | null
{
    $hostname = $db_config["hostname"];
    $username = $db_config["username"];
    $password = $db_config["password"];
    $database = $db_config["database"];

    try {
        $dsn = "mysql:host=$hostname;dbname=$database;charset=utf8";
        $options = [
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        return new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
        // TODO
        // exit("Connection failed: " . $e->getMessage());
        return null;
    }
}


function loadView(string $view, array $context = []): void
{
    $file = __DIR__ . "/../views/$view";
    if (file_exists($file)) {
        $html = file_get_contents($file);
        $html = preg_replace('/\{\%\s*address\s*\%\}/', CONFIG['app']['address'] . CONFIG['app']['uri_prefix'], $html);
        preg_match_all('/\{\{\s*([^\s\}]+)\s*\}\}/', $html, $matches);
        foreach ($matches[1] as $key) {
            if (isset($context[$key])) {
                $html = preg_replace('/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/', $context[$key], $html);
            } else {
                $html = preg_replace('/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/', '', $html);
            }
        }
        echo($html);
    } else {
        error(500,  "'$view' view does not exist.");
    }
}


function JSONResponse(int $status, array | null $data, string $message = ''): void
{
    $response['status'] = $status;
    if ($data !== null) {
        $response['body'] = $data;
    }
    if ($message !== '') {
        $response['message'] = $message;
    }
    http_response_code($status);
    header('Content-Type: application/json');
    echo(json_encode($response));
    return;
}


function error(int $status, string $message): never
{
    $error_codes = [
        400 => 'Bad Request',
        401 => 'Unauthorized',
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        408 => 'Request Timeout',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        413 => 'Payload Too Large',
        414 => 'URI Too Long',
        415 => 'Unsupported Media Type',
        416 => 'Range Not Satisfiable',
        417 => 'Expectation Failed',
        418 => "I'm a teapot",
        421 => 'Misdirected Request',
        422 => 'Unprocessable Content',
        423 => 'Locked',
        424 => 'Failed Dependency',
        425 => 'Too Early',
        426 => 'Upgrade Required',
        428 => 'Precondition Required',
        429 => 'Too Many Requests',
        431 => 'Request Header Fields Too Large',
        451 => 'Unavailable For Legal Reasons',
        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Timeout',
        505 => 'HTTP Version Not Supported',
        506 => 'Variant Also Negotiates',
        507 => 'Insufficient Storage',
        508 => 'Loop Detected',
        510 => 'Not Extended',
        511 => 'Network Authentication Required',
    ];
    http_response_code($status);
    loadView('error.html', [
        'status' => $status,
        'title' => $error_codes[$status],
        'message' => $message,
        'address' => $_SERVER['SERVER_SIGNATURE'],
    ]);
    exit;
}