$Uri = '[ServerAddress]/submit?info='
if (($PSVersionTable.PSVersion).ToString().Substring(0,1) -lt 6) {
        try{
        $serialNumber = (Get-WmiObject win32_BIOS  -ErrorAction SilentlyContinue).serialnumber
        $operatingSystem = Get-WmiObject win32_OperatingSystem  -ErrorAction SilentlyContinue
        $computerSystem = Get-WmiObject win32_ComputerSystem -ErrorAction SilentlyContinue
        $TCPInfo = (Get-WmiObject win32_networkadapterconfiguration -filter "ipenabled = 'True'") | Select-Object IPAddress, MacAddress
    }catch{} 
}else {
    try{
        $serialNumber = (Get-CimInstance win32_BIOS  -ErrorAction SilentlyContinue).serialnumber
        $operatingSystem = Get-CimInstance win32_OperatingSystem  -ErrorAction SilentlyContinue
        $computerSystem = Get-CimInstance win32_ComputerSystem -ErrorAction SilentlyContinue
        $TCPInfo = (Get-CimInstance win32_networkadapterconfiguration -filter "ipenabled = 'True'") | Select-Object IPAddress, MacAddress
    }catch{}    
}
try {
    $computerName = $computerSystem.Name
    $userName = $computerSystem.Username
    $opsName = $operatingSystem.Caption
    $opsVersion = $operatingSystem.Version
    $installDate = ($operatingSystem.InstallDate).Substring(0,8)    
}
catch {}

$model = $computerSystem.Model
$manufacturer = $computerSystem.Manufacturer
$date = Get-Date -Format "yyyyMMdd HH:mm"
$postParams = '{ "ComputerName":"' + $computerName + '","SerialNumber":"' + $serialNumber + '","Model":"' + $model+ '","Manufacturer":"' + $manufacturer + '","InstallDate":"' + $installDate + '","UserName":"' + ($userName -Replace("\\", "/")) +'","TCPInfo":"' + $TCPInfo.IPAddress +' ' + $TCPInfo.MacAddress +'","OS":"' + $opsName + '","OSVersion":"' + $opsVersion + '","Status":"OK","ConnectionTime":"' + $date + '"}'
$WebRequest = [System.Net.WebRequest]::Create($uri + $postParams)
$WebRequest.GetResponse()