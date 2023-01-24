
Add-PSSnapin Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue


$Web = Get-SPWeb "http://portal.pallet.ru/requests/"
$List = $Web.Lists["vacancies"]
 
 $webURL = "http://portal.pallet.ru/requests/"
    $listName = "vacancies"
    $web = Get-SPWeb $webURL
    $list = $web.Lists[$listName]
    $i=0
    $ListItems = $list.items
    foreach ($Item in $ListItems)
{
    $List.GetItemByID($Item.id).Delete()
    Write-host "Deleted Item: $($item.id)" -foregroundcolor Red
}








$response = Invoke-WebRequest -Uri "https://api.hh.ru/vacancies?employer_id=7733&per_page=100"
$jsonObj = ConvertFrom-Json $([String]::new($response.Content))
$vac=$jsonObj.items

for ($i=0; $i -le $vac.length; $i++){
$NewItem = $List.AddItem()
$NewItem["Address"] = $vac[$i].address.street+' '+$vac[$i].address.building
$NewItem["City"] = $vac[$i].area.name
$NewItem["Requirement"] = $vac[$i].snippet.requirement

$newUrl = "https://api.hh.ru/vacancies/" +$vac[$i].id
$response2 = Invoke-WebRequest -Uri $newUrl
$jsonObj2 = ConvertFrom-Json $([String]::new($response2.Content))
$NewItem["Responsibility"] = $jsonObj2.description
$NewItem["SalaryFrom"] = $vac[$i].salary.from
$NewItem["SalaryTo"] = $vac[$i].salary.to
$NewItem["Shedule"] = $vac[$i].schedule.name
$NewItem["Type"] = $vac[$i].type.name
$NewItem["Title"] = $vac[$i].name
$NewItem.Update()

}
