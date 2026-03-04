@echo off
:: ============================================================
:: Preston Palace - Leaderboard scherm opstarten op HDMI 2
:: ============================================================
:: Pas MONITOR_X aan als het scherm op de verkeerde plek verschijnt:
::   Scherm rechts van primair  -> MONITOR_X = breedte primair scherm (bijv. 1920)
::   Scherm links van primair   -> MONITOR_X = -1920 (of breedte van HDMI 2)
:: ============================================================

set MONITOR_X=1920
set MONITOR_Y=0
set URL=http://localhost:3000/spectator

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --new-window ^
  --window-position=%MONITOR_X%,%MONITOR_Y% ^
  --start-fullscreen ^
  --app=%URL%

:: Als Chrome niet gevonden wordt, probeer Edge:
if errorlevel 1 (
  start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" ^
    --new-window ^
    --window-position=%MONITOR_X%,%MONITOR_Y% ^
    --start-fullscreen ^
    --app=%URL%
)
