<?php
$servername = "localhost";
$username = "ademola";
$password = "*****";
$dbname = "cit";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
