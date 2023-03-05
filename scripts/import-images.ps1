# moves non-monochrome SVG files from Azure PlantUML directories to a target location
# The "Azure" prefix is removed from the destination filename

$config = Get-Content ./scripts/config.json | ConvertFrom-Json
$sourcePath = $config.sourceImagesPath
$destinationPathRoot = $config.destinationImagesPath
$files = Get-ChildItem -Path $sourcePath -Recurse | Where-Object Name -match "[a-zA-Z0-9].svg"

foreach($file in $files) {
    $fileName = $file.Name
    $newFileName = ""
    
    if ($file.Name -like "Azure*") {
        $newFileName = $file.Name.Split("Azure")[1].ToLower()
    } else {
        $newFileName = $file.Name.ToLower()
    }

    $categoryFolder = $file.Directory.Name
    $destinationPath = "${destinationPathRoot}\${categoryFolder}"
    New-Item -Path $destinationPath -ItemType Directory -ErrorAction Ignore
    Copy-Item -Path $file.FullName  -Destination $destinationPath
    Rename-Item -Path "${destinationPath}\${fileName}"  -NewName $newFileName
}
