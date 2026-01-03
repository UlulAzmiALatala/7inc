<?php

// Test register akun admin
$ch = curl_init();

curl_setopt_array($ch, array(
  CURLOPT_URL => "http://localhost:8000/api/auth/register",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode(array(
    "name" => "Admin Test",
    "email" => "admin@test.com",
    "password" => "password123",
    "role" => "admin"
  )),
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Accept: application/json"
  ),
));

$response = curl_exec($ch);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo "Register Response:\n";
  echo json_encode(json_decode($response), JSON_PRETTY_PRINT);
  echo "\n\nNow try login with:\n";
  echo "Email: admin@test.com\n";
  echo "Password: password123\n";
}
?>
