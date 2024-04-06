
export const enum FlashMessage {
  //Messages to be used on copyValue function:
  uriCopied = 'URI COPIADO!!',
  usernameCopied = 'UTILIZADOR COPIADO!!',
  passwordCopied = 'PASSWORD COPIADA!!',

  //Messages to be used on editMode:
  editModeActive = 'MODO EDIÇÃO ATIVADO',
  editCredentialCompleted = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
  personalInfoUpdated = 'INFORMAÇÕES PESSOAIS ATUALIZADAS COM SUCESSO!',

  elderlyPersonalInfoUpdated = 'O IDOSO ATUALIZOU OS SEUS DADOS PESSOAIS!',

  sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
  sessionRequestReceived = 'PEDIDO DE SESSÃO RECEBIDO!',
  sessionEnded = 'RELAÇÃO COM O IDOSO TERMINADA!',
  sessionEndedByElderly = 'O IDOSO TERMINOU A RELAÇÃO!',
  sessionAccepted = 'A CONEXÃO FOI ESTABELECIDA!',
  sessionRejected = 'A CONEXÃO NÃO FOI ESTABELECIDA!',
  sessionRequestCanceled = 'O IDOSO CANCELOU O PEDIDO DE SESSÃO!',

  elderlyReject = 'O IDOSO REJEITOU A CONEXÃO!',
  elderlyAccept = 'O IDOSO ACEITOU A CONEXÃO!',
  editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
  credentialCreated = 'CREDENCIAL ADICIONADA!',
  credentialDeleted = 'CREDENCIAL ELIMINADA!',
  credentialUpdated = 'CREDENCIAL ATUALIZADA!',

  credentialUpdatedByElderly = 'O IDOSO ATUALIZOU UMA CREDENCIAL!',
  credentialCreatedByElderly = 'O IDOSO ADICIONOU UMA CREDENCIAL NOVA!',
  credentialDeletedByEdlerly = 'O IDOSO ELIMINOU UMA CREDENCIAL!',

  cantAcceptConnection = 'VOÇÊ NÃO PODE ACEITAR MAIS CONEXÕES!',
  elderlyCantAcceptConnection = 'O IDOSO NÃO PODE ACEITAR MAIS CONEXÕES!',

  elderlyPermissionsReceived = 'PERMISSÕES ALTERADAS!',
  sessionVerified = 'SESSÃO VERIFICADA!',
}
  
//DESCRIPTIONS:
/*Descriptions to be used on copyValue function:*/
export const copyPasswordDescription = `A password foi guardada no clipboard.`
export const copyUsernameDescription = `O username foi guardado no clipboard.`
export const copyURIDescription = `O URI foi guardado no clipboard.`

/*Descriptions to be used on credentials operations*/
export const credentialCreatedDescription = (platform: string) => `A credencial de ${platform} foi adicionada com sucesso! 🚀`
export const credentialDeletedDescription = (platform: string) => `A credencial de ${platform} foi eliminada com sucesso! ❌`
export const credentialUpdatedDescription = (platform: string) => `A credencial de ${platform} foi atualizada com sucesso! 🔧`

/*Descriptions to be used on editMode:*/
export const editModeActiveDescription = `Pense bem antes de realizar qualquer alteração. 🤔`
export const editModeCanceledDescription = `O modo de edição foi cancelado, as alterações não foram guardadas. ❌`

export const personalInfoUpdatedDescription = `As suas informações pessoais foram atualizadas com sucesso! 🚀`

export const elderlyPersonalInfoUpdatedDescription = (elderlyEmail: string) => `O idoso com o email ${elderlyEmail} atualizou os seus dados pessoais! 😎`

export const sessionRequestSentDescription = (elderlyEmail: string) => `O pedido de sessão foi enviado com sucesso para o idoso ${elderlyEmail}! 🚀`

export const sessionRequestReceivedDescription = (elderlyEmail: string) => `O idoso com o email ${elderlyEmail} enviou-lhe um pedido de conexão. 💗`

export const sessionEndedDescription = (elderlyEmail: string) => `A relação com o idoso ${elderlyEmail} foi terminada! 😢`

export const sessionAcceptedDescription = (elderlyEmail: string) => `A conexão com o idoso ${elderlyEmail} foi estabelecida! 🚀`

export const sessionRejectedDescription = (elderlyEmail: string) => `A conexão com o idoso ${elderlyEmail} foi rejeitada! ❌`

export const maxNumberOfConnectionsDescription = (elderlyEmail: string) => `O número máximo de conexões foi atingido, a conexão com o idoso ${elderlyEmail} foi rejeitada 🚫`

export const maxNumberOfConnectionsElderlyDescription = (elderlyEmail: string) => `O número máximo de conexões foi atingido, o idoso ${elderlyEmail} não pode aceitar mais conexões! 🚫`

export const credentialUpdatedByElderlyDescription = (elderlyEmail: string, platform: string) => `O idoso com o email ${elderlyEmail} atualizou a credencial ${platform}! 🔧`

export const credentialCreatedByElderlyDescription = (elderlyEmail: string, platform: string) => `O idoso com o email ${elderlyEmail} adicionou a credencial ${platform}! ⭐️`

export const credentialDeletedByElderlyDescription = (elderlyEmail: string, platform: string) => `O idoso com o email ${elderlyEmail} eliminou a credencial ${platform}! ❌`

export const permissionsChangedDescription = (elderlyEmail: string) => `As permissões sobre os dados do idoso com o email ${elderlyEmail} foram alteradas pelo mesmo! 🔧`

export const sessionVerifiedDescription = (elderlyEmail: string) => `A sessão com o idoso ${elderlyEmail} foi verificada pelo mesmo, e já tem acessos de leitura! 🎉`

export const sessionRequestCanceledDescription = (elderlyEmail: string) => `O idoso com o email ${elderlyEmail} cancelou o pedido de sessão! ❌`