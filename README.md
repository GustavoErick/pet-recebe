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

- Usuário não logado;
- Responsável pela escola (usuário logado);
- Administrador. 
- Login do Administrador -> email: petsi@email.com, senha: senha123

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

#### **Usuário não logado:**  
- Visualização de páginas com informações públicas, como fotos, informações do projeto e dúvidas frequentes.  

#### **Usuário logado (responsável):**  
- Visualizar e atualizar seus dados;
- Visualizar, criar, atualizar e deletar solicitações de visitas;  
- Cadastrar escola;  
- Visualizar, criar, editar e deletar avaliações de visitas;

#### **Administrador:**  
- Gerenciar solicitações de visita (aprovar, recusar);
- Visualizar histórico de solicitações de visitas de todos os usuários;

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
  - Situação (confirmada, pendente, recusada)   
  - Série  
  - Curso (opcional)  
  - Data  
  - Duração (horário de início e fim)  

- **Avaliação:**  
  - Relacionamento com visita
  - Relacionamento com usuário  
  - Avaliação

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

- HTML
- CSS
- JavaScript
- Axios

**Backend:**

- Strapi


## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Usuário | X | X | X |  |
| Escola | X | X |  |  |
| Visita | X | X | X | X |
| Feedback | X | X | X | X |


## :neckbeard: Rotas da API REST utilizadas

## Endpoints da API

### Autenticação
| Método HTTP | URL |
|------------|--------------------------------|
| POST       | api/auth/local/register       |
| POST       | api/auth/local                |

### Usuário
| Método HTTP | URL |
|------------|--------------------------------|
| GET        | api/users/me                  |
| GET        | api/users/me?populate=role    |
| GET        | api/users/${userId}           |
| PUT        | api/users/${userId}           |

### Escola
| Método HTTP | URL |
|------------|--------------------------------|
| GET        | api/escolas                   |
| POST       | api/escolas                   |

### Visita
| Método HTTP | URL |
|------------|-----------------------------------------------------------|
| GET        | api/visitas                                               |
| GET        | api/visitas?populate=*                                    |
| GET        | api/visitas/${documentIdVisita}?populate=*                |
| GET        | api/visitas?filters[responsavel][$eq]=${userId}&populate=* |
| GET        | api/visitas?filters[situacao][$eq]=Pendente&populate=*     |
| POST       | api/visitas                                               |
| PUT        | api/visitas/${documentIdVisita}                           |
| DELETE     | api/visitas/${documentIdVisita}                           |

### Avaliação
| Método HTTP | URL |
|------------|-----------------------------------------------------------|
| GET        | api/avaliacaos?filters[responsavel][$eq]=${userId}&populate=visita.escola |
| POST       | api/avaliacaos/                                           |
| PUT        | api/avaliacaos/${documentIdAvaliacao}                     |
| DELETE     | api/avaliacaos/${documentIdAvaliacao}                     |


