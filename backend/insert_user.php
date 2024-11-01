<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}
// Include DB connection
require 'db.php'; // Assuming db.php contains the connection logic

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize user inputs
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $location = htmlspecialchars($_POST['location']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $account_type = $_POST['account_type'];
    $agency_name = isset($_POST['agency_name']) ? htmlspecialchars($_POST['agency_name']) : null;
    
    // Insert user data into the CIT_users table
    $stmt = $db->prepare("INSERT INTO CIT_users (name, email, location, password, account_type, agency_name, pay_status) VALUES (?, ?, ?, ?, ?, ?, ?)");

    // Set default pay_status to 'unpaid' or adjust as needed
    $pay_status = 'unpaid'; 

    // Bind parameters to the query
    $stmt->bind_param("sssssss", $name, $email, $location, $password, $account_type, $agency_name, $pay_status);

    // Execute the statement and check if the insertion was successful
    if ($stmt->execute()) {
        echo "Registration successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement
    $stmt->close();

    // Close the DB connection
    $db->close();
}
