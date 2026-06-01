function GetProjectRoot()
{
    $projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
    return $projectRoot.Path
}

function GoToApiProject()
{
    $projectRoot = GetProjectRoot
    $apiProjectPath = Join-Path $projectRoot "api"

    if (-not (Test-Path $apiProjectPath))
    {
        throw "API project path not found: $apiProjectPath"
    }

    Set-Location $apiProjectPath
}

function GoToBuildFolder()
{
    $projectRoot = GetProjectRoot
    $buildFolderPath = Join-Path $projectRoot "build"

    if (-not (Test-Path $buildFolderPath))
    {
        throw "Build folder path not found: $buildFolderPath"
    }

    Set-Location $buildFolderPath
}

function GoToUiProject()
{
    $projectRoot = GetProjectRoot
    $uiProjectPath = Join-Path $projectRoot "ui"

    if (-not (Test-Path $uiProjectPath))
    {
        throw "UI project path not found: $uiProjectPath"
    }

    Set-Location $uiProjectPath
}

function Invoke-InProjectPath($projectPath, $errorMessage, $scriptBlock)
{
    if (-not (Test-Path $projectPath))
    {
        throw $errorMessage
    }

    Push-Location $projectPath
    try
    {
        & $scriptBlock
    }
    finally
    {
        Pop-Location
    }
}

function BuildUiProject()
{
    $projectRoot = GetProjectRoot
    $uiProjectPath = Join-Path $projectRoot "ui"

    Invoke-InProjectPath $uiProjectPath "UI project path not found: $uiProjectPath" {
        npm.cmd run build
    }
}

function StartUiProject()
{
    $projectRoot = GetProjectRoot
    $uiProjectPath = Join-Path $projectRoot "ui"

    Invoke-InProjectPath $uiProjectPath "UI project path not found: $uiProjectPath" {
        npm.cmd run start
    }
}

function BuildApiProject()
{
    $projectRoot = GetProjectRoot
    $apiProjectPath = Join-Path $projectRoot "api"

    Invoke-InProjectPath $apiProjectPath "API project path not found: $apiProjectPath" {
        npm.cmd run build
    }
}

function StartApiProject()
{
    $projectRoot = GetProjectRoot
    $apiProjectPath = Join-Path $projectRoot "api"

    Invoke-InProjectPath $apiProjectPath "API project path not found: $apiProjectPath" {
        npm.cmd run start:dev
    }
}
