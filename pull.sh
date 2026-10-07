<?php
// Konfigurasi Keamanan & Repository
$secret_token = 'joss'; // Ubah sesuai keinginan
$repository_dir = '/var/www/html/nama-project-anda'; // Sesuaikan path folder project

// Validasi Token dari URL (?token=...)
if (!isset($_GET['token']) || $_GET['token'] !== $secret_token) {
    http_response_code(403);
    die("Akses ditolak.");
}

// Jalankan git pull dan gabungkan error output (2>&1)
$output = shell_exec("cd " . escapeshellarg($repository_dir) . " && git pull 2>&1");

// Tampilkan hasil output
header('Content-Type: text/plain; charset=utf-8');
echo $output;
