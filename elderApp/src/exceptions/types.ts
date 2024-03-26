
export enum Errors {
    ERROR_CAREGIVER_ALREADY_ADDED = "O pedido para o respetivo utilizador já foi enviado, ou já se encontra vinculado.",
    ERROR_STARTING_SESSION = "Não foi possível enviar o pedido, verifique se o email é válido.\n Tente novamente.",
    ERROR_SAVING_SESSION = "Não foi possível estabelecer a sessão, algo de inesperado aconteceu.\n Tente novamente.",

    ERROR_NO_CONNECTION_TO_NETWORK = "Sem conexão à internet, verifique a sua conexão e tente novamente.",
    ERROR_DATABASE_NOT_INITIALIZED = "A base de dados não foi inicializada. \n Tente novamente mais tarde.",

    ERROR_RETRIEVING_CREDENTIAL = "Não foi possível recuperar a credencial. \n Verifique se os dados fornecidos estão corretos.",
    ERROR_DELETING_CREDENTIAL = "Não foi possível eliminar a credencial. \n Verifique se os dados fornecidos estão corretos.",
    ERROR_UPDATING_CREDENTIAL = "Não foi possível atualizar a credencial. \n Verifique se os dados fornecidos estão corretos.",
    ERROR_CREATING_CREDENTIAL = "Não foi possível criar a credencial. \n Verifique se os dados fornecidos estão corretos.",
    ERROR_RETRIEVING_CREDENTIALS = "Não foi possível obter todas as credenciais. \n Verifique se os dados fornecidos estão corretos.",

    ERROR_INVALID_MESSAGE_OR_KEY = "Mensagem ou chave inválida.",
    ERROR_CREDENTIAL_INVALID_ID = "O id presente em data não corresponde ao id da credencial.",
    ERROR_CREDENTIAL_ON_CLOUD_OUTDATED = "Os dados da credencial na cloud estão desatualizados.",
    
    ERROR_CREATING_TIMEOUT = "Não foi possível criar o timeout.",
    ERROR_UPDATING_TIMEOUT = "Não foi possível atualizar o timeout.",
    ERROR_GETTING_TIMEOUT = "Não foi possível obter o timeout.",

    ERROR_DELETING_CAREGIVER = "Não foi possível eliminar o cuidador.",
}