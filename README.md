# Horas Pro (Versão Flask)

Uma aplicação web completa e moderna para gerenciamento de horas de estágio, construída com **Python** e **Flask**. Esta versão utiliza um banco de dados **SQLite** para persistência de dados, transformando o Horas Pro em uma solução robusta para ser executada localmente em sua máquina.

<img width="1883" height="835" alt="horas_pro" src="https://github.com/user-attachments/assets/127e939d-746b-49d7-8295-5c01a6575f3c" />

## 🚀 Principais Funcionalidades

* **Dashboard Interativo:** Tenha uma visão geral com KPIs (total de horas, média diária) e um gráfico de horas trabalhadas por mês.
* **Registro Detalhado:** Adicione, edite e remova registros de horas com facilidade, incluindo entrada, almoço e saída.
* **Relatórios com Filtro:** Gere relatórios detalhados para períodos específicos com apenas alguns cliques.
* **Exportação Profissional:** Exporte seus relatórios completos ou filtrados para os formatos **PDF** e **JSON**.
* **Persistência de Dados Robusta:** Seus dados são salvos em um arquivo de banco de dados (`horas.db`) em sua máquina, garantindo segurança e privacidade.
* **Configurações Personalizáveis:**
    * Defina sua própria meta de horas diárias.
    * Alterne para o **Modo Escuro (Dark Mode)** para maior conforto visual.
* **Design Moderno e Responsivo:** A interface se adapta perfeitamente a desktops, tablets e celulares.

## 🛠️ Stack de Tecnologia

Esta versão evoluiu para uma aplicação full-stack:

* **Backend:** Python 3, Flask, Flask-SQLAlchemy
* **Banco de Dados:** SQLite
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Bibliotecas Externas:** Chart.js, html2pdf.js, Font Awesome

## ⚙️ Como Rodar (Versão Flask Local)

Para usar esta versão em sua máquina, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/JoaoPedro-Costa-Oliveira/Horas-Pro.git](https://github.com/JoaoPedro-Costa-Oliveira/Horas-Pro.git)
    cd Horas-Pro
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    # No Windows
    python -m venv venv
    .\venv\Scripts\activate

    # No macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Execute a aplicação:**
    ```bash
    python app.py
    ```
    *(O arquivo principal do Flask deve se chamar `app.py` e estar na raiz do projeto)*

4.  **Acesse no navegador:**
    Abra seu navegador e acesse 

---

## ✨ Versão Legacy / Demo Online (JavaScript Puro)

Uma versão original e mais simples deste projeto, que roda 100% no navegador usando `localStorage`, continua disponível para demonstração ao vivo e para quem busca uma solução "zero-instalação".

➡️ **[Acessar o Demo Online (hospedado no Netlify)](https://horas-pro.netlify.app/)**

O código-fonte desta versão está preservado no ramo [`old-demo-js`](https://github.com/JoaoPedro-Costa-Oliveira/Horas-Pro/tree/javascript-puro).

### Funcionalidades da Versão JavaScript
* **Tudo em um arquivo:** HTML, CSS e JS em um único local para máxima portabilidade.
* **Salvamento Automático no Navegador:** Utiliza `localStorage` para persistir os dados.
* **Sem necessidade de servidor:** Basta abrir o arquivo HTML no navegador.
