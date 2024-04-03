<?php
$conn = mysqli_connect("localhost", "root", "", "BendingEndurance");
if (!$conn) {
    die("Ошибка: " . mysqli_connect_error());
}

$file_path = "Error.log";
file_put_contents($file_path,"");
error_log("---------------------------Manager-------------------------------- \n", 3 , $file_path);


$input = file_get_contents('php://input');
$data = json_decode($input);
$Mm = $data->Mm;
$n = $data->n;
$x1 = $data->x1;
$x2 = $data->x2;
$Zv = $data->Zv;
$Hard = $data->Hard;
$RWW = $data->RWW;
$GA = $data->GA;
error_log("get_data: $Mm $n $x1 $x2 $Zv $Hard $RWW $GA\n", 3 , $file_path);

$Tables = array();

$sql = "SELECT KFbeta FROM Table_6_3 WHERE RWW = $RWW AND Hardness = '$Hard' AND Gear_Arrangement = '$GA'";
error_log("SQL request: $sql \n", 3 , $file_path);
if ($result = mysqli_query($conn, $sql)) {
    $row = mysqli_fetch_assoc($result);
    $Tables[] = $row['KFbeta'];
    error_log("KFbeta: $Tables[0] \n", 3 , $file_path);
} 
else error_log("SQL Query Error: " . mysqli_error($conn) . "\n", 3, $file_path);

$sql = "SELECT YF FROM Table_6_7 WHERE ETC = $Zv AND Offset_x = $x1";
error_log("SQL request: $sql \n", 3 , $file_path);
if ($result = mysqli_query($conn, $sql)) {
    $row = mysqli_fetch_assoc($result);
    $Tables[] = $row['YF'];
    error_log("YF1: $Tables[1] \n", 3 , $file_path);
} 
else error_log("SQL Query Error: " . mysqli_error($conn) . "\n", 3, $file_path);

$sql = "SELECT YF FROM Table_6_7 WHERE ETC = $Zv AND Offset_x = $x2";
error_log("SQL request: $sql \n", 3 , $file_path);
if ($result = mysqli_query($conn, $sql)) {
    $row = mysqli_fetch_assoc($result);
    $Tables[] = $row['YF'];
    error_log("YF2: $Tables[2] \n", 3 , $file_path);
} 
else error_log("SQL Query Error: " . mysqli_error($conn) . "\n", 3, $file_path);

$sql = "SELECT g0 FROM Table_6_13 WHERE Module_m = '$Mm' AND n = $n";
error_log("SQL request: $sql \n", 3 , $file_path);
if ($result = mysqli_query($conn, $sql)) {
    $row = mysqli_fetch_assoc($result);
    $Tables[] = $row['g0'];
    error_log("g0: $Tables[3] \n", 3 , $file_path);
} 
else error_log("SQL Query Error: " . mysqli_error($conn) . "\n", 3, $file_path);

$sql = "SELECT Omega_Fnu FROM Table_6_14 WHERE Module_m = '$Mm' AND n = $n";
error_log("SQL request: $sql \n", 3 , $file_path);
if ($result = mysqli_query($conn, $sql)) {
    $row = mysqli_fetch_assoc($result);
    $Tables[] = $row['Omega_Fnu'];
    error_log("Omega_Fnu: $Tables[4] \n", 3 , $file_path);
} 
else error_log("SQL Query Error: " . mysqli_error($conn) . "\n", 3, $file_path);

header('Content-Type: application/json');
//echo json_encode($Tables);
echo json_encode(["success" => true, "data" => $Tables]);

mysqli_close($conn);

?>