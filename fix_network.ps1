Write-Host "=== Diagnóstico e Correção de Rede Hexai ===" -ForegroundColor Cyan

# 1. Tentar mudar a rede para Privada (Mais permissiva)
Try {
    $profile = Get-NetConnectionProfile -Name "Iron Man"
    if ($profile) {
        Write-Host "Rede 'Iron Man' detectada. Mudando para Private..."
        Set-NetConnectionProfile -Name "Iron Man" -NetworkCategory Private
        Write-Host "Sucesso! Rede agora é Privada." -ForegroundColor Green
    } else {
        Write-Host "Rede 'Iron Man' não encontrada. Tentando configurar todas as redes..."
        Get-NetConnectionProfile | Set-NetConnectionProfile -NetworkCategory Private
    }
} Catch {
    Write-Host "Erro ao mudar categoria de rede. Verifique se está rodando como ADMIN." -ForegroundColor Red
}

# 2. Desativar Firewall temporariamente (Para teste de conexão Docker)
Write-Host "Desativando Firewall do Windows temporariamente para liberar o Docker..."
Set-NetFirewallProfile -Profile Desktop,Standard,Domain,Public,Private -Enabled False
Write-Host "Firewall Desativado." -ForegroundColor Yellow

# 3. Instrução Final
Write-Host "`n=== AGORA REINICIE O DOCKER ===" -ForegroundColor Cyan
Write-Host "1. Volte ao terminal do agente ou rode 'docker-compose restart' na pasta do projeto."
Write-Host "2. Verifique se o QR Code aparece."
Write-Host "`nPressione ENTER para sair..."
Read-Host
