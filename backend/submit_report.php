<?php
// Database connection
include "db.php";

$conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $location = $_POST['location'];
    $issueType = $_POST['issueType'];
    $description = $_POST['description'];
    $agency = $_POST['agency'];
    $officialName = $_POST['officialName'];
    $lat = $_POST['lat'];
    $lon = $_POST['lon'];

    // Handle image uploads
    $images = [];
    for ($i = 0; $i < 3; $i++) {
        if (isset($_FILES["image$i"])) {
            $fileName = $_FILES["image$i"]['name'];
            $fileTmpName = $_FILES["image$i"]['tmp_name'];
            $targetDir = "uploads/";
            $targetFile = $targetDir . basename($fileName);

            if (move_uploaded_file($fileTmpName, $targetFile)) {
                $images[] = $targetFile;  // Store file path
            }
        }
    }

    // Insert report into database
    $stmt = $conn->prepare("INSERT INTO CIT_reports (location, issue_type, description, agency, official_name, latitude, longitude, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$location, $issueType, $description, $agency, $officialName, $lat, $lon, json_encode($images)]);

    echo json_encode(['status' => 'success']);
}
