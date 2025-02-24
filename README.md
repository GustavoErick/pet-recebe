# :checkered_flag: PET RECEBE 

Uma plataforma web que informatiza e facilita o gerenciamento do projeto PET Recebe, possibilitando a solicitação de visitas técnicas ao campus da UFC em Quixadá e promovendo maior interação com o público-alvo.

## :technologist: Membros da equipe

Gustavo Erick Viana Leandro - 536884  
Beatriz Nascimento de Oliveira - 537634  
Lucas Anthony Soares de Sousa - 539300

## :bulb: Objetivo Geral

Informatizar os processos do projeto PET Recebe, com foco no gerenciamento das solicitações de visitas técnicas e na divulgação das atividades realizadas pelo projeto.

## :eyes: Público-Alvo


- Escolas de ensino médio e técnico interessadas em realizar visitas técnicas ao campus da UFC em Quixadá;  
- Estudantes que desejam conhecer o ambiente acadêmico e os cursos de tecnologia da informação.

## :star2: Impacto Esperado  

- Aumento na eficiência e organização das solicitações de visitas;  
- Melhoria na experiência dos visitantes ao proporcionar informações detalhadas sobre o campus, cursos e atividades acadêmicas;  
- Maior visibilidade para os cursos e projetos do campus, atraindo potenciais alunos.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

- **Usuário não logado:** Acessa informações públicas, como fotos, feedbacks, e detalhes sobre o campus e cursos.  
- **Responsável pela escola:** Usuário logado que realiza a solicitação de visitas e gerencia informações sobre a escola.  
- **Administrador:** Bolsista PET que gerencia as solicitações e aprova ou recusa visitas.

> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

#### **Usuário não logado:**  
- Visualização de páginas com informações sobre o projeto e o campus.  

#### **Usuário logado (responsável):**  
- CRUD de perfil de usuário;  
- Solicitação de visita;  
- Cadastro de escola;  
- Visualização de histórico de solicitações (pendentes, confirmadas, recusadas).  

#### **Administrador:**  
- Gerenciamento de solicitações de visita (aprovar, recusar);  
- Cadastro de escola.  

## :spiral_calendar: Entidades ou tabelas do sistema

- **Usuário:**  
  - E-mail
  - Senha  
  - Nome  
  - Número de telefone  
  - Cargo (professor, coordenador, diretor, outro)  

- **Escola:**  
  - Nome  
  - Cidade  
  - Tipo (EEEP, Ensino Regular, IF, Outro)  

- **Visita:**  
  - Relacionamento com responsável  
  - Relacionamento com escola  
  - Quantidade de alunos  
  - Série  
  - Curso (opcional)  
  - Data  
  - Duração (horário de início e fim)  

- **Feedback:**  
  - Relacionamento com visita
  - Relacionamento com usuário  
  - Avaliação


----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

- HTML
- CSS
- JavaScript

**Backend:**

- Strapi


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Usuário | X | X | X | X |
| Escola | X | X |   |  |
| Visita | X | X | X | X |
| Avaliação | X | X | X | X |


## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/entidade1/|
| POST | api/entidade2 |
