$ErrorActionPreference='Stop'
$workspace=[System.IO.Path]::GetFullPath('D:\ZinGPT').TrimEnd('\')
function Assert-LocalPath([string]$Path){$absolute=[System.IO.Path]::GetFullPath($Path);if(-not $absolute.StartsWith($workspace+'\',[System.StringComparison]::OrdinalIgnoreCase)){throw "Path outside workspace: $absolute"};return $absolute}
function Move-Checked([string]$Source,[string]$Destination){$from=Assert-LocalPath $Source;$to=Assert-LocalPath $Destination;if(Test-Path -LiteralPath $to){if(-not(Test-Path -LiteralPath $from)){return};throw "Destination already exists: $to"};$parent=Split-Path -Parent $to;[void][System.IO.Directory]::CreateDirectory($parent);Move-Item -LiteralPath $from -Destination $to}
$web=Assert-LocalPath (Join-Path $workspace 'Websites')
$archives=Assert-LocalPath (Join-Path $web 'Archives')
[void][System.IO.Directory]::CreateDirectory($archives)
$log=[System.Collections.Generic.List[object]]::new()
Add-Type -AssemblyName System.IO.Compression.FileSystem
$subjects=@(
 @{Folder='Consumer Behavior';Zip='Consumer Behavior PPT.zip';Book='Consumer Behavior - Building Marketing Strategy - David L. Mothersbaugh, Del I. Hawkins, Susan Bardi Kleiser.pdf'},
 @{Folder='Digital MKT';Zip='Digital MKT PPT.zip';Book='Digital Marketing - Dave Chaffey, Fiona Ellis-Chadwick.pdf'}
)
foreach($subject in $subjects){
 $course=Assert-LocalPath (Join-Path $workspace ('Kho-tai-lieu-mon-hoc\'+$subject.Folder));$slides=Assert-LocalPath (Join-Path $course 'Slides');[void][System.IO.Directory]::CreateDirectory($slides)
 $zipPath=Assert-LocalPath (Join-Path $workspace $subject.Zip);if(-not(Test-Path -LiteralPath $zipPath)){$zipPath=Assert-LocalPath (Join-Path $course ('Original upload\'+$subject.Zip))};$zip=[System.IO.Compression.ZipFile]::OpenRead($zipPath)
 try{foreach($entry in $zip.Entries){$target=Assert-LocalPath (Join-Path $slides $entry.FullName);if(-not $target.StartsWith($slides+'\',[System.StringComparison]::OrdinalIgnoreCase)){throw 'Unsafe ZIP path'};if($entry.Length -gt 100MB -or [System.IO.Path]::GetExtension($target) -ne '.pdf'){throw 'Unexpected ZIP entry'};if(Test-Path -LiteralPath $target){if((Get-Item -LiteralPath $target).Length -ne $entry.Length){throw 'Extracted file size differs'}}else{[System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry,$target)};$log.Add([pscustomobject]@{Action='Extract';From=$subject.Zip;To=$target;Bytes=$entry.Length;SHA256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()})}}finally{$zip.Dispose()}
 $bookSource=Join-Path $workspace ('Kho-tai-lieu-mon-hoc\'+$subject.Book);$bookTarget=Join-Path $course $subject.Book
 Move-Checked $bookSource $bookTarget
 $log.Add([pscustomobject]@{Action='Move textbook';From=$bookSource;To=$bookTarget;SHA256=(Get-FileHash -LiteralPath $bookTarget -Algorithm SHA256).Hash.ToLower()})
 if($zipPath -ne (Join-Path $course ('Original upload\'+$subject.Zip))){Move-Checked $zipPath (Join-Path $course ('Original upload\'+$subject.Zip))}
}
# Keep active source repositories in place: Windows denies moving their directory roots.
$keep=@('consumer-dashboard-reference.tar.gz','digital-marketing-chapter-1.tar.gz','studio-digital-marketing-link.tar.gz','little-space-deploy.tar.gz')
foreach($file in Get-ChildItem -LiteralPath $workspace -File -Filter '*.tar.gz'){
 $source=Assert-LocalPath $file.FullName;$hash=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLower()
 if($keep -contains $file.Name){$target=Join-Path $archives ('Builds\'+$file.Name);Move-Checked $source $target;$log.Add([pscustomobject]@{Action='Retain latest build or unique legacy site';From=$file.Name;To=$target;Bytes=$file.Length;SHA256=$hash})}
 elseif($file.Name -match '^(consumer-|consumer-behavio|studio-|zin-study-studio-)'){
  # Only named obsolete deployment archives; original documents and repository data are excluded.
  if(-not (Test-Path -LiteralPath (Join-Path $workspace 'zin-study-studio\.git')) -or -not (Test-Path -LiteralPath (Join-Path $workspace 'consumer-behaviour-lab\.git'))){throw 'Missing retained source repositories'}
  $log.Add([pscustomobject]@{Action='Delete superseded deployment archive';From=$file.Name;Bytes=$file.Length;SHA256=$hash})
  Remove-Item -LiteralPath $source
 }else{throw "Unclassified archive: $($file.Name)"}
}
foreach($file in Get-ChildItem -LiteralPath $workspace -File -Filter '*publication*.json'){Move-Checked $file.FullName (Join-Path $archives ('Publication-records\'+$file.Name));$log.Add([pscustomobject]@{Action='Archive local publication record';From=$file.Name})}
foreach($name in '156f7370-b87c-4ec4-92cb-18a38a901cee.jfif','c2e26e24-561c-45a9-9ffa-d514199214f3.jfif'){Move-Checked (Join-Path $workspace $name) (Join-Path $workspace ('Image\Design references\'+$name))}
Move-Checked (Join-Path $workspace 'index.html') (Join-Path $archives 'Legacy site\index.html')
Move-Checked (Join-Path $workspace 'random.txt') (Join-Path $archives 'Unclassified originals\random.txt')
$logPath=Assert-LocalPath (Join-Path $archives 'organization-2026-11-19.json');$log | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $logPath -Encoding UTF8
$deleted=@($log | Where-Object Action -eq 'Delete superseded deployment archive')
[pscustomobject]@{SlideFiles=@($log | Where-Object Action -eq 'Extract').Count;DeletedSupersededBuilds=$deleted.Count;BytesRemoved=($deleted | Measure-Object Bytes -Sum).Sum;Log=$logPath} | ConvertTo-Json
