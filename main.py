from machine import Pin, ADC, PWM
import time

# 1. Configuração dos Pinos
# O potenciômetro vai no pino 34 (suporta leitura analógica)
pot = ADC(Pin(34))
pot.atten(ADC.ATTN_11DB) # Permite ler a voltagem máxima de 3.3V (valores de 0 a 4095)

# O LED (dimmer) vai no pino 15 com modulação por largura de pulso (PWM)
led = PWM(Pin(15))
led.freq(1000) # Frequência de 1kHz para transição suave

# O Relé vai no pino 2
relay = Pin(2, Pin.OUT)

# 2. Definição do Ponto de Gatilho do Relé
# 50% de 4095 é aproximadamente 2047
RELAY_THRESHOLD = 2047 

def map_value(x, in_min, in_max, out_min, out_max):
    # Função matemática simples para mapear proporções
    return int((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

print("Iniciando controle IoT do Dimmer...")

# 3. Loop Principal
while True:
    # Lê o valor do potenciômetro (0 a 4095)
    pot_value = pot.read()
    
    # Aplica o valor diretamente no LED via PWM para controlar a intensidade (0 a 1023 no MicroPython comum, ou 0 a 1000 dependendo do firmware)
    # Como o duty_u16 usa valores até 65535:
    pwm_value = map_value(pot_value, 0, 4095, 0, 65535)
    led.duty_u16(pwm_value)
    
    # Ativa o relé de acordo com a regra estabelecida
    if pot_value >= RELAY_THRESHOLD:
        relay.value(1) # Liga lâmpada secundária
    else:
        relay.value(0) # Desliga
        
    # Exibe o status no console para acompanhamento
    intensity_percent = map_value(pot_value, 0, 4095, 0, 100)
    print("Intensidade: {}% | Rele: {}".format(intensity_percent, "ON" if pot_value >= RELAY_THRESHOLD else "OFF"))
    
    # Pausa curta para efeito de transição natural na leitura e poupar a CPU do ESP32
    time.sleep(0.1)