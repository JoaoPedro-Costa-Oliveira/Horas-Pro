document.addEventListener('DOMContentLoaded', async () => { // ALTERAÇÃO: Adicionado 'async'
    // --- Estado da Aplicação ---
    let registros = [];
    let appSettings = { metaHoras: 6, darkMode: false };
    let chartInstance = null;
    
    // --- Constantes da API ---
    const API_URL = 'http://127.0.0.1:5000/api'; // NOVO: URL base do nosso backend

    // --- Referências do DOM ---
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const dataInput = document.getElementById('data');

    // --- Funções de Persistência com a API ---

    // REMOVIDO: const saveDataToLocalStorage = () => { ... };

    // ALTERAÇÃO: Função para carregar dados do SERVIDOR
    const loadDataFromServer = async () => {
        try {
            const response = await fetch(`${API_URL}/registros`);
            if (!response.ok) throw new Error('Erro ao buscar dados do servidor.');
            registros = await response.json();
        } catch (error) {
            console.error(error);
            showToast('Falha ao carregar dados do servidor.', 'error');
        }
    };

    // MANTIDO: As configurações continuam no LocalStorage por simplicidade
    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem('horasProSettings'));
        if (savedSettings) {
            appSettings = savedSettings;
        }
        document.getElementById('meta-horas-input').value = appSettings.metaHoras;
        document.getElementById('dark-mode-toggle').checked = appSettings.darkMode;
        if (appSettings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    };

    const saveSettings = () => {
        localStorage.setItem('horasProSettings', JSON.stringify(appSettings));
    };

    // --- Funções de UI e Cálculos (Nenhuma alteração necessária aqui) ---
     const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };
     const navigateToPage = (targetId) => {
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        const targetPage = document.getElementById(targetId);
        const targetLink = document.querySelector(`a[data-target="${targetId}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetLink) targetLink.classList.add('active');

        if (targetId === 'page-dashboard') updateDashboard();
    };
     const updateAllViews = () => {
        renderRegistrosTable();
        updateDashboard();
    };
    const calculateTotalMs = (reg) => {
        if(!reg.chegada || !reg.saidaAlmoco || !reg.retornoAlmoco || !reg.saidaFinal) return 0;
        const chegada = new Date(`1970-01-01T${reg.chegada}`);
        const saidaAlmoco = new Date(`1970-01-01T${reg.saidaAlmoco}`);
        const retornoAlmoco = new Date(`1970-01-01T${reg.retornoAlmoco}`);
        const saidaFinal = new Date(`1970-01-01T${reg.saidaFinal}`);
        let totalMs = (saidaAlmoco - chegada) + (saidaFinal - retornoAlmoco);
        return totalMs < 0 ? 0 : totalMs;
    };
     const formatMsToHours = (ms) => {
        const totalHoras = Math.floor(ms / 3600000);
        const totalMinutos = Math.floor((ms % 3600000) / 60000);
        return `${String(totalHoras).padStart(2, '0')}h ${String(totalMinutos).padStart(2, '0')}min`;
    };
    function renderRegistrosTable() {
        const tableBody = document.getElementById('registros-body');
        const emptyState = document.getElementById('registros-empty-state');
        const tableWrapper = document.querySelector('#page-registros .table-wrapper');
        
        tableBody.innerHTML = '';
        if (registros.length === 0) {
            emptyState.style.display = 'block';
            tableWrapper.style.display = 'none';
            return;
        }
        emptyState.style.display = 'none';
        tableWrapper.style.display = 'block';

        const sortedRegistros = [...registros].sort((a, b) => new Date(b.data) - new Date(a.data));

        sortedRegistros.forEach(reg => {
            const row = tableBody.insertRow();
            const totalMs = calculateTotalMs(reg);
            const horasTrabalhadas = totalMs / 3600000;
            const status = horasTrabalhadas >= appSettings.metaHoras ? 'Completo' : 'Incompleto';
            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {timeZone: 'UTC'}).format(new Date(reg.data));

            row.innerHTML = `
                <td>${dataFormatada}</td><td>${reg.chegada}</td><td>${reg.saidaAlmoco}</td>
                <td>${reg.retornoAlmoco}</td><td>${reg.saidaFinal}</td><td>${formatMsToHours(totalMs)}</td>
                <td><span class="status status-${status.toLowerCase()}">${status}</span></td><td>${reg.observacoes || ''}</td>
                <td class="action-column"><button class="action-btn" data-id="${reg.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button></td>
            `;
        });
    }

    function updateDashboard() {
        let totalMsGeral = 0;
        let diasCompletos = 0;
        let diasIncompletos = 0;
        const horasPorMes = {};

        registros.forEach(reg => {
            const totalMs = calculateTotalMs(reg);
            totalMsGeral += totalMs;
            if (totalMs / 3600000 >= appSettings.metaHoras) {
                diasCompletos++;
            } else {
                diasIncompletos++;
            }

            const data = new Date(reg.data);
            const mesChave = `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, '0')}`;
            if (!horasPorMes[mesChave]) {
                horasPorMes[mesChave] = 0;
            }
            horasPorMes[mesChave] += totalMs / 3600000;
        });

        const totalRegistros = registros.length;
        const mediaDiariaMs = totalRegistros > 0 ? totalMsGeral / totalRegistros : 0;

        document.getElementById('db-total-horas').textContent = formatMsToHours(totalMsGeral);
        document.getElementById('db-media-diaria').textContent = formatMsToHours(mediaDiariaMs);
        document.getElementById('db-dias-completos').textContent = diasCompletos;
        document.getElementById('db-dias-incompletos').textContent = diasIncompletos;
        
        const recentesBody = document.getElementById('recentes-body');
        recentesBody.innerHTML = '';
        [...registros].sort((a,b) => new Date(b.data) - new Date(a.data)).slice(0, 5).forEach(reg => {
             const row = recentesBody.insertRow();
             const totalMs = calculateTotalMs(reg);
             const status = totalMs / 3600000 >= appSettings.metaHoras ? 'Completo' : 'Incompleto';
             row.innerHTML = `<td>${new Intl.DateTimeFormat('pt-BR', {timeZone: 'UTC'}).format(new Date(reg.data))}</td><td>${formatMsToHours(totalMs)}</td><td><span class="status status-${status.toLowerCase()}">${status}</span></td>`;
        });

        const sortedMeses = Object.keys(horasPorMes).sort();
        const labels = sortedMeses.map(mes => new Date(mes+'-02').toLocaleString('pt-BR', {month: 'short', year: '2-digit'}));
        const data = sortedMeses.map(mes => horasPorMes[mes].toFixed(2));

        const ctx = document.getElementById('horasMensaisChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Horas Trabalhadas', data, backgroundColor: 'rgba(99, 102, 241, 0.6)', borderColor: 'rgba(99, 102, 241, 1)', borderWidth: 1 }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }
   function generateReport(startDate, endDate) {
        const reportEmpty = document.getElementById('report-empty-state');
        const reportWrapper = document.querySelector('#page-relatorios .table-wrapper');
        const reportBody = document.getElementById('report-body');

        const filteredRegistros = registros.filter(reg => {
            const dataReg = new Date(reg.data);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            if (start) start.setUTCHours(0,0,0,0);
            if (end) end.setUTCHours(23,59,59,999);
            if (start && dataReg < start) return false;
            if (end && dataReg > end) return false;
            return true;
        });
        
        reportBody.innerHTML = '';
        if (filteredRegistros.length === 0) {
            reportEmpty.style.display = 'block';
            reportWrapper.style.display = 'none';
            document.getElementById('report-summary').innerHTML = '';
            showToast('Nenhum registro encontrado para este período.', 'error');
            return null;
        }
        
        reportEmpty.style.display = 'none';
        reportWrapper.style.display = 'block';

        let totalMsPeriodo = 0;
        filteredRegistros.forEach(reg => {
            const totalMs = calculateTotalMs(reg);
            totalMsPeriodo += totalMs;
            const status = totalMs / 3600000 >= appSettings.metaHoras ? 'Completo' : 'Incompleto';
            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {timeZone: 'UTC'}).format(new Date(reg.data));
            const row = reportBody.insertRow();
            row.innerHTML = `<td>${dataFormatada}</td><td>${reg.chegada}</td><td>${reg.saidaAlmoco}</td><td>${reg.retornoAlmoco}</td><td>${reg.saidaFinal}</td><td>${formatMsToHours(totalMs)}</td><td><span class="status status-${status.toLowerCase()}">${status}</span></td><td>${reg.observacoes || ''}</td>`;
        });
        
        const mediaMs = totalMsPeriodo / filteredRegistros.length;
        document.getElementById('report-summary').innerHTML = `
            <div class="stat-card"><div class="stat-card-title">Total Horas (Período)</div><div class="stat-card-value">${formatMsToHours(totalMsPeriodo)}</div></div>
            <div class="stat-card"><div class="stat-card-title">Dias Registrados</div><div class="stat-card-value">${filteredRegistros.length}</div></div>
            <div class="stat-card"><div class="stat-card-title">Média Diária (Período)</div><div class="stat-card-value">${formatMsToHours(mediaMs)}</div></div>
        `;
        return filteredRegistros;
    }
    // --- Event Listeners (Aqui estão as principais mudanças) ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(link.dataset.target);
        });
    });

    // ALTERAÇÃO: Adicionar um novo registro
   // Bloco Corrigido
    document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const novoRegistro = {
        data: dataInput.value,
        chegada: document.getElementById('chegada').value,             // <-- Corrigido
        saidaAlmoco: document.getElementById('saida-almoco').value,   // <-- Corrigido
        retornoAlmoco: document.getElementById('retorno-almoco').value, // <-- Corrigido
        saidaFinal: document.getElementById('saida-final').value,     // <-- Corrigido
        observacoes: document.getElementById('observacoes').value,
    };
    //... o resto do try/catch continua igual

        try {
            const response = await fetch(`${API_URL}/registros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoRegistro),
            });
            if (!response.ok) throw new Error('Erro ao salvar registro.');
            
            await loadDataFromServer(); // Recarrega os dados do servidor
            updateAllViews(); // Atualiza a tela
            
            document.getElementById('registro-form').reset();
            dataInput.valueAsDate = new Date();
            showToast('Registro adicionado com sucesso!');

        } catch (error) {
            console.error(error);
            showToast('Falha ao adicionar registro.', 'error');
        }
    });
    
    // ALTERAÇÃO: Excluir um registro
    document.getElementById('registros-body').addEventListener('click', async (e) => {
        const btn = e.target.closest('.action-btn');
        if (btn) {
            const idParaExcluir = parseInt(btn.dataset.id, 10);
            if (confirm('Tem certeza que deseja excluir este registro?')) {
                try {
                    const response = await fetch(`${API_URL}/registros/${idParaExcluir}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Erro ao excluir registro.');

                    await loadDataFromServer(); // Recarrega os dados do servidor
                    updateAllViews(); // Atualiza a tela
                    showToast('Registro excluído.', 'error');
                    
                } catch (error) {
                    console.error(error);
                    showToast('Falha ao excluir registro.', 'error');
                }
            }
        }
    });

     document.getElementById('generate-report-btn').addEventListener('click', () => {
        const start = document.getElementById('report-start-date').value;
        const end = document.getElementById('report-end-date').value;
        generateReport(start, end);
    });
    
    document.getElementById('meta-horas-input').addEventListener('change', (e) => {
        appSettings.metaHoras = parseInt(e.target.value, 10);
        saveSettings();
        updateAllViews();
        showToast('Meta de horas atualizada!');
    });

    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
        appSettings.darkMode = e.target.checked;
        document.body.classList.toggle('dark-mode', appSettings.darkMode);
        saveSettings();
    });

    // ALTERAÇÃO: Excluir todos os registros
    document.getElementById('config-delete-all-btn').addEventListener('click', async () => {
        if (confirm('ATENÇÃO! ISSO APAGARÁ TODOS OS SEUS REGISTROS DO SERVIDOR. ESTA AÇÃO É IRREVERSÍVEL. Deseja continuar?')) {
            try {
                const response = await fetch(`${API_URL}/registros/all`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Erro ao apagar todos os registros.');
                
                registros = []; // Limpa o array local
                updateAllViews();
                showToast('Todos os dados foram apagados.', 'error');
                
            } catch (error) {
                console.error(error);
                showToast('Falha ao apagar todos os dados.', 'error');
            }
        }
    });

    // As funções de Backup e Restore (salvar/carregar arquivo) continuam funcionando no lado do cliente.
    // Elas salvarão ou carregarão os dados que estão ATUALMENTE na tela.
    const handleFileSave = (dataToSave, fileName) => {
        if (dataToSave.length === 0) { showToast('Não há dados para salvar.', 'error'); return; }
        const dataStr = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
    };
    
    document.getElementById('config-save-btn').addEventListener('click', () => handleFileSave(registros, 'backup_registros_completo.json'));
    document.getElementById('save-report-btn').addEventListener('click', () => {
        const start = document.getElementById('report-start-date').value;
        const end = document.getElementById('report-end-date').value;
        const filteredData = generateReport(start, end);
        if(filteredData) handleFileSave(filteredData, 'relatorio_horas.json');
    });

    // Substitua a função handleFileLoad inteira por esta
    const handleFileLoad = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (!Array.isArray(data)) {
                throw new Error('Arquivo JSON inválido. O conteúdo deve ser uma lista.');
            }

            // Envia os dados do arquivo para o novo endpoint no backend
            const response = await fetch(`${API_URL}/registros/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar o backup para o servidor.');
            }

            // Após o sucesso, recarrega os dados do servidor para atualizar a tela
            await loadDataFromServer();
            updateAllViews();
            showToast(`${data.length} registros carregados com sucesso!`);

        } catch (error) {
            console.error('Erro ao carregar backup:', error);
            showToast(error.message, 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Limpa o input de arquivo
};

    document.getElementById('config-load-btn').addEventListener('click', () => document.getElementById('file-input').click());
    document.getElementById('file-input').addEventListener('change', handleFileLoad);

    const handlePdfExport = (elementId, fileName) => {
        const element = document.getElementById(elementId);
        const tableBody = element.querySelector('tbody');

        if (!tableBody || tableBody.rows.length === 0) {
            showToast('Não há dados na tabela para exportar.', 'error');
            return;
        }

        element.classList.add('pdf-export-fix');
        document.querySelectorAll('.action-column, .action-header').forEach(el => el.style.display = 'none');
        
        const options = { margin: 10, filename: fileName, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } };
        
        html2pdf().set(options).from(element).save().finally(() => {
             element.classList.remove('pdf-export-fix');
             document.querySelectorAll('.action-column, .action-header').forEach(el => el.style.display = 'table-cell');
        });
    };
    document.getElementById('registros-pdf-btn').addEventListener('click', () => handlePdfExport('card-registros', 'relatorio_completo.pdf'));
    document.getElementById('pdf-report-btn').addEventListener('click', () => handlePdfExport('card-relatorio', 'relatorio_filtrado.pdf'));


    // --- Inicialização da Aplicação ---
    loadSettings();
    await loadDataFromServer(); // ALTERAÇÃO: Espera os dados do servidor antes de continuar
    updateAllViews();
    navigateToPage('page-dashboard');
    dataInput.valueAsDate = new Date();
});