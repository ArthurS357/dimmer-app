import React, { useState, useEffect, useRef } from "react";
import {
  Power,
  Lightbulb,
  Zap,
  Activity,
  Cpu,
  LineChart as ChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

// Interface para definir o formato dos dados principais
interface SystemState {
  intensity: number;
  power: boolean;
  relay_on: boolean;
}

// Interface para os dados do gráfico de histórico
interface HistoryData {
  time: string;
  intensity: number;
}

function App() {
  const [intensity, setIntensity] = useState<number>(0);
  const [power, setPower] = useState<boolean>(true);
  const [relayOn, setRelayOn] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  // Estado para armazenar os dados do gráfico em tempo real
  const [history, setHistory] = useState<HistoryData[]>([]);

  // Ref para acessar os valores mais recentes dentro do setInterval sem recriar o hook
  const stateRef = useRef({ intensity, power });

  // Mantém a Ref sempre atualizada quando a intensidade ou energia mudam
  useEffect(() => {
    stateRef.current = { intensity, power };
  }, [intensity, power]);

  // Busca o estado inicial do backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/status")
      .then((res) => res.json())
      .then((data: SystemState) => {
        setIntensity(data.intensity);
        setPower(data.power);
        setRelayOn(data.relay_on);
        setConnected(true);
      })
      .catch((err) => {
        console.error("Erro na comunicação:", err);
        setConnected(false);
      });
  }, []);

  // Simula a captura de dados em tempo real a cada 2 segundos para o gráfico
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Formata a hora para HH:MM:SS
      const timeString = now.toLocaleTimeString([], { hour12: false });

      // Se a energia estiver desligada, registra 0% no gráfico, senão usa a intensidade atual
      const currentVal = stateRef.current.power
        ? stateRef.current.intensity
        : 0;

      setHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory,
          { time: timeString, intensity: currentVal },
        ];
        // Mantém apenas os últimos 20 registros para o gráfico fluir lateralmente
        if (newHistory.length > 20) return newHistory.slice(1);
        return newHistory;
      });
    }, 2000);

    // Limpa o intervalo se o componente for desmontado
    return () => clearInterval(interval);
  }, []);

  // Ligar/Desligar Energia Geral
  const handleToggle = () => {
    fetch("http://127.0.0.1:5000/api/toggle", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setPower(data.state.power);
        setRelayOn(data.state.relay_on);
      });
  };

  // Alterar Intensidade (Slider ou Botões)
  const updateIntensity = (newIntensity: number) => {
    setIntensity(newIntensity);

    fetch("http://127.0.0.1:5000/api/intensity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intensity: newIntensity }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRelayOn(data.state.relay_on);
      });
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateIntensity(parseInt(e.target.value, 10));
  };

  // Cálculos Visuais e Métricas Aprimoradas
  const smoothTransition = "all 0.5s ease-in-out";
  const roomOpacity = power ? 0.9 - (intensity / 100) * 0.9 : 0.95;

  // Consumo estimado
  const powerConsumption = power
    ? (intensity / 100) * 60 + (relayOn ? 10 : 0)
    : 0;

  // Cores dinâmicas da lâmpada
  const bulbColor = power && intensity > 0 ? "#fde047" : "#475569";

  // Truque 1: Múltiplas sombras para criar o efeito "Bloom" realista
  const bulbShadow =
    power && intensity > 0
      ? `drop-shadow(0 0 ${intensity / 3}px rgba(253,224,71,0.9)) 
         drop-shadow(0 0 ${intensity}px rgba(253,224,71,0.6)) 
         drop-shadow(0 0 ${intensity * 2.5}px rgba(253,224,71,0.3))`
      : "none";

  // Truque 2: Gradiente radial no fundo da sala para simular a luz espalhando no ambiente
  const roomBackground =
    power && intensity > 0
      ? `radial-gradient(circle at 50% 30%, rgba(253, 224, 71, ${intensity / 400}) 0%, #111827 ${40 + intensity / 2}%)`
      : "#111827";

  return (
    <div className="dashboard-container">
      <h1 className="header-title">
        <Activity size={32} color="#3b82f6" />
        Painel de Controle IoT
      </h1>

      <div className="main-grid">
        {/* COLUNA ESQUERDA: Visualização */}
        <div className="glass-panel" style={{ padding: "15px" }}>
          <div
            className="room-container"
            style={{ background: roomBackground, transition: smoothTransition }}
          >
            <div
              className="darkness-overlay"
              style={{ opacity: roomOpacity, transition: smoothTransition }}
            ></div>

            {/* Ícone da Lâmpada com o novo filtro de múltiplas sombras */}
            <div className="lamp-icon" style={{ filter: bulbShadow }}>
              <Lightbulb size={100} color={bulbColor} strokeWidth={1.5} />
            </div>

            {/* Status do Relé Refinado */}
            <div
              className="relay-status"
              style={{
                backgroundColor: relayOn
                  ? "rgba(16, 185, 129, 0.85)"
                  : "rgba(239, 68, 68, 0.85)",
                borderColor: relayOn
                  ? "rgba(16, 185, 129, 0.4)"
                  : "rgba(239, 68, 68, 0.4)",
                color: "white",
                transition: smoothTransition,
              }}
            >
              <Cpu size={14} />
              {relayOn ? "RELÉ ATIVO" : "RELÉ INATIVO"}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Controles */}
        <div className="glass-panel control-section">
          {/* Status e Master Power */}
          <div className="status-bar">
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Status do Sistema
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: connected ? "#10b981" : "#ef4444",
                    boxShadow: connected ? "0 0 10px #10b981" : "none",
                  }}
                ></div>
                <span style={{ fontWeight: "bold" }}>
                  {connected ? "Conectado" : "Desconectado"}
                </span>
              </div>
            </div>

            <button
              className={`power-btn ${power ? "on" : "off"}`}
              onClick={handleToggle}
              title="Energia Principal"
            >
              <Power size={28} />
            </button>
          </div>

          {/* Controle Deslizante */}
          <div className="slider-container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Intensidade (PWM)
              </span>
              <span style={{ fontSize: "32px", fontWeight: "bold" }}>
                {intensity}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={handleIntensityChange}
              disabled={!power}
              style={{
                opacity: power ? 1 : 0.5,
                cursor: power ? "pointer" : "not-allowed",
              }}
            />
          </div>

          {/* Botões de Predefinição (Presets) */}
          <div className="presets">
            <button
              className="preset-btn"
              onClick={() => updateIntensity(0)}
              disabled={!power}
            >
              0%
            </button>
            <button
              className="preset-btn"
              onClick={() => updateIntensity(25)}
              disabled={!power}
            >
              25%
            </button>
            <button
              className="preset-btn"
              onClick={() => updateIntensity(50)}
              disabled={!power}
            >
              50%
            </button>
            <button
              className="preset-btn"
              onClick={() => updateIntensity(100)}
              disabled={!power}
            >
              100%
            </button>
          </div>

          {/* Painel de Métricas */}
          <div className="metrics">
            <div className="metric-card">
              <Zap
                color={power && intensity > 0 ? "#eab308" : "#475569"}
                size={32}
                style={{ transition: smoothTransition }}
              />
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Consumo Estimado
                </div>
                <span>{powerConsumption.toFixed(1)} W</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO DE HISTÓRICO INFERIOR */}
        <div className="glass-panel chart-container">
          <div className="chart-title">
            <ChartIcon size={20} color="#3b82f6" />
            Histórico de Intensidade Luminosa
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={history}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
                // CORREÇÃO: A tipagem de 'value' foi alterada para 'any' para evitar conflito com os genéricos do Recharts
                formatter={(value: any) => [`${value}%`, "Intensidade"]}
                labelStyle={{ color: "#94a3b8", marginBottom: "5px" }}
              />

              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#0f172a",
                  stroke: "#3b82f6",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6, fill: "#fde047", stroke: "#fde047" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
