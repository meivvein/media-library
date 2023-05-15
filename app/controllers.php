<?php

function index()
{
    loadView('index.html');
}

function getPost(PDO $pdo, mixed $id)
{
    $id = intval($id);
    $stmt = $pdo->prepare('SELECT * FROM `media` WHERE `id` = :id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        JSONResponse(200, $result);
    } else {
        JSONResponse(404, null, 'Not Found');
    }
}

function getPosts(PDO $pdo)
{
    
    $cursor = isset($_GET['cursor']) ? intval($_GET['cursor']) : 1;
    if ($cursor <= 0) {
        JSONResponse(400, null, 'Bad Request');
        exit;
    }
    if (isset($_GET['batch']) && intval($_GET['batch']) > 0) {
        $batch_size = intval($_GET['batch']);
    } else {
        $batch_size = CONFIG['API']['default_batch_size'];
    }
    $stmt = $pdo->prepare('SELECT * FROM `media` WHERE `id` >= :cursor ORDER BY `id` ASC LIMIT :batch_size');
    $stmt->bindValue(':cursor', $cursor, PDO::PARAM_INT);
    $stmt->bindValue(':batch_size', $batch_size, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {
        JSONResponse(200, $result);
    } else {
        JSONResponse(204, null, 'No Content');
    }
}

function addPost(PDO $pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['type']) || !isset($data['title']) || !isset($data['author'])) {
        JSONResponse(400, null, 'Bad Request');
        exit;
    }
    $stmt = $pdo->prepare('INSERT INTO `media` (`type`, `title`, `author`, `image`) VALUES (:type, :title, :author, :image)');
    $stmt->bindValue(':type', $data['type']);
    $stmt->bindValue(':title', $data['title']);
    $stmt->bindValue(':author', $data['author']);
    $stmt->bindValue(':image', isset($data['image']) ? $data['image'] : null);
    try {
        $stmt->execute();
    } catch (PDOException $e) {
        if ($e->errorInfo[1] !== 1062) {
            throw $e;
        }
        JSONResponse(409, null, 'Conflict');
        exit;
    }
    $stmt = $pdo->prepare('SELECT * FROM `media` WHERE `id` = :id');
    $stmt->bindValue(':id', $pdo->lastInsertId(), PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    JSONResponse(201, $result, 'Created');
}

function updatePost(PDO $pdo, mixed $id)
{
    $id = intval($id);
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['type']) && !isset($data['title']) && !isset($data['author']) && !isset($data['image'])) {
        JSONResponse(400, null, 'Bad Request');
        exit;
    }
    $stmt = $pdo->prepare('SELECT * FROM `media` WHERE `id` = :id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
        JSONResponse(404, null, 'Not Found');
        exit;
    }
    $stmt = $pdo->prepare('UPDATE `media` SET `type` = :type, `title` = :title, `author` = :author, `image` = :image WHERE `id` = :id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->bindValue(':type', isset($data['type']) ? $data['type'] : $result['type']);
    $stmt->bindValue(':title', isset($data['title']) ? $data['title'] : $result['title']);
    $stmt->bindValue(':author', isset($data['author']) ? $data['author'] : $result['author']);
    $stmt->bindValue(':image', isset($data['image']) ? $data['image'] : $result['image']);
    try {
        $stmt->execute();
    } catch (PDOException $e) {
        if ($e->errorInfo[1] !== 1062) {
            throw $e;
        }
        JSONResponse(409, null, 'Conflict');
        exit;
    }
    $stmt = $pdo->prepare('SELECT * FROM `media` WHERE `id` = :id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    JSONResponse(200, $result, 'OK');
}

function deletePost(PDO $pdo, mixed $id)
{
    $id = intval($id);
    $stmt = $pdo->prepare('SELECT * FROM `media` WHERE `id` = :id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
        JSONResponse(404, null, 'Not Found');
        exit;
    }
    $stmt = $pdo->prepare('DELETE FROM `media` WHERE `id` = :id');
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    JSONResponse(204, null, 'No Content');
}
