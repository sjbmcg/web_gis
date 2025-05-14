<?php
header('Content-Type: application/json');

$pgsqlOptions = "host = 'localhost' dbname = 'geog5871' user = 'geog5871student' password = 'Geibeu9b'";
$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');

$queryType = isset($_GET['type']) ? $_GET['type'] : 'all';

switch($queryType) {
   case 'emergency':
      $query = "SELECT *
               FROM tweets
               WHERE body ILIKE '%flood%' 
               OR body ILIKE '%evac%'
               OR body ILIKE '%help%'
               OR body ILIKE '%emergency%'
               OR body ILIKE '%water%'
               OR body ILIKE '%rescue%'
               OR body ILIKE '%hurricane%'
               OR body ILIKE '%storm%'
               OR body ILIKE '%wind%'
               OR body ILIKE '%damage%'
               OR body ILIKE '%shelter%'
               OR body ILIKE '%power%'
               OR body ILIKE '%outage%'
               ORDER BY day, hour, min";
      break;
   
   case 'worldwide':
      $query = "SELECT *
               FROM tweets
               ORDER BY day, hour, min";
      break;
        
    default:
        $query = "SELECT *
                 FROM tweets
                 WHERE NOT (
                   latitude BETWEEN 24.5 AND 49.5
                   AND longitude BETWEEN -125.0 AND -66.0
                 )
                 ORDER BY day, hour, min";
}

$result = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());

$tweetData = array();

while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
    $tweetData[] = $row;
}

$response = array(
    'query_type' => $queryType,
    'count' => count($tweetData),
    'tweets' => $tweetData
);

echo json_encode($response);

pg_close($dbconn);
?>