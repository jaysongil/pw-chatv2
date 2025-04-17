<?php
// File: server/upload.php
// Version: v1.0
// Created: 2025-04-17 – Handles file uploads for chat messages
// Created by: Jayson Gilbertson

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Setup destination folder
$uploadDir = __DIR__ . '/../uploads/messages/';
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

// ✅ Basic file validation
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
  echo json_encode(['success' => false, 'error' => 'Upload failed']);
  exit;
}

$filename = time() . '_' . preg_replace('/[^a-zA-Z0-9.\-_]/', '', basename($_FILES['file']['name']));
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
  echo json_encode([
    'success' => true,
    'path' => '/uploads/messages/' . $filename
  ]);
} else {
  echo json_encode(['success' => false, 'error' => 'File move failed']);
}
?>
