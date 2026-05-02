const processJiraData = async (req, res) => {
  try {
    const { jiraText } = req.body;
    const file = req.file;

    if (!jiraText) {
      return res.status(400).json({ message: 'O texto do Jira é obrigatório.' });
    }

    // Aqui entraria a integração real com a IA (ex: OpenAI, Gemini) usando o jiraText e a imagem.
    // Como é um MVP inicial, vamos retornar um mock de cenário Gherkin para demonstração no front-end.
    
    const mockedGherkin = `Funcionalidade: Testar fluxo baseado no Jira
  Como um usuário
  Eu quero realizar uma ação
  Para obter um resultado

  Cenário: Sucesso na ação principal
    Dado que estou na página inicial
    Quando eu insiro os dados válidos
    E clico no botão de confirmar
    Então o sistema deve exibir uma mensagem de sucesso
`;

    res.status(200).json({ 
      message: 'Dados recebidos e processados com sucesso.',
      gherkin: mockedGherkin,
      fileReceived: file ? true : false
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar dados do Jira.', error: error.message });
  }
};

module.exports = { processJiraData };
