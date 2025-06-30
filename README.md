# Horas Pro - Controle de Horas de Estágio

Uma aplicação web completa e moderna para gerenciamento de horas de estágio, construída como um arquivo único HTML, CSS e JavaScript, sem a necessidade de backend ou dependências complexas.

[horas_pro](https://github.com/user-attachments/assets/74c2be18-128e-4b9f-ac5f-ddbb7cede0ee)


## 🚀 Principais Funcionalidades

* **Dashboard Interativo:** Tenha uma visão geral com KPIs (total de horas, média diária) e um gráfico de horas trabalhadas por mês.
* **Registro Detalhado:** Adicione, edite e remova registros de horas com facilidade, incluindo entrada, almoço e saída.
* **Relatórios com Filtro:** Gere relatórios detalhados para períodos específicos com apenas alguns cliques.
* **Exportação Profissional:** Exporte seus relatórios completos ou filtrados para os formatos **PDF** e **JSON**.
* **Persistência Automática:** Seus dados são salvos automaticamente no navegador. Feche a aba e continue de onde parou.
* **Backup e Restauração:** Faça backups manuais em formato JSON para garantir a segurança dos seus dados ou para transferi-los entre computadores.
* **Configurações Personalizáveis:**
    * Defina sua própria meta de horas diárias.
    * Alterne para o **Modo Escuro (Dark Mode)** para maior conforto visual.
* **Design Moderno e Responsivo:** A interface se adapta perfeitamente a desktops, tablets e celulares.

## 🛠️ Como Foi Feito (Stack de Tecnologia)

Este projeto foi construído do zero, utilizando apenas tecnologias web front-end, tornando-o extremamente leve e portátil.

* **Estrutura:** HTML5 semântico.
* **Estilização:** CSS3 moderno, com:
    * **Variáveis CSS** para fácil gerenciamento de temas (Claro e Escuro).
    * **Flexbox** e **Grid Layout** para criar layouts complexos e responsivos.
    * Animações e transições sutis para uma melhor experiência de usuário.
* **Funcionalidade:** JavaScript (ES6+), sem frameworks, para manter o código leve e com total controle sobre o DOM.

### Bibliotecas Externas (via CDN)

* **Chart.js:** Para a criação dos gráficos interativos no Dashboard.
* **html2pdf.js:** Para a funcionalidade de exportação de tabelas para o formato PDF.
* **Font Awesome:** Para a utilização de ícones em toda a interface.

## ⚙️ Como Usar

A beleza deste projeto está na sua simplicidade.

1.  Baixe o arquivo `app_horas_final.html`.
2.  Abra este arquivo diretamente no seu navegador de internet preferido (Google Chrome, Firefox, Edge, etc.).
3.  Pronto! A aplicação é totalmente funcional.

## ✨ Funcionalidades em Detalhe

### Persistência de Dados Híbrida

O **Horas Pro** utiliza uma abordagem híbrida para garantir que você nunca perca seus dados:

1.  **Salvamento Automático (`localStorage`):** Para o uso diário, a aplicação salva cada alteração (adição ou exclusão de registros) no armazenamento local do seu navegador. Isso garante que, ao fechar e abrir a aba, seus dados permaneçam intactos.
2.  **Backup Manual (JSON):** Na aba de Configurações, você pode salvar um arquivo de backup (`.json`) em seu computador. Isso é ideal para criar pontos de restauração ou para migrar seus dados para outro navegador ou máquina.

### Exportação de PDF Inteligente

A exportação para PDF foi projetada para funcionar perfeitamente, independentemente de você estar usando o tema claro ou escuro. O código aplica um "tema de impressão" temporário antes de gerar o arquivo, garantindo que o PDF final seja sempre legível (texto preto sobre fundo branco).

## 🚀 Bônus: Publicando seu App de Graça com o GitHub Pages

Você pode hospedar esta aplicação na internet gratuitamente usando o GitHub Pages.

1.  **Crie um repositório** no GitHub.
2.  **Faça o upload** do arquivo `app_horas_final.html` para este repositório.
3.  **Renomeie** o arquivo para `index.html`. Este passo é crucial.
4.  No seu repositório, vá em **Settings > Pages**.
5.  Na seção "Branch", selecione a branch `main` (ou `master`) e a pasta `/root`. Clique em **Save**.
6.  Aguarde alguns minutos. Sua aplicação estará no ar no endereço: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## ⚖️ Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
