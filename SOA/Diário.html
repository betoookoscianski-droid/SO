<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOA - Sistema Operacional Alberto</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', system-ui, sans-serif; }
        .nav-link { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-link:hover { transform: translateX(8px); }
        .section { display: none; }
        .section.active { display: block; }
        .hero-bg {
            background-image: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('https://picsum.photos/id/1015/1200/600');
            background-size: cover;
            background-position: center;
        }
    </style>
</head>
<body class="bg-zinc-950 text-zinc-200 min-h-screen">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div class="p-6 border-b border-zinc-800">
                <h1 class="text-3xl font-bold text-white">SOA Alberto</h1>
                <p class="text-xs text-zinc-500">Sistema Pessoal</p>
            </div>
            <nav class="p-4 space-y-1 flex-1 overflow-auto">
                <a href="#" onclick="navigateTo('dashboard')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-800 text-white">
                    <i class="fa-solid fa-house w-5"></i> Dashboard
                </a>
                <a href="#" onclick="navigateTo('estudos')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-zinc-800">
                    <i class="fa-solid fa-graduation-cap w-5"></i> Estudos
                </a>
                <a href="#" onclick="navigateTo('planejamento')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-zinc-800">
                    <i class="fa-solid fa-calendar-day w-5"></i> Planejamento
                </a>
                <a href="#" onclick="navigateTo('conselheiro')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-zinc-800">
                    <i class="fa-solid fa-robot w-5"></i> Conselheiro
                </a>
                <a href="#" onclick="navigateTo('acalmar')" class="nav-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-zinc-800">
                    <i class="fa-solid fa-heart w-5"></i> Acalmar Mente
                </a>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-auto">
            <header class="hero-bg h-64 flex items-end">
                <div class="p-8 text-white">
                    <h1 class="text-5xl font-bold">Alberto</h1>
                    <p class="text-xl">"Não preciso controlar tudo para viver bem."</p>
                </div>
            </header>

            <div class="p-8 max-w-5xl mx-auto">

                <!-- Dashboard -->
                <div id="dashboard" class="section active">
                    <h2 class="text-4xl font-bold mb-6">Bem-vindo ao seu SOA</h2>
                    <p class="text-lg text-zinc-400">Escolha uma seção no menu lateral para começar.</p>
                </div>

                <!-- Estudos -->
                <div id="estudos" class="section">
                    <h2 class="text-3xl font-bold mb-8">Estudos para Concursos</h2>
                    <div class="bg-white text-zinc-900 rounded-3xl p-8">
                        <button onclick="startPomodoro()" class="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-medium">
                            ▶ Iniciar Pomodoro (25 min)
                        </button>
                        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div class="p-6 border rounded-2xl">Feynman: Explique em voz alta</div>
                            <div class="p-6 border rounded-2xl">Intercale matérias</div>
                            <div class="p-6 border rounded-2xl">Use mapas mentais</div>
                            <div class="p-6 border rounded-2xl">Anki para revisão</div>
                        </div>
                    </div>
                </div>

                <!-- Planejamento -->
                <div id="planejamento" class="section">
                    <h2 class="text-3xl font-bold mb-6">Planejamento Diário (3 prioridades)</h2>
                    <input id="new-task" type="text" placeholder="Nova prioridade..." 
                           class="w-full p-5 rounded-2xl border border-zinc-700 bg-zinc-900 text-white">
                    <button onclick="addPriority()" class="mt-4 px-6 py-3 bg-emerald-600 rounded-2xl">Adicionar</button>
                    <ul id="priorities-list" class="mt-8 space-y-3"></ul>
                </div>

                <!-- Conselheiro -->
                <div id="conselheiro" class="section bg-white text-zinc-900 rounded-3xl p-10 text-center">
                    <h2 class="text-3xl font-bold mb-8">Conselheiro Alberto</h2>
                    <p id="conselho-text" class="italic text-xl min-h-32"></p>
                    <button onclick="getConselho()" class="mt-8 px-10 py-4 bg-zinc-900 text-white rounded-2xl">Receber Conselho</button>
                </div>

                <!-- Acalmar -->
                <div id="acalmar" class="section text-center">
                    <h2 class="text-4xl font-bold mb-10">Acalmar a Mente</h2>
                    <button onclick="startBreathing()" class="text-9xl hover:scale-110 transition-all">🌬️</button>
                    <p class="mt-8 text-xl">Respiração 4-7-8</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        function navigateTo(section) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(section).classList.add('active');
        }

        let priorities = [];
        function addPriority() {
            const input = document.getElementById('new-task');
            if (input.value.trim()) {
                priorities.push(input.value);
                renderPriorities();
                input.value = '';
            }
        }
        function renderPriorities() {
            const list = document.getElementById('priorities-list');
            list.innerHTML = priorities.map(p => `<li class="bg-zinc-800 p-4 rounded-2xl">${p}</li>`).join('');
        }

        function startPomodoro() {
            alert("✅ Pomodoro iniciado!\nFoque por 25 minutos.");
        }

        function getConselho() {
            const tips = [
                "Isso é um fato ou um medo?",
                "Feito é melhor que perfeito.",
                "Respire. O que realmente importa agora?",
                "Sua paz vale mais que ter razão."
            ];
            document.getElementById('conselho-text').textContent = tips[Math.floor(Math.random() * tips.length)];
        }

        function startBreathing() {
            alert("Inspire por 4 segundos...\nSegure por 7...\nExpire por 8...\n\nRepita algumas vezes.");
        }

        window.onload = () => {
            navigateTo('dashboard');
        };
    </script>
</body>
</html>