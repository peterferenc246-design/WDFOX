$ErrorActionPreference = 'Stop'
$pricingId = 'wdfox50ragquote01'
$backupDir = Join-Path 'D:\AI\backups' ('orchestrator-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Export current 50.2 before modifying it. This export preserves credential references,
# not decrypted credential secrets; any inline values remain local in the backup.
docker exec n8n n8n export:workflow "--id=$pricingId" --output=/tmp/wdfox-pricing-backup.json
if ($LASTEXITCODE -ne 0) { throw 'Pricing workflow export failed. No changes made.' }
docker cp n8n:/tmp/wdfox-pricing-backup.json (Join-Path $backupDir 'pricing-original.json')
if ($LASTEXITCODE -ne 0) { throw 'Backup copy failed. No changes made.' }
$items = @(Get-Content -Raw -Encoding UTF8 (Join-Path $backupDir 'pricing-original.json') | ConvertFrom-Json)
$matches = @($items | Where-Object { $_.id -eq $pricingId })
if ($matches.Count -ne 1) { throw 'Expected one existing pricing workflow.' }
$pricing = $matches[0]
# Windows PowerShell 5.1 can retain an outer JSON array in pipeline output.
while ($pricing -is [System.Array]) {
    if ($pricing.Count -ne 1) { throw 'Expected exactly one workflow in export.' }
    $pricing = $pricing[0]
}
if (-not $pricing.PSObject.Properties['nodes']) { throw 'Export has no workflow nodes.' }
if ($pricing.name -notmatch '^50[.,]2') { throw 'Expected renamed 50.2 pricing workflow. No changes made.' }
if ($pricing.active) { throw 'Pricing workflow is active. This installer expects an unpublished TEST workflow.' }
$reqNodes = @($pricing.nodes | Where-Object { $_.name -eq 'Test Request' -and $_.type -eq 'n8n-nodes-base.code' })
$pgNodes = @($pricing.nodes | Where-Object { $_.name -eq 'Read Canonical Price' })
if ($reqNodes.Count -ne 1 -or $pgNodes.Count -ne 1) { throw 'Unexpected pricing layout.' }
$pgCredential = $pgNodes[0].credentials.postgres
if (-not $pgCredential.id) { throw 'Select a PostgreSQL credential in 50.2 before installation.' }
$embedNode = @($pricing.nodes | Where-Object { $_.name -eq 'Embed Request' })[0]
if (-not $embedNode.credentials.openAiApi.id) { throw 'Select an OpenAI credential in 50.2 before installation.' }

$base = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX'
$mainFile = Join-Path $backupDir '50-main-orchestrator.json'
$patchFile = Join-Path $backupDir 'pricing-request-code.txt'
Invoke-WebRequest -Uri "$base/ff06b56472ad5d2b19642026b05758c1a853869a/automation/pricebook/50-main-orchestrator.json" -OutFile $mainFile
Invoke-WebRequest -Uri "$base/1b27fe600b320e5ad3a3f28736709c2be55c6f9b/automation/pricebook/pricing-request-code.txt" -OutFile $patchFile

$reqNodes[0].parameters.jsCode = Get-Content -Raw -Encoding UTF8 $patchFile
$triggerName = 'Receive Pricing Request'
$existingTrigger = @($pricing.nodes | Where-Object { $_.name -eq $triggerName })
if ($existingTrigger.Count -eq 0) {
    $trigger = [PSCustomObject]@{
        id = 'wdfox-pricing-internal-trigger'
        name = $triggerName
        type = 'n8n-nodes-base.executeWorkflowTrigger'
        typeVersion = 1.1
        position = @(0,520)
        parameters = [PSCustomObject]@{inputSource='passthrough'}
    }
    $pricing.nodes = @($pricing.nodes) + @($trigger)
} elseif ($existingTrigger.Count -ne 1 -or $existingTrigger[0].type -ne 'n8n-nodes-base.executeWorkflowTrigger') {
    throw 'Unexpected existing trigger; no import performed.'
}
$connection = '{"main":[[{"node":"Test Request","type":"main","index":0}]]}' | ConvertFrom-Json
$pricing.connections | Add-Member -NotePropertyName $triggerName -NotePropertyValue $connection -Force
$main = Get-Content -Raw -Encoding UTF8 $mainFile | ConvertFrom-Json
foreach ($n in $main.nodes) {
    if ($n.type -eq 'n8n-nodes-base.postgres') {
        $n | Add-Member -NotePropertyName credentials -NotePropertyValue ([PSCustomObject]@{postgres=$pgCredential}) -Force
    }
}

$utf8 = [System.Text.UTF8Encoding]::new($false)
$patchedFile = Join-Path $backupDir 'pricing-patched.json'
[System.IO.File]::WriteAllText($patchedFile, ($pricing | ConvertTo-Json -Depth 100), $utf8)
[System.IO.File]::WriteAllText($mainFile, ($main | ConvertTo-Json -Depth 100), $utf8)

docker cp $patchedFile n8n:/tmp/wdfox-pricing-patched.json
if ($LASTEXITCODE -ne 0) { throw 'Copy failed.' }
docker exec n8n n8n import:workflow --input=/tmp/wdfox-pricing-patched.json
if ($LASTEXITCODE -ne 0) { throw 'Pricing update failed. Original backup remains on disk.' }
docker cp $mainFile n8n:/tmp/wdfox-main-orchestrator.json
if ($LASTEXITCODE -ne 0) { throw 'Main workflow copy failed.' }
docker exec n8n n8n import:workflow --input=/tmp/wdfox-main-orchestrator.json
if ($LASTEXITCODE -ne 0) { throw 'Main workflow import failed. Pricing backup remains on disk.' }
Write-Host 'Installation complete. Workflows were NOT executed or published.'
Write-Host "Backup: $backupDir"
Write-Host 'Open 50.0 — WDFOX TEST Main Orchestrator v1 and run the manual TEST.'
