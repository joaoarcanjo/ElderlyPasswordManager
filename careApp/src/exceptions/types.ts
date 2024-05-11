
export enum Errors {
    ERROR_ELDERLY_REQUEST_ALREADY_SENT = "O pedido para o respetivo utilizador já foi enviado, ou já se encontra vinculado.",
    ERROR_ELDERLY_ALREADY_ADDED = "O idoso já se encontra adicionado.",
    ERROR_STARTING_SESSION = "Não foi possível enviar o pedido, verifique se o email é válido.\n Tente novamente.",
    ERROR_USER_EMAIL = "O email fornecido é o seu email, não se pode vincular a si mesmo.",
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

    ERROR_DELETING_SESSION = "Não foi possível eliminar a sessão.",
    ERROR_UPDATING_SESSION = "Não foi possível atualizar a sessão.",
    ERROR_CREATING_SESSION = "Não foi possível criar a sessão.",
    ERROR_RETRIEVING_SESSION = "Não foi possível recuperar a sessão.",

    ERROR_GETTING_GENERATED_PASSWORDS = "Não foi possível obter as passwords geradas.",
    
    ERROR_SERVER_INTERNAL_ERROR = 'Erro interno, tente novamente mais tarde ou contacte o administrador. A comunicação com o idoso não está disponível \n#1',

    ERROR_EMAIL_ALREADY_IN_USE = 'O email fornecido já está em uso.',
    ERROR_EMAIL_INVALID = 'O email fornecido é inválido.',
    ERROR_PASSWORD_MISSING = 'É necessário inserir a password.',
    ERROR_PASSWORD_WEAK = 'A password necessita de pelo menos 6 caracteres.',
    ERROR_USER_NOT_FOUND = 'Email não encontrado. Verifique suas credenciais.',
    ERROR_WRONG_PASSWORD = 'Senha incorreta. Verifique suas credenciais.',
    ERROR_NETWORK_REQUEST_FAILED = 'Não se encontra contectado à sua internet. Tente mais tarde.',
    ERROR_LOGIN = 'Ocorreu um erro durante o login. Tente novamente.',
    ERROR_SIGNUP = 'Ocorreu um erro durante o registo. Tente novamente.',
    ERROR_EMAIL_NOT_FOUND = 'Email não encontrado. Verifique suas credenciais.',
}