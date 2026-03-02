# 💡 Dashboard IoT - Dimmer de Luz & Controle de Relé

Este projeto é um simulador de um sistema de automação residencial que integra um **Backend em Python** e um **Frontend moderno em React (TypeScript)**. Ele simula o controle de intensidade de uma lâmpada (via PWM) e o acionamento automático de um relé ao atingir um limite específico de potência.

## 🚀 Funcionalidades

**Controle de Intensidade:** Controle gradual do brilho da lâmpada (0% a 100%) através de um potenciômetro virtual.

**Acionamento de Relé:** Ativação automática de um circuito secundário (Relé) quando a intensidade atinge ou ultrapassa **50%**.

**Métricas em Tempo Real:** Cálculo do consumo estimado de energia em Watts (W) com base no brilho e estado do relé.


* **Gráfico de Histórico:** Monitoramento visual das oscilações de intensidade ao longo do tempo através de um gráfico de linha dinâmico.

**Efeitos Visuais (Bloom):** Simulação realista de claridade com gradientes e sombras dinâmicas que reagem à intensidade.


* **Presets de Iluminação:** Botões de atalho para níveis rápidos (0%, 25%, 50%, 100%).

## 🛠️ Tecnologias Utilizadas

### Frontend

**React** (Biblioteca principal) 

**TypeScript** (Tipagem estática) 


* **Vite** (Ferramenta de build rápida)
* **Recharts** (Gráficos em tempo real)
**Lucide-React** (Ícones modernos) 

**CSS3** (Design Glassmorphism e Transições Suaves) 

### Backend

**Python** 

**Flask** (Servidor Web/API) 

* **Flask-CORS** (Permissão de comunicação entre domínios)

## 📦 Como Executar o Projeto

### 1. Pré-requisitos

* Node.js instalado
* Python 3.x instalado

### 2. Configurando o Backend (Servidor)

Navegue até a pasta do backend e instale as dependências:

```bash
cd backend
pip install flask flask-cors
python app.py

```

O servidor iniciará em `http://127.0.0.1:5000`.

### 3. Configurando o Frontend (Interface)

Abra um novo terminal, navegue até a pasta do frontend e execute:

```bash
cd frontend
npm install
npm run dev

```

Acesse a URL gerada (geralmente `http://localhost:5173`) no seu navegador.

## 📐 Arquitetura do Sistema

O sistema foi desenhado como uma etapa preliminar para hardware real (**ESP32**).

1. O usuário ajusta a intensidade na interface React.
2. O Frontend envia um `POST` para o Flask com o novo valor.
3. O Backend processa a lógica de negócio (como a regra dos 50% para o Relé) e armazena o estado em memória.


4. O estado atualizado é devolvido para a interface, que renderiza os efeitos visuais e as métricas.

## 👨‍💻 Autores

* Arthur Sabino da Silva 


* Gustavo Muzel 


* Pablo de Souza Santos 



---

*Projeto desenvolvido para o curso de Engenharia de Software - Universidade de Mogi das Cruzes.*