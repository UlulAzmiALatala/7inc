<?php

// Test login dengan credentials yang tadi register
$ch = curl_init();

curl_setopt_array($ch, array(
  CURLOPT_URL => "http://127.0.0.1:8000/api/auth/login",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode(array(
    "email" => "admin@test.com",
    "password" => "password123"
  )),
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Accept: application/json"
  ),
));

$response = curl_exec($ch);
$err = curl_error($ch);
$info = curl_getinfo($ch);

curl_close($ch);

echo "Status Code: " . $info['http_code'] . "\n";
echo "URL: " . $info['url'] . "\n";
echo "\n";

if ($err) {
  echo "cURL Error: " . $err;
} else {
  echo "Login Response:\n";
  echo json_encode(json_decode($response), JSON_PRETTY_PRINT);
}
?>
