<?php
// Set header agar output dikenali sebagai JSON
header('Content-Type: application/json; charset=utf-8');

// Konfigurasi Keamanan & Repository
$secret_token = 'joss'; // Ubah sesuai keinginan
$repository_dir = '/usr/share/nginx/html/Wedding'; // Path folder project di dalam container

// 1. Validasi Token dari URL (?token=...)
if (!isset($_GET['token']) || $_GET['token'] !== $secret_token) {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'code' => 403,
        'message' => 'Akses ditolak: Token tidak valid atau tidak disertakan.'
    ], JSON_PRETTY_PRINT);
    exit;
}

// 2. Cek apakah direktori repository valid
if (!is_dir($repository_dir)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'code' => 500,
        'message' => 'Direktori repository tidak ditemukan.'
    ], JSON_PRETTY_PRINT);
    exit;
}

// 3. Jalankan git pull dan tangkap exit code serta output-nya
$output = [];
$exit_code = 0;
, $output, $exit_code);
$command = "cd " . escapeshellarg($repository_dir) . " && git config --global --add safe.directory " . escapeshellarg($repository_dir) . " && git pull 2>&1";
exec($command, $output, $exit_code);

// 4. Berikan respons JSON berdasarkan hasil eksekusi
if ($exit_code === 0) {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'code' => 200,
        'message' => 'Git pull berhasil dieksekusi.',
        'output' => $output
    ], JSON_PRETTY_PRINT);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'code' => 500,
        'message' => 'Git pull gagal dieksekusi.',
        'output' => $output
    ], JSON_PRETTY_PRINT);
}
