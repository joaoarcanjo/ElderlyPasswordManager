
export const enum FlashMessage {
    //Messages to be used on copyValue function:
    uriCopied = 'URI COPIADO!!',
    usernameCopied = 'UTILIZADOR COPIADO!!',
    passwordCopied = 'PASSWORD COPIADA!!',

    //Messages to be used on editMode:
    editModeActive = 'MODO EDIÇÃO ATIVADO',
    editCredentialCompleted = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
    personalInfoUpdated = 'INFORMAÇÕES PESSOAIS ATUALIZADAS COM SUCESSO!',

    caregiverPersonalInfoUpdated = 'O CUIDADOR ATUALIZOU OS SEUS DADOS PESSOAIS!',

    sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
    sessionRequestReceived = 'PEDIDO DE SESSÃO RECEBIDO!',
    sessionEnded = 'RELAÇÃO COM O CUIDADOR TERMINADA!',
    sessionEndedByCaregiver = 'O CUIDADOR TERMINOU A RELAÇÃO!',
    sessionAccepted = 'A CONEXÃO FOI ESTABELECIDA!',
    sessionRejected = 'A CONEXÃO NÃO FOI ESTABELECIDA!',
    sessionRequestCanceled = 'O IDOSO CANCELOU O PEDIDO DE SESSÃO!',

    caregiverReject = 'O CUIDADOR REJEITOU A CONEXÃO!',
    caregiverAccept = 'O CUIDADOR ACEITOU A CONEXÃO!',
    editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
    credentialCreated = 'CREDENCIAL ADICIONADA!',
    credentialDeleted = 'CREDENCIAL ELIMINADA!',
    credentialUpdated = 'CREDENCIAL ATUALIZADA!',

    credentialUpdatedByCaregiver = 'O CUIDADOR ATUALIZOU UMA CREDENCIAL!',
    credentialCreatedByCaregiver = 'O CUIDADOR ADICIONOU UMA CREDENCIAL NOVA!',
    credentialDeletedByCaregiver = 'O CUIDADOR ELIMINOU UMA CREDENCIAL!',

    cantAcceptConnection = 'VOÇÊ NÃO PODE ACEITAR MAIS CONEXÕES!',
    caregiverCantAcceptConnection = 'O CUIDADOR NÃO PODE ACEITAR MAIS CONEXÕES!',
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

export const caregiverPersonalInfoUpdatedDescription = (caregiverEmail: string) => `O cuidador com o email ${caregiverEmail} atualizou os seus dados pessoais! 😎`

export const sessionRequestSentDescription = (caregiverEmail: string) => `O pedido de sessão foi enviado com sucesso para o cuidador ${caregiverEmail}! 🚀`

export const sessionRequestReceivedDescription = (caregiverEmail: string) => `O cuidador com o email ${caregiverEmail} enviou-lhe um pedido de conexão. 💗`

export const sessionEndedDescription = (caregiverEmail: string) => `A relação com o cuidador ${caregiverEmail} foi terminada! 😢`

export const sessionAcceptedDescription = (caregiverEmail: string) => `A conexão com o cuidador ${caregiverEmail} foi estabelecida! 🚀`

export const sessionRejectedDescription = (caregiverEmail: string) => `A conexão com o cuidador ${caregiverEmail} foi rejeitada! ❌`

export const maxNumberOfConnectionsDescription = (caregiverEmail: string) => `O número máximo de conexões foi atingido, a conexão com o cuidador ${caregiverEmail} foi rejeitada 🚫`

export const maxNumberOfConnectionsCaregiverDescription = (caregiverEmail: string) => `O número máximo de conexões foi atingido, o cuidador ${caregiverEmail} não pode aceitar mais conexões! 🚫`

export const credentialUpdatedByCaregiver = (caregiverEmail: string, platform: string) => `O cuidador com o email ${caregiverEmail} atualizou a credencial ${platform}! 🔧`

export const credentialCreatedByCaregiver = (caregiverEmail: string, platform: string) => `O cuidador com o email ${caregiverEmail} adicionou a credencial ${platform}! ⭐️`

export const credentialDeletedByCaregiver = (caregiverEmail: string, platform: string) => `O cuidador com o email ${caregiverEmail} eliminou a credencial ${platform}! ❌`

export const sessionRequestCanceledDescription = (caregiverEmail: string) => `O cuidador com o email ${caregiverEmail} cancelou o pedido de sessão! ❌`