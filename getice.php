<?php
$curl = curl_init();
curl_setopt_array($curl, array(
     CURLOPT_RETURNTRANSFER => 1,
     CURLOPT_URL => 'https://global.xirsys.net/_turn/WoodenWheels',
     CURLOPT_USERPWD => "zonakyle:5cc95db4-9dc0-11ea-8d27-0242ac150003",
     CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
     CURLOPT_CUSTOMREQUEST => 'PUT'
));
$resp = curl_exec($curl);
curl_close($curl);
echo($resp);
?>